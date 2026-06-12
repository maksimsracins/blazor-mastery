import { View, Text, StyleSheet } from 'react-native';
import { C } from '../constants/colors';
import type { Tier } from '../types';

const TIER_LABEL: Record<Tier, string> = {
  junior: 'Blazor Junior',
  mid: 'Blazor Mid-Level',
  senior: 'Blazor Senior',
};

interface ProgressBarStripProps {
  completed: number;
  total: number;
  tier: Tier;
}

export default function ProgressBarStrip({ completed, total, tier }: ProgressBarStripProps) {
  const pct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.label}>
        {completed} of {total} — {TIER_LABEL[tier]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: C.bg,
  },
  track: {
    height: 3,
    backgroundColor: C.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: C.accent,
  },
  label: {
    fontSize: 11,
    color: C.inkDim,
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 4,
    letterSpacing: 0.11,
  },
});
