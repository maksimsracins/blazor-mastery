import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { useProgressContext } from '../../src/contexts/ProgressContext';
import { ALL_CARDS } from '../../src/data/cards';
import { ALL_QUIZZES } from '../../src/data/quizzes';
import { C, tierColor, tierBg } from '../../src/constants/colors';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

const TIERS: Array<{ key: 'junior' | 'mid' | 'senior'; label: string }> = [
  { key: 'junior', label: 'Junior' },
  { key: 'mid', label: 'Mid' },
  { key: 'senior', label: 'Senior' },
];

function FireIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill={C.amber}>
      <Path d="M12 2c0 0-5 5-5 10a5 5 0 0 0 10 0c0-2.5-1.5-4.5-3-6 0 1.5-1 3-2 3.5C13 8 12 5 12 2Z" />
    </Svg>
  );
}

function StarIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill={C.accent}>
      <Path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2Z" />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17l-5-5" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function BookmarkIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z" stroke={C.accent} strokeWidth="2" strokeLinejoin="round" />
    </Svg>
  );
}

function TrophyIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M8 21h8M12 17v4M17 3h3v5a5 5 0 0 1-3 4.6M7 3H4v5a5 5 0 0 0 3 4.6" stroke={C.tierSenior} strokeWidth="2" strokeLinecap="round" />
      <Path d="M7 3h10v7a5 5 0 0 1-10 0V3Z" stroke={C.tierSenior} strokeWidth="2" strokeLinejoin="round" />
    </Svg>
  );
}


export default function HomeScreen() {
  const router = useRouter();
  const { progress, isCompleted } = useProgressContext();

  const totalCompleted = progress.completedCards.length;
  const totalCards = ALL_CARDS.length;
  const totalBookmarks = progress.bookmarkedCards.length;

  const quizAttempted = Object.keys(progress.quizResults).length;
  const quizCorrect = Object.values(progress.quizResults).filter(Boolean).length;

  const tierCards = {
    junior: ALL_CARDS.filter((c) => c.tier === 'junior'),
    mid: ALL_CARDS.filter((c) => c.tier === 'mid'),
    senior: ALL_CARDS.filter((c) => c.tier === 'senior'),
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting()}</Text>
            <Text style={styles.appName}>BlazorPath</Text>
          </View>
          <View style={styles.streakBadge}>
            <FireIcon />
            <Text style={styles.streakNum}>{progress.streak}</Text>
            <Text style={styles.streakLabel}>day streak</Text>
          </View>
        </View>

        {/* Continue CTA */}
        <View style={styles.ctaCard}>
          <View style={styles.ctaTop}>
            <View style={[styles.tierBadge, { backgroundColor: tierBg(progress.currentTier) }]}>
              <Text style={[styles.tierBadgeText, { color: tierColor(progress.currentTier) }]}>
                {progress.currentTier.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.ctaSubtitle}>Continue where you left off</Text>
          </View>
          <Text style={styles.ctaTitle}>
            {totalCompleted} of {totalCards} cards completed
          </Text>
          <View style={styles.ctaBarTrack}>
            <View style={[styles.ctaBarFill, {
              width: `${totalCards > 0 ? (totalCompleted / totalCards) * 100 : 0}%` as any,
              backgroundColor: tierColor(progress.currentTier),
            }]} />
          </View>
          <TouchableOpacity style={styles.ctaButton} onPress={() => router.navigate('/learn')} activeOpacity={0.85}>
            <Text style={styles.ctaButtonText}>Continue Learning</Text>
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <CheckIcon />
            <Text style={styles.statNum}>{totalCompleted}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <BookmarkIcon />
            <Text style={styles.statNum}>{totalBookmarks}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statCard}>
            <TrophyIcon />
            <Text style={styles.statNum}>{quizAttempted > 0 ? `${Math.round((quizCorrect / quizAttempted) * 100)}%` : '—'}</Text>
            <Text style={styles.statLabel}>Quiz Score</Text>
          </View>
        </View>

        {/* Tier progress */}
        <Text style={styles.sectionTitle}>Your Progress</Text>
        {TIERS.map(({ key, label }) => {
          const cards = tierCards[key];
          const done = cards.filter((c) => isCompleted(c.id)).length;
          const pct = cards.length > 0 ? done / cards.length : 0;
          const color = tierColor(key);
          const bg = tierBg(key);
          return (
            <View key={key} style={styles.tierRow}>
              <View style={[styles.tierDot, { backgroundColor: bg }]}>
                <View style={[styles.tierDotInner, { backgroundColor: color }]} />
              </View>
              <View style={styles.tierInfo}>
                <View style={styles.tierInfoTop}>
                  <Text style={[styles.tierLabel, { color }]}>{label}</Text>
                  <Text style={styles.tierCount}>{done}/{cards.length}</Text>
                </View>
                <View style={styles.tierBarTrack}>
                  <View style={[styles.tierBarFill, { width: `${pct * 100}%` as any, backgroundColor: color }]} />
                </View>
              </View>
            </View>
          );
        })}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingBottom: 32 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 20,
    paddingBottom: 24,
  },
  greeting: { fontSize: 13, color: C.inkMuted, marginBottom: 2 },
  appName: { fontSize: 26, fontWeight: '700', color: C.ink, letterSpacing: -0.5 },

  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.amberBg,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  streakNum: { fontSize: 16, fontWeight: '700', color: C.amber, marginLeft: 2 },
  streakLabel: { fontSize: 11, color: C.amber, opacity: 0.8 },

  ctaCard: {
    backgroundColor: C.bgCard,
    borderRadius: 16,
    padding: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.border,
    marginBottom: 16,
  },
  ctaTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  tierBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tierBadgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  ctaSubtitle: { fontSize: 13, color: C.inkMuted },
  ctaTitle: { fontSize: 17, fontWeight: '600', color: C.ink, marginBottom: 12 },
  ctaBarTrack: { height: 5, backgroundColor: C.bgCode, borderRadius: 4, marginBottom: 18, overflow: 'hidden' },
  ctaBarFill: { height: '100%', borderRadius: 4 },
  ctaButton: {
    backgroundColor: C.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaButtonText: { fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: 0.2 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  statCard: {
    flex: 1,
    backgroundColor: C.bgCard,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.border,
  },
  statNum: { fontSize: 20, fontWeight: '700', color: C.ink },
  statLabel: { fontSize: 10, color: C.inkMuted, textTransform: 'uppercase', letterSpacing: 0.4 },

  sectionTitle: { fontSize: 13, fontWeight: '700', color: C.inkMuted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 14 },

  tierRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  tierDot: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tierDotInner: { width: 10, height: 10, borderRadius: 5 },
  tierInfo: { flex: 1 },
  tierInfoTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 },
  tierLabel: { fontSize: 14, fontWeight: '600' },
  tierCount: { fontSize: 13, color: C.inkMuted },
  tierBarTrack: { height: 5, backgroundColor: C.bgCode, borderRadius: 4, overflow: 'hidden' },
  tierBarFill: { height: '100%', borderRadius: 4 },
});
