import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Polyline } from 'react-native-svg';
import { ALL_QUIZZES } from '../../src/data/quizzes';
import QuizCard from '../../src/components/QuizCard';
import { useProgressContext } from '../../src/contexts/ProgressContext';
import { C, tierColor, tierBg } from '../../src/constants/colors';
import type { Tier } from '../../src/types';

type TierFilter = 'all' | Tier;
type Phase = 'lobby' | 'active' | 'results';

const TIER_FILTERS: { key: TierFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'junior', label: 'Junior' },
  { key: 'mid', label: 'Mid' },
  { key: 'senior', label: 'Senior' },
];

const TIERS: Tier[] = ['junior', 'mid', 'senior'];

export default function QuizScreen() {
  const { progress, recordQuizResult } = useProgressContext();

  const [phase, setPhase] = useState<Phase>('lobby');
  const [tierFilter, setTierFilter] = useState<TierFilter>('all');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [sessionQuizzes, setSessionQuizzes] = useState(ALL_QUIZZES);
  const [answered, setAnswered] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);

  const totalAttempted = Object.keys(progress.quizResults).length;
  const totalCorrect = Object.values(progress.quizResults).filter(Boolean).length;
  const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : null;

  const filteredQuizzes =
    tierFilter === 'all' ? ALL_QUIZZES : ALL_QUIZZES.filter((q) => q.tier === tierFilter);

  const handleStartQuiz = () => {
    setSessionQuizzes(filteredQuizzes);
    setCurrentIdx(0);
    setAnswered(false);
    setSessionCorrect(0);
    setPhase('active');
  };

  const handleAnswer = useCallback(
    (quizId: string, correct: boolean) => {
      recordQuizResult(quizId, correct);
      if (correct) setSessionCorrect((n) => n + 1);
      setAnswered(true);
    },
    [recordQuizResult],
  );

  const handleNext = () => {
    const isLast = currentIdx === sessionQuizzes.length - 1;
    if (isLast) {
      setPhase('results');
    } else {
      setCurrentIdx((n) => n + 1);
      setAnswered(false);
    }
  };

  const handleRetry = () => {
    setCurrentIdx(0);
    setAnswered(false);
    setSessionCorrect(0);
    setPhase('active');
  };

  const handleDone = () => {
    setPhase('lobby');
  };

  // ── Active session ──────────────────────────────────────────────────────────
  if (phase === 'active') {
    const currentQuiz = sessionQuizzes[currentIdx];
    const isLast = currentIdx === sessionQuizzes.length - 1;
    const fillPct = sessionQuizzes.length > 0 ? (currentIdx / sessionQuizzes.length) * 100 : 0;

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.sessionHeader}>
          <TouchableOpacity onPress={handleDone} style={styles.closeBtn} activeOpacity={0.7}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.sessionMeta}>
            <Text style={styles.sessionCounter}>
              {currentIdx + 1} / {sessionQuizzes.length}
            </Text>
            <View style={styles.sessionBarTrack}>
              <View style={[styles.sessionBarFill, { width: `${fillPct}%` as any }]} />
            </View>
          </View>
        </View>

        <View style={styles.quizArea}>
          <View style={styles.quizCard}>
            <QuizCard
              key={currentQuiz.id}
              quiz={currentQuiz}
              onAnswer={handleAnswer}
              hideSwipeHint
            />
          </View>
        </View>

        {answered && (
          <View style={styles.nextArea}>
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
              <Text style={styles.nextBtnText}>{isLast ? 'See Results' : 'Next →'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  }

  // ── Results ─────────────────────────────────────────────────────────────────
  if (phase === 'results') {
    const pct =
      sessionQuizzes.length > 0
        ? Math.round((sessionCorrect / sessionQuizzes.length) * 100)
        : 0;

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.resultsContainer}>
          <View style={styles.resultsIcon}>
            <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
              <Path
                d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                stroke={C.green}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <Polyline
                points="22,4 12,14.01 9,11.01"
                stroke={C.green}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <Text style={styles.resultsTitle}>Quiz Complete</Text>
          <Text style={styles.resultsScore}>
            {sessionCorrect}/{sessionQuizzes.length}
          </Text>
          <Text style={styles.resultsPct}>{pct}% correct</Text>

          <View style={styles.resultsActions}>
            <TouchableOpacity style={styles.btnPrimary} onPress={handleRetry} activeOpacity={0.85}>
              <Text style={styles.btnPrimaryText}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSecondary} onPress={handleDone} activeOpacity={0.85}>
              <Text style={styles.btnSecondaryText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ── Lobby ───────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.lobbyScroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.lobbyTitle}>Quiz Mode</Text>
        <Text style={styles.lobbySubtitle}>Test your Blazor knowledge</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{totalAttempted}</Text>
            <Text style={styles.statLabel}>Attempted</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{totalCorrect}</Text>
            <Text style={styles.statLabel}>Correct</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{accuracy !== null ? `${accuracy}%` : '—'}</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
        </View>

        <Text style={styles.filterLabel}>Filter by tier</Text>
        <View style={styles.filterRow}>
          {TIER_FILTERS.map(({ key, label }) => {
            const active = tierFilter === key;
            const color = key === 'all' ? C.accent : tierColor(key);
            const bg = key === 'all' ? C.accentDim : tierBg(key);
            return (
              <TouchableOpacity
                key={key}
                style={[styles.filterChip, active && { backgroundColor: bg, borderColor: color }]}
                onPress={() => setTierFilter(key)}
                activeOpacity={0.75}
              >
                <Text style={[styles.filterChipText, active && { color }]}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.quizCount}>
          {filteredQuizzes.length} quiz{filteredQuizzes.length !== 1 ? 'zes' : ''} available
        </Text>

        <TouchableOpacity
          style={[styles.startBtn, filteredQuizzes.length === 0 && styles.startBtnDisabled]}
          onPress={handleStartQuiz}
          disabled={filteredQuizzes.length === 0}
          activeOpacity={0.85}
        >
          <Text style={styles.startBtnText}>Start Quiz</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>By Tier</Text>
        {TIERS.map((tier) => {
          const tierQuizzes = ALL_QUIZZES.filter((q) => q.tier === tier);
          const attempted = tierQuizzes.filter(
            (q) => progress.quizResults[q.id] !== undefined,
          ).length;
          const correct = tierQuizzes.filter((q) => progress.quizResults[q.id] === true).length;
          const color = tierColor(tier);
          const bg = tierBg(tier);
          return (
            <View key={tier} style={styles.tierRow}>
              <View style={[styles.tierDot, { backgroundColor: bg }]}>
                <View style={[styles.tierDotInner, { backgroundColor: color }]} />
              </View>
              <View style={styles.tierInfo}>
                <View style={styles.tierInfoTop}>
                  <Text style={[styles.tierLabel, { color }]}>
                    {tier.charAt(0).toUpperCase() + tier.slice(1)}
                  </Text>
                  <Text style={styles.tierStat}>
                    {correct}/{tierQuizzes.length} correct
                  </Text>
                </View>
                <View style={styles.tierBarTrack}>
                  <View
                    style={[
                      styles.tierBarFill,
                      {
                        width: `${tierQuizzes.length > 0 ? (attempted / tierQuizzes.length) * 100 : 0}%` as any,
                        backgroundColor: color,
                      },
                    ]}
                  />
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

  // ── Session ────────────────────────────────────────────────────────────────
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 12,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 16,
    color: C.inkMuted,
    fontWeight: '600',
  },
  sessionMeta: { flex: 1, gap: 6 },
  sessionCounter: {
    fontSize: 12,
    fontWeight: '600',
    color: C.inkMuted,
    textAlign: 'right',
  },
  sessionBarTrack: {
    height: 3,
    backgroundColor: C.bgCode,
    borderRadius: 2,
    overflow: 'hidden',
  },
  sessionBarFill: {
    height: '100%',
    backgroundColor: C.accent,
    borderRadius: 2,
  },
  quizArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  quizCard: {
    flex: 1,
    backgroundColor: C.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  nextArea: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
  },
  nextBtn: {
    backgroundColor: C.accent,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  nextBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.2,
  },

  // ── Results ────────────────────────────────────────────────────────────────
  resultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  resultsIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: C.greenBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.5,
  },
  resultsScore: {
    fontSize: 48,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -1,
    marginTop: 4,
  },
  resultsPct: {
    fontSize: 15,
    color: C.inkMuted,
    marginBottom: 16,
  },
  resultsActions: {
    width: '100%',
    gap: 10,
    marginTop: 8,
  },
  btnPrimary: {
    backgroundColor: C.accent,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  btnPrimaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  btnSecondary: {
    backgroundColor: C.bgInput,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  btnSecondaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: C.inkMuted,
  },

  // ── Lobby ──────────────────────────────────────────────────────────────────
  lobbyScroll: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  lobbyTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.6,
    marginBottom: 4,
  },
  lobbySubtitle: {
    fontSize: 14,
    color: C.inkMuted,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: C.bgCard,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.border,
  },
  statNum: {
    fontSize: 22,
    fontWeight: '700',
    color: C.ink,
  },
  statLabel: {
    fontSize: 10,
    color: C.inkMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: C.inkMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.bgCard,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.inkMuted,
  },
  quizCount: {
    fontSize: 13,
    color: C.inkMuted,
    marginBottom: 16,
  },
  startBtn: {
    backgroundColor: C.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  startBtnDisabled: {
    backgroundColor: C.bgCode,
    shadowOpacity: 0,
  },
  startBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: C.inkMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  tierDot: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  tierInfo: { flex: 1 },
  tierInfoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  tierLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  tierStat: {
    fontSize: 13,
    color: C.inkMuted,
  },
  tierBarTrack: {
    height: 5,
    backgroundColor: C.bgCode,
    borderRadius: 4,
    overflow: 'hidden',
  },
  tierBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});
