export type Tier = 'junior' | 'mid' | 'senior';
export type TabId = 'learn' | 'glossary' | 'progress';

export interface Abbreviation {
  term: string;
  fullForm: string;
  definition: string;
}

export interface CodeSnippet {
  language: string;
  code: string;
  filename?: string;
}

export interface YouTubeRef {
  videoId: string;
  title: string;
  channel: string;
  duration: string;
}

export interface Source {
  name: string;
  type: 'docs' | 'book' | 'youtube' | 'blog';
  url?: string;
}

export interface LearningCard {
  id: string;
  tier: Tier;
  topicTitle: string;
  source: Source;
  body: string[];
  codeBlock?: CodeSnippet;
  abbreviations?: Abbreviation[];
  youtubeRef?: YouTubeRef;
  keyTakeaway: string;
}

export type QuizType = 'multiple-choice' | 'code-fill' | 'true-false' | 'match';

export interface QuizCard {
  id: string;
  type: 'quiz';
  quizType: QuizType;
  tier: Tier;
  question: string;
  options?: string[];
  correctIndex?: number;
  codeSnippet?: string;
  fillOptions?: string[];
  correctFill?: string;
  answer?: boolean;
  pairs?: { term: string; definition: string }[];
  explanation: string;
}

export type DeckItem = LearningCard | QuizCard;

export function isQuizCard(item: DeckItem): item is QuizCard {
  return (item as QuizCard).type === 'quiz';
}

export interface GlossaryEntry {
  term: string;
  fullForm: string;
  definition: string;
  firstCardId: string;
  firstCardTitle: string;
}

export interface UserProgress {
  completedCards: string[];
  skippedCards: string[];
  bookmarkedCards: string[];
  glossary: GlossaryEntry[];
  quizResults: Record<string, boolean>;
  currentIndex: number;
  currentTier: Tier;
  streak: number;
  lastActiveDate: string;
  timeSpent: Record<Tier, number>;
}
