import { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import Svg, { Path, Polyline } from 'react-native-svg';
import type { DeckItem, LearningCard, UserProgress, GlossaryEntry, Tier } from '../types';
import { isQuizCard } from '../types';
import LearningCardContent from './LearningCard';
import QuizCard from './QuizCard';
import { C, tierColor, tierBg } from '../constants/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

const NEXT_TIER: Record<Tier, Tier | null> = {
  junior: 'mid',
  mid: 'senior',
  senior: null,
};

// ── DraggableTopCard ──────────────────────────────────────────────────────────

interface DraggableTopCardProps {
  card: DeckItem;
  cardIndex: number;
  totalCards: number;
  isBookmarked: boolean;
  onSwipeRight: (card: DeckItem) => void;
  onSwipeLeft: (card: DeckItem) => void;
  onToggleBookmark: (id: string) => void;
  onDiscoverAbbrev: (entry: GlossaryEntry) => void;
  onRecordQuizResult: (quizId: string, correct: boolean) => void;
}

function DraggableTopCard({
  card,
  cardIndex,
  totalCards,
  isBookmarked,
  onSwipeRight,
  onSwipeLeft,
  onToggleBookmark,
  onDiscoverAbbrev,
  onRecordQuizResult,
}: DraggableTopCardProps) {
  const translateX = useSharedValue(0);
  const exiting = useSharedValue(false);

  const fireRight = useCallback(() => onSwipeRight(card), [card, onSwipeRight]);
  const fireLeft = useCallback(() => onSwipeLeft(card), [card, onSwipeLeft]);

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-20, 20])
    .onUpdate((e) => {
      if (!exiting.value) translateX.value = e.translationX;
    })
    .onEnd((e) => {
      'worklet';
      if (exiting.value) return;
      if (e.translationX > 90 || e.velocityX > 550) {
        exiting.value = true;
        translateX.value = withTiming(SCREEN_WIDTH + 150, { duration: 320 }, (done) => {
          if (done) runOnJS(fireRight)();
        });
      } else if (e.translationX < -90 || e.velocityX < -550) {
        exiting.value = true;
        translateX.value = withTiming(-(SCREEN_WIDTH + 150), { duration: 320 }, (done) => {
          if (done) runOnJS(fireLeft)();
        });
      } else {
        translateX.value = withSpring(0, { stiffness: 420, damping: 34 });
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-320, 0, 320],
      [-22, 0, 22],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ translateX: translateX.value }, { rotate: `${rotate}deg` }],
    };
  });

  const doneOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, 70], [0, 1], Extrapolation.CLAMP),
  }));

  const skipOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-70, 0], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.card, styles.cardTop, cardStyle]}>
        {/* Done overlay */}
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.overlayDone, doneOpacity]}
          pointerEvents="none"
        >
          <Text style={styles.swipeLabelDone}>DONE</Text>
        </Animated.View>

        {/* Skip overlay */}
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.overlaySkip, skipOpacity]}
          pointerEvents="none"
        >
          <Text style={styles.swipeLabelSkip}>SKIP</Text>
        </Animated.View>

        {isQuizCard(card) ? (
          <QuizCard
            quiz={card}
            onAnswer={(id, correct) => onRecordQuizResult(id, correct)}
          />
        ) : (
          <LearningCardContent
            card={card as LearningCard}
            cardIndex={cardIndex}
            totalCards={totalCards}
            onDiscover={onDiscoverAbbrev}
            isBookmarked={isBookmarked}
            onToggleBookmark={onToggleBookmark}
          />
        )}
      </Animated.View>
    </GestureDetector>
  );
}

// ── CardDeck ──────────────────────────────────────────────────────────────────

interface CardDeckProps {
  deck: DeckItem[];
  progress: UserProgress;
  onMarkComplete: (id: string) => void;
  onMarkSkipped: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onDiscoverAbbrev: (entry: GlossaryEntry) => void;
  onRecordQuizResult: (quizId: string, correct: boolean) => void;
  onSetCurrentIndex: (index: number) => void;
  onSetCurrentTier: (tier: Tier) => void;
  isCompleted: (id: string) => boolean;
  isBookmarked: (id: string) => boolean;
}

