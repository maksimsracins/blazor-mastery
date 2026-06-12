import { createContext, useContext, useMemo, ReactNode } from 'react';
import { View } from 'react-native';
import { useProgress } from '../hooks/useProgress';
import { ALL_CARDS } from '../data/cards';
import { ALL_QUIZZES } from '../data/quizzes';
import { isQuizCard } from '../types';
import type { Tier, DeckItem } from '../types';
import { C } from '../constants/colors';

function buildDeck(tier: Tier): DeckItem[] {
  const tierCards = ALL_CARDS.filter((c) => c.tier === tier);
  const tierQuizzes = ALL_QUIZZES.filter((q) => q.tier === tier);
  if (tierQuizzes.length === 0) return tierCards as DeckItem[];

  const interval = Math.floor(tierCards.length / tierQuizzes.length);
  const deck: DeckItem[] = [];
  let qi = 0;

  tierCards.forEach((card, i) => {
    deck.push(card as DeckItem);
    if ((i + 1) % interval === 0 && qi < tierQuizzes.length) {
      deck.push(tierQuizzes[qi++] as DeckItem);
    }
  });
  return deck;
}

type ProgressHook = ReturnType<typeof useProgress>;

interface ProgressContextValue extends ProgressHook {
  deck: DeckItem[];
}

const ProgressContext = createContext<ProgressContextValue>(null!);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const progress = useProgress();
  const deck = useMemo(
    () => buildDeck(progress.progress.currentTier),
    [progress.progress.currentTier],
  );

  if (!progress.loaded) {
    return <View style={{ flex: 1, backgroundColor: C.bg }} />;
  }

  return (
    <ProgressContext.Provider value={{ ...progress, deck }}>
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgressContext = () => useContext(ProgressContext);
