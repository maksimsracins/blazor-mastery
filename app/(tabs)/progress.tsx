import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useProgressContext } from '../../src/contexts/ProgressContext';
import ProgressView from '../../src/components/ProgressView';
import { C } from '../../src/constants/colors';

export default function ProgressScreen() {
  const router = useRouter();
  const {
    progress,
    deck,
    getTierProgress,
    getQuizScore,
    setCurrentTier,
    toggleBookmark,
    discoverAbbrev,
    isBookmarked,
  } = useProgressContext();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ProgressView
        progress={progress}
        deck={deck}
        getTierProgress={getTierProgress}
        getQuizScore={getQuizScore}
        onSetCurrentTier={setCurrentTier}
        onResumeLearn={() => router.navigate('/learn')}
        onToggleBookmark={toggleBookmark}
        onDiscoverAbbrev={discoverAbbrev}
        isBookmarked={isBookmarked}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
});