export default function CardDeck({
  deck,
  progress,
  onMarkComplete,
  onMarkSkipped,
  onToggleBookmark,
  onDiscoverAbbrev,
  onRecordQuizResult,
  onSetCurrentIndex,
  onSetCurrentTier,
  isBookmarked,
}: CardDeckProps) {
  const [deckIndex, setDeckIndex] = useState(() =>
    Math.min(progress.currentIndex, Math.max(0, deck.length - 1)),
  );

  const currentCard = deck[deckIndex];
  const peekCards = deck.slice(deckIndex + 1, deckIndex + 4);

  const learningCardIndex = useMemo(
    () => deck.slice(0, deckIndex + 1).filter((d) => !isQuizCard(d)).length - 1,
    [deck, deckIndex],
  );
  const totalLearning = deck.filter((d) => !isQuizCard(d)).length;

  const advance = useCallback(
    (nextIndex: number) => {
      setDeckIndex(nextIndex);
      onSetCurrentIndex(nextIndex);
    },
    [onSetCurrentIndex],
  );

  const handleSwipeRight = useCallback(
    (card: DeckItem) => {
      if (!isQuizCard(card)) onMarkComplete(card.id);
      advance(deckIndex + 1);
    },
    [deckIndex, onMarkComplete, advance],
  );

  const handleSwipeLeft = useCallback(
    (card: DeckItem) => {
      if (!isQuizCard(card)) onMarkSkipped(card.id);
      advance(deckIndex + 1);
    },
    [deckIndex, onMarkSkipped, advance],
  );

  const handleNextTier = useCallback(() => {
    const next = NEXT_TIER[progress.currentTier];
    if (next) {
      onSetCurrentTier(next);
      setDeckIndex(0);
    }
  }, [progress.currentTier, onSetCurrentTier]);

  // Completion screen
  if (!currentCard || deckIndex >= deck.length) {
    const nextTier = NEXT_TIER[progress.currentTier];
    const tierLabel = progress.currentTier.charAt(0).toUpperCase() + progress.currentTier.slice(1);
    const color = tierColor(progress.currentTier);
    const bg = tierBg(progress.currentTier);

    return (
      <View style={styles.completionContainer}>
        <View style={[styles.completionIcon, { backgroundColor: bg }]}>
          <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
            <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <Polyline points="22,4 12,14.01 9,11.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </View>
        <Text style={styles.completionTitle}>{tierLabel} Complete</Text>
        <Text style={styles.completionSubtitle}>
          {nextTier
            ? `You've finished all ${tierLabel} cards. Ready to level up?`
            : "You've completed the entire BlazorPath curriculum. You're a Blazor pro."}
        </Text>
        <View style={styles.completionActions}>
          {nextTier && (
            <TouchableOpacity style={styles.btnPrimary} onPress={handleNextTier} activeOpacity={0.85}>
              <Text style={styles.btnPrimaryText}>
                Move to {nextTier.charAt(0).toUpperCase() + nextTier.slice(1)} →
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => { setDeckIndex(0); onSetCurrentIndex(0); }}
            activeOpacity={0.85}
          >
            <Text style={styles.btnSecondaryText}>Restart {tierLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.deckContainer}>
      <View style={styles.stackWrapper}>
        {/* Peek cards (rendered back to front) */}
        {[...peekCards].reverse().map((card, ri) => {
          const depth = peekCards.length - ri;
          const scale = 1 - depth * 0.04;
          const translateY = depth * 10;
          return (
            <Animated.View
              key={card.id}
              style={[
                styles.card,
                styles.peekCard,
                {
                  transform: [{ scale }, { translateY }],
                  zIndex: 10 - depth,
                },
              ]}
              pointerEvents="none"
            />
          );
        })}

        {/* Top draggable card */}
        <View style={styles.topCardWrapper}>
          <DraggableTopCard
            key={currentCard.id}
            card={currentCard}
            cardIndex={learningCardIndex}
            totalCards={totalLearning}
            isBookmarked={isBookmarked(currentCard.id)}
            onSwipeRight={handleSwipeRight}
            onSwipeLeft={handleSwipeLeft}
            onToggleBookmark={onToggleBookmark}
            onDiscoverAbbrev={onDiscoverAbbrev}
            onRecordQuizResult={onRecordQuizResult}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  deckContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  stackWrapper: {
    flex: 1,
    position: 'relative',
  },
  card: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: C.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  cardTop: {
    zIndex: 20,
  },
  peekCard: {
    overflow: 'hidden',
  },
  topCardWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 20,
  },
  overlayDone: {
    borderRadius: 16,
    zIndex: 5,
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  overlaySkip: {
    borderRadius: 16,
    zIndex: 5,
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  swipeLabelDone: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: C.green,
    borderWidth: 2,
    borderColor: C.green,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 12,
    marginLeft: 24,
    transform: [{ rotate: '-12deg' }],
  },
  swipeLabelSkip: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: C.amber,
    borderWidth: 2,
    borderColor: C.amber,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 24,
    transform: [{ rotate: '12deg' }],
  },
  completionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  completionIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: C.ink,
    textAlign: 'center',
  },
  completionSubtitle: {
    fontSize: 14,
    color: C.inkMuted,
    lineHeight: 22.4,
    maxWidth: 260,
    textAlign: 'center',
  },
  completionActions: {
    gap: 10,
    width: '100%',
    marginTop: 8,
  },
  btnPrimary: {
    backgroundColor: C.accent,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  btnSecondary: {
    backgroundColor: C.bgInput,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  btnSecondaryText: {
    color: C.inkMuted,
    fontSize: 15,
    fontWeight: '600',
  },
});
