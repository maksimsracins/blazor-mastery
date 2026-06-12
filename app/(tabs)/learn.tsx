import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgressContext } from '../../src/contexts/ProgressContext';
import { isQuizCard } from '../../src/types';
import TopBar from '../../src/components/TopBar';
import ProgressBarStrip from '../../src/components/ProgressBarStrip';
import CardDeck from '../../src/components/CardDeck';
import { C } from '../../src/constants/colors';

export default function LearnScreen() {
  const {
    progress,
    deck,
    markComplete,
    markSkipped,
    toggleBookmark,
    discoverAbbrev,
    recordQuizResult,
    setCurrentIndex,
    setCurrentTier,
    isCompleted,
    isBookmarked,
    updateStreak,
  } = useProgressContext();

  useEffect(() => {
    updateStreak();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalLearningCards = deck.filter((d) => !isQuizCard(d)).length;
  const completedInTier = deck.filter(
    (d) => !isQuizCard(d) && isCompleted(d.id),
  ).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TopBar
        currentTier={progress.currentTier}
        bookmarkCount={progress.bookmarkedCards.length}
      />
      <ProgressBarStrip
        completed={completedInTier}
        total={totalLearningCards}
        tier={progress.currentTier}
      />
      <View style={styles.content}>
        <CardDeck
          deck={deck}
          progress={progress}
          onMarkComplete={markComplete}
          onMarkSkipped={markSkipped}
          onToggleBookmark={toggleBookmark}
          onDiscoverAbbrev={discoverAbbrev}
          onRecordQuizResult={recordQuizResult}
          onSetCurrentIndex={setCurrentIndex}
          onSetCurrentTier={setCurrentTier}
          isCompleted={isCompleted}
          isBookmarked={isBookmarked}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  content: {
    flex: 1,
  },
});
