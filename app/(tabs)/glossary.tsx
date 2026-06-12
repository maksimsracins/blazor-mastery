import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgressContext } from '../../src/contexts/ProgressContext';
import GlossaryView from '../../src/components/GlossaryView';
import { C } from '../../src/constants/colors';

export default function GlossaryScreen() {
  const { progress } = useProgressContext();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <GlossaryView entries={progress.glossary} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
});
