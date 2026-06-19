import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProgress, Tier, GlossaryEntry, DeckItem } from '../types';
import { isQuizCard } from '../types';

const STORAGE_KEY = 'blazorpath-progress';

const defaultProgress = (): UserProgress => ({
  completedCards: [],
  skippedCards: [],
  bookmarkedCards: [],
  glossary: [],
  quizResults: {},
  currentIndex: 0,
  currentTier: 'junior',
  streak: 0,
  lastActiveDate: '',
  timeSpent: { junior: 0, mid: 0, senior: 0 },
});

export const useProgress = () => {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            setProgress({ ...defaultProgress(), ...parsed });
          } catch {}
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress, loaded]);

  const markComplete = useCallback((cardId: string) => {
    setProgress((p) => {
      if (p.completedCards.includes(cardId)) return p;
      const tier = p.currentTier;
      return {
        ...p,
        completedCards: [...p.completedCards, cardId],
        skippedCards: p.skippedCards.filter((id) => id !== cardId),
        timeSpent: { ...p.timeSpent, [tier]: p.timeSpent[tier] + 30 },
      };
    });
  }, []);

  const markSkipped = useCallback((cardId: string) => {
    setProgress((p) => {
      if (p.skippedCards.includes(cardId)) return p;
      return { ...p, skippedCards: [...p.skippedCards, cardId] };
    });
  }, []);

  const toggleBookmark = useCallback((cardId: string) => {
    setProgress((p) => {
      const bm = p.bookmarkedCards.includes(cardId);
      return {
        ...p,
        bookmarkedCards: bm
          ? p.bookmarkedCards.filter((id) => id !== cardId)
          : [...p.bookmarkedCards, cardId],
      };
    });
  }, []);

  const discoverAbbrev = useCallback((entry: GlossaryEntry) => {
    setProgress((p) => {
      if (p.glossary.some((g) => g.term === entry.term)) return p;
      return { ...p, glossary: [...p.glossary, entry] };
    });
  }, []);

  const recordQuizResult = useCallback((quizId: string, correct: boolean) => {
    setProgress((p) => ({
      ...p,
      quizResults: { ...p.quizResults, [quizId]: correct },
    }));
  }, []);

  const setCurrentIndex = useCallback((index: number) => {
    setProgress((p) => ({ ...p, currentIndex: index }));
  }, []);

  const setCurrentTier = useCallback((tier: Tier) => {
    setProgress((p) => ({ ...p, currentTier: tier, currentIndex: 0 }));
  }, []);

  const updateStreak = useCallback(() => {
    const today = new Date().toDateString();
    setProgress((p) => {
      if (p.lastActiveDate === today) return p;
      const yesterday = new Date(Date.now() - 86_400_000).toDateString();
      const newStreak = p.lastActiveDate === yesterday ? p.streak + 1 : 1;
      return { ...p, streak: newStreak, lastActiveDate: today };
    });
  }, []);

  const resetProgress = useCallback(() => {
    const fresh = defaultProgress();
    setProgress(fresh);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  }, []);

  const isCompleted = useCallback(
    (cardId: string) => progress.completedCards.includes(cardId),
    [progress.completedCards],
  );

  const isBookmarked = useCallback(
    (cardId: string) => progress.bookmarkedCards.includes(cardId),
    [progress.bookmarkedCards],
  );

  const getTierProgress = useCallback(
    (tier: Tier, deck: DeckItem[]) => {
      const tierCards = deck.filter((d) => !isQuizCard(d) && d.tier === tier);
      const completed = tierCards.filter((c) => progress.completedCards.includes(c.id)).length;
      return { completed, total: tierCards.length };
    },
    [progress.completedCards],
  );

  const getQuizScore = useCallback(
    (tier: Tier, deck: DeckItem[]) => {
      const quizzes = deck.filter((d) => isQuizCard(d) && d.tier === tier);
      const attempted = quizzes.filter((q) => q.id in progress.quizResults);
      const correct = attempted.filter((q) => progress.quizResults[q.id]).length;
      return { correct, total: quizzes.length, attempted: attempted.length };
    },
    [progress.quizResults],
  );

  return {
    progress,
    loaded,
    markComplete,
    markSkipped,
    toggleBookmark,
    discoverAbbrev,
    recordQuizResult,
    setCurrentIndex,
    setCurrentTier,
    updateStreak,
    resetProgress,
    isCompleted,
    isBookmarked,
    getTierProgress,
    getQuizScore,
  };
};
