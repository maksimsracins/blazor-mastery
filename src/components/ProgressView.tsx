import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
} from 'react-native';
import Svg, { Path, Rect, Polygon } from 'react-native-svg';
import type { UserProgress, Tier, DeckItem, LearningCard, GlossaryEntry } from '../types';
import { isQuizCard } from '../types';
import LearningCardContent from './LearningCard';
import { C, tierColor } from '../constants/colors';

const TIER_ORDER: Tier[] = ['junior', 'mid', 'senior'];
const TIER_LABEL: Record<Tier, string> = {
  junior: 'Junior',
  mid: 'Mid-Level',
  senior: 'Senior',
};

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

interface ProgressViewProps {
  progress: UserProgress;
  deck: DeckItem[];
  getTierProgress: (tier: Tier, deck: DeckItem[]) => { completed: number; total: number };
  getQuizScore: (tier: Tier, deck: DeckItem[]) => { correct: number; total: number; attempted: number };
  onSetCurrentTier: (tier: Tier) => void;
  onResumeLearn: () => void;
  onToggleBookmark: (id: string) => void;
  onDiscoverAbbrev: (entry: GlossaryEntry) => void;
  isBookmarked: (id: string) => boolean;
}

export default function ProgressView({
  progress,
  deck,
  getTierProgress,
  getQuizScore,
  onSetCurrentTier,
  onResumeLearn,
  onToggleBookmark,
  onDiscoverAbbrev,
  isBookmarked,
}: ProgressViewProps) {
  const [sheetCard, setSheetCard] = useState<LearningCard | null>(null);

  const bookmarkedItems = deck.filter(
    (d) => !isQuizCard(d) && progress.bookmarkedCards.includes(d.id),
  ) as LearningCard[];

  const isUnlocked = (tier: Tier): boolean => {
    if (tier === 'junior') return true;
    if (tier === 'mid') {
      const { completed, total } = getTierProgress('junior', deck);
      return total > 0 && completed >= Math.ceil(total * 0.5);
    }
    const { completed, total } = getTierProgress('mid', deck);
    return total > 0 && completed >= Math.ceil(total * 0.5);
  };

  const streakDays = Math.min(progress.streak, 7);

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Resume */}
        <TouchableOpacity style={styles.resumeBtn} onPress={onResumeLearn} activeOpacity={0.8}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill={C.accentLight}>
            <Polygon points="5,3 19,12 5,21" fill={C.accentLight} />
          </Svg>
          <Text style={styles.resumeText}>Resume Learning</Text>
        </TouchableOpacity>

        {/* Streak */}
        <Text style={styles.sectionLabel}>Streak</Text>
        <View style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <Text style={styles.streakNumber}>{progress.streak}</Text>
            <Text style={styles.streakLabel}>day streak</Text>
          </View>
          <View style={styles.streakDots}>
            {Array.from({ length: 7 }).map((_, i) => (
              <View
                key={i}
                style={[styles.streakDot, i < streakDays && styles.streakDotActive]}
              />
            ))}
          </View>
        </View>

        {/* Tiers */}
        <Text style={styles.sectionLabel}>Tiers</Text>
        {TIER_ORDER.map((tier) => {
          const { completed, total } = getTierProgress(tier, deck);
          const quiz = getQuizScore(tier, deck);
          const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
          const unlocked = isUnlocked(tier);
          const isActive = progress.currentTier === tier;
          const time = progress.timeSpent[tier] ?? 0;
          const color = tierColor(tier);

          return (
            <View
              key={tier}
              style={[
                styles.tierCard,
                { opacity: unlocked ? 1 : 0.45 },
                isActive && { borderColor: color },
              ]}
            >
              <View style={styles.tierCardHeader}>
                <Text style={[styles.tierCardTitle, { color }]}>{TIER_LABEL[tier]}</Text>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                  {isActive && (
                    <View style={[styles.activeBadge, { backgroundColor: `${color}22` }]}>
                      <Text style={[styles.activeBadgeText, { color }]}>Active</Text>
                    </View>
                  )}
                  {!unlocked && (
                    <View style={styles.lockedBadge}>
                      <Text style={styles.lockedBadgeText}>🔒 Locked</Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.tierProgressTrack}>
                <View style={[styles.tierProgressFill, { width: `${pct}%`, backgroundColor: color }]} />
              </View>

              <View style={styles.tierStatsRow}>
                <View style={styles.tierStat}>
                  <Text style={styles.tierStatValue}>
                    {completed}
                    <Text style={styles.tierStatDim}>/{total}</Text>
                  </Text>
                  <Text style={styles.tierStatLabel}>Cards</Text>
                </View>
                {quiz.attempted > 0 && (
                  <View style={styles.tierStat}>
                    <Text style={styles.tierStatValue}>
                      {quiz.total > 0 ? Math.round((quiz.correct / quiz.attempted) * 100) : 0}
                      <Text style={styles.tierStatDim}>%</Text>
                    </Text>
                    <Text style={styles.tierStatLabel}>Quiz accuracy</Text>
                  </View>
                )}
                {time > 0 && (
                  <View style={styles.tierStat}>
                    <Text style={[styles.tierStatValue, { fontSize: 16 }]}>{formatTime(time)}</Text>
                    <Text style={styles.tierStatLabel}>Time</Text>
                  </View>
                )}
              </View>

              {unlocked && !isActive && (
                <TouchableOpacity
                  style={styles.switchBtn}
                  onPress={() => onSetCurrentTier(tier)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.switchBtnText}>Switch to {TIER_LABEL[tier]}</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        {/* Bookmarks */}
        {bookmarkedItems.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>
              Saved — {bookmarkedItems.length} card{bookmarkedItems.length !== 1 ? 's' : ''}
            </Text>
            {bookmarkedItems.map((card) => (
              <TouchableOpacity
                key={card.id}
                style={styles.bookmarkItem}
                onPress={() => setSheetCard(card)}
                activeOpacity={0.75}
              >
                <View style={styles.bookmarkItemContent}>
                  <View style={{ backgroundColor: `${tierColor(card.tier)}22`, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 99 }}>
                    <Text style={{ fontSize: 9, fontWeight: '600', color: tierColor(card.tier), textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {card.tier.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.bookmarkTitle} numberOfLines={1}>{card.topicTitle}</Text>
                </View>
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path d="M9 18l6-6-6-6" stroke={C.inkDim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </TouchableOpacity>
            ))}
          </>
        )}

        <View style={{ height: 8 }} />
      </ScrollView>

      {/* Bookmark card sheet */}
      <Modal
        visible={!!sheetCard}
        transparent
        animationType="slide"
        onRequestClose={() => setSheetCard(null)}
      >
        <View style={styles.sheetBackdrop}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={() => setSheetCard(null)}
            activeOpacity={1}
          />
          <View style={styles.sheetPanel}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle} numberOfLines={1}>{sheetCard?.topicTitle}</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  style={styles.sheetCloseBtn}
                  onPress={() => sheetCard && onToggleBookmark(sheetCard.id)}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 18, color: sheetCard && isBookmarked(sheetCard.id) ? C.accent : C.inkMuted }}>
                    🔖
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sheetCloseBtn}
                  onPress={() => setSheetCard(null)}
                  activeOpacity={0.7}
                >
                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <Path d="M18 6 6 18M6 6l12 12" stroke={C.inkMuted} strokeWidth="1.75" strokeLinecap="round" />
                  </Svg>
                </TouchableOpacity>
              </View>
            </View>
            {sheetCard && (
              <LearningCardContent
                card={sheetCard}
                cardIndex={99}
                totalCards={1}
                onDiscover={onDiscoverAbbrev}
                isBookmarked={isBookmarked(sheetCard.id)}
                onToggleBookmark={onToggleBookmark}
              />
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 12,
    paddingBottom: 16,
  },
  resumeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: C.accentDim,
    borderWidth: 1,
    borderColor: 'rgba(124, 111, 247, 0.3)',
    borderRadius: 16,
    padding: 12,
    minHeight: 44,
  },
  resumeText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.accentLight,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.88,
    textTransform: 'uppercase',
    color: C.inkDim,
    paddingTop: 4,
    paddingBottom: 2,
  },
  streakCard: {
    backgroundColor: C.bgCard,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: C.amber,
  },
  streakLabel: {
    fontSize: 13,
    color: C.inkMuted,
  },
  streakDots: {
    flexDirection: 'row',
    gap: 6,
  },
  streakDot: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.border,
  },
  streakDotActive: {
    backgroundColor: C.amber,
  },
  tierCard: {
    backgroundColor: C.bgCard,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  tierCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tierCardTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  activeBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 99,
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  lockedBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 99,
    backgroundColor: C.bgInput,
    borderWidth: 1,
    borderColor: C.border,
  },
  lockedBadgeText: {
    fontSize: 11,
    color: C.inkDim,
  },
  tierProgressTrack: {
    height: 6,
    backgroundColor: C.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  tierProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  tierStatsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  tierStat: {
    gap: 2,
  },
  tierStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: C.ink,
  },
  tierStatDim: {
    color: C.inkDim,
    fontWeight: '400',
    fontSize: 14,
  },
  tierStatLabel: {
    fontSize: 11,
    color: C.inkDim,
  },
  switchBtn: {
    backgroundColor: C.bgInput,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  switchBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.inkMuted,
  },
  bookmarkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 14,
    gap: 12,
    marginBottom: 8,
  },
  bookmarkItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  bookmarkTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: C.ink,
    flex: 1,
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  sheetPanel: {
    backgroundColor: C.bgCard,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    height: '92%',
    overflow: 'hidden',
  },
  sheetHandle: {
    width: 36,
    height: 4,
    backgroundColor: C.borderStrong,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 0,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.ink,
    flex: 1,
    marginRight: 8,
  },
  sheetCloseBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.bgInput,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
