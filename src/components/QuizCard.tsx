import { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import type { QuizCard as QuizCardType } from '../types';
import { C, tierColor, tierBg } from '../constants/colors';

interface QuizCardProps {
  quiz: QuizCardType;
  onAnswer: (quizId: string, correct: boolean) => void;
  hideSwipeHint?: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizCard({ quiz, onAnswer, hideSwipeHint }: QuizCardProps) {
  const [answered, setAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedFill, setSelectedFill] = useState<string | null>(null);
  const [boolAnswer, setBoolAnswer] = useState<boolean | null>(null);
  const [matchSelected, setMatchSelected] = useState<string | null>(null);
  const [matchPairs, setMatchPairs] = useState<Record<string, string>>({});
  const [matchResult, setMatchResult] = useState<Record<string, boolean>>({});

  const shuffledDefs = useMemo(
    () => shuffle((quiz.pairs ?? []).map((p) => p.definition)),
    [quiz.pairs],
  );

  const handleMultiChoice = (idx: number) => {
    if (answered) return;
    setSelectedIndex(idx);
    setAnswered(true);
    onAnswer(quiz.id, idx === quiz.correctIndex);
  };

  const handleFill = (opt: string) => {
    if (answered) return;
    setSelectedFill(opt);
    setAnswered(true);
    onAnswer(quiz.id, opt === quiz.correctFill);
  };

  const handleBool = (val: boolean) => {
    if (answered) return;
    setBoolAnswer(val);
    setAnswered(true);
    onAnswer(quiz.id, val === quiz.answer);
  };

  const handleMatchTerm = (term: string) => {
    if (matchResult[term] !== undefined) return;
    setMatchSelected((prev) => (prev === term ? null : term));
  };

  const handleMatchDef = (def: string) => {
    if (!matchSelected) return;
    if (Object.values(matchPairs).includes(def)) return;
    const pair = (quiz.pairs ?? []).find((p) => p.term === matchSelected);
    const isCorrect = pair?.definition === def;
    const newPairs = { ...matchPairs, [matchSelected]: def };
    const newResult = { ...matchResult, [matchSelected]: isCorrect };
    setMatchPairs(newPairs);
    setMatchResult(newResult);
    setMatchSelected(null);
    if (Object.keys(newPairs).length === (quiz.pairs ?? []).length) {
      const allCorrect = Object.values(newResult).every(Boolean);
      setAnswered(true);
      onAnswer(quiz.id, allCorrect);
    }
  };

  const resultLabel = () => {
    if (quiz.quizType === 'match') {
      return Object.values(matchResult).every(Boolean) ? '✓ All matched correctly' : '✗ Some pairs wrong';
    }
    if (quiz.quizType === 'true-false') {
      return boolAnswer === quiz.answer ? '✓ Correct' : '✗ Incorrect';
    }
    if (quiz.quizType === 'code-fill') {
      return selectedFill === quiz.correctFill ? '✓ Correct' : '✗ Incorrect';
    }
    return selectedIndex === quiz.correctIndex ? '✓ Correct' : '✗ Incorrect';
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.inner}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.labelRow}>
        <View style={styles.quizChip}>
          <Text style={styles.quizChipText}>Quick Check</Text>
        </View>
        <View style={[styles.tierBadge, { backgroundColor: tierBg(quiz.tier), marginLeft: 'auto' }]}>
          <Text style={[styles.tierText, { color: tierColor(quiz.tier) }]}>
            {quiz.tier.charAt(0).toUpperCase() + quiz.tier.slice(1)}
          </Text>
        </View>
      </View>

      <Text style={styles.question}>{quiz.question}</Text>

      {/* Multiple Choice */}
      {quiz.quizType === 'multiple-choice' && (
        <View style={styles.options}>
          {(quiz.options ?? []).map((opt, i) => {
            let bg = C.bgCode;
            let border = C.border;
            let color = C.ink2;
            if (answered) {
              if (i === quiz.correctIndex) { bg = C.greenBg; border = C.green; color = C.green; }
              else if (i === selectedIndex) { bg = C.redBg; border = C.red; color = C.red; }
            }
            return (
              <TouchableOpacity
                key={i}
                style={[styles.option, { backgroundColor: bg, borderColor: border }]}
                onPress={() => handleMultiChoice(i)}
                disabled={answered}
                activeOpacity={0.75}
              >
                <Text style={[styles.optionText, { color }]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Code Fill */}
      {quiz.quizType === 'code-fill' && (
        <>
          {quiz.codeSnippet && (
            <View style={styles.codeSnippet}>
              <Text style={styles.codeText}>
                {quiz.codeSnippet.split('___').map((part, i, arr) =>
                  i < arr.length - 1 ? (
                    part + (answered ? quiz.correctFill : '___')
                  ) : part
                ).join('')}
              </Text>
            </View>
          )}
          <View style={styles.options}>
            {(quiz.fillOptions ?? []).map((opt) => {
              let bg = C.bgCode;
              let border = C.border;
              let color = C.ink2;
              if (answered) {
                if (opt === quiz.correctFill) { bg = C.greenBg; border = C.green; color = C.green; }
                else if (opt === selectedFill) { bg = C.redBg; border = C.red; color = C.red; }
              }
              return (
                <TouchableOpacity
                  key={opt}
                  style={[styles.option, { backgroundColor: bg, borderColor: border }]}
                  onPress={() => handleFill(opt)}
                  disabled={answered}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.optionText, { color }]}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}

      {/* True / False */}
      {quiz.quizType === 'true-false' && (
        <View style={styles.options}>
          {([true, false] as const).map((val) => {
            let bg = C.bgCode;
            let border = C.border;
            let color = C.ink2;
            if (answered) {
              if (val === quiz.answer) { bg = C.greenBg; border = C.green; color = C.green; }
              else if (val === boolAnswer) { bg = C.redBg; border = C.red; color = C.red; }
            }
            return (
              <TouchableOpacity
                key={String(val)}
                style={[styles.option, { backgroundColor: bg, borderColor: border }]}
                onPress={() => handleBool(val)}
                disabled={answered}
                activeOpacity={0.75}
              >
                <Text style={[styles.optionText, { color, fontWeight: '700', fontSize: 16 }]}>
                  {val ? 'True' : 'False'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Match */}
      {quiz.quizType === 'match' && (
        <>
          <Text style={styles.matchHint}>Tap a term, then tap its definition.</Text>
          <View style={styles.matchGrid}>
            <View style={styles.matchCol}>
              {(quiz.pairs ?? []).map((p) => {
                let bg = C.bgCode;
                let border = C.border;
                let color = C.ink2;
                if (matchSelected === p.term) { bg = C.accentDim; border = C.accent; color = C.accentLight; }
                else if (matchResult[p.term] === true) { bg = C.greenBg; border = C.green; color = C.green; }
                else if (matchResult[p.term] === false) { bg = C.redBg; border = C.red; color = C.red; }
                return (
                  <TouchableOpacity
                    key={p.term}
                    style={[styles.matchItem, { backgroundColor: bg, borderColor: border }]}
                    onPress={() => handleMatchTerm(p.term)}
                    disabled={matchResult[p.term] !== undefined}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.matchText, { color }]}>{p.term}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.matchCol}>
              {shuffledDefs.map((def) => {
                const matchedTerm = Object.entries(matchPairs).find(([, d]) => d === def)?.[0];
                let bg = C.bgCode;
                let border = C.border;
                let color = C.ink2;
                if (matchedTerm !== undefined) {
                  if (matchResult[matchedTerm]) { bg = C.greenBg; border = C.green; color = C.green; }
                  else { bg = C.redBg; border = C.red; color = C.red; }
                }
                return (
                  <TouchableOpacity
                    key={def}
                    style={[styles.matchItem, { backgroundColor: bg, borderColor: border }]}
                    onPress={() => handleMatchDef(def)}
                    disabled={matchedTerm !== undefined}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.matchText, { color }]}>{def}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </>
      )}

      {/* Explanation */}
      {answered && (
        <View style={styles.explanation}>
          <Text style={styles.explanationResult}>{resultLabel()}</Text>
          <Text style={styles.explanationText}>{quiz.explanation}</Text>
        </View>
      )}

      {answered && !hideSwipeHint && (
        <Text style={styles.swipeHint}>Swipe right to continue →</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  inner: {
    padding: 20,
    gap: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quizChip: {
    backgroundColor: C.amberBg,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 99,
  },
  quizChipText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: C.amber,
  },
  tierBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 99,
  },
  tierText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  question: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 23.4,
    color: C.ink,
  },
  options: {
    gap: 8,
  },
  option: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  codeSnippet: {
    backgroundColor: C.bgCode,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 12,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 20.8,
    color: '#abb2bf',
  },
  matchHint: {
    fontSize: 12,
    color: C.inkDim,
    marginBottom: -8,
  },
  matchGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  matchCol: {
    flex: 1,
    gap: 8,
  },
  matchItem: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16.8,
  },
  explanation: {
    backgroundColor: C.bgCode,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 12,
  },
  explanationResult: {
    fontSize: 13,
    fontWeight: '700',
    color: C.ink,
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 13,
    color: C.inkMuted,
    lineHeight: 20.8,
  },
  swipeHint: {
    fontSize: 11,
    color: C.inkDim,
    textAlign: 'center',
    paddingBottom: 4,
  },
});
