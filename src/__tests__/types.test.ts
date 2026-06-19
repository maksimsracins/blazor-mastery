import { isQuizCard } from '../types';
import type { LearningCard, QuizCard } from '../types';

const learningCard: LearningCard = {
  id: 'j-001',
  tier: 'junior',
  topicTitle: 'What is Blazor?',
  source: { name: 'Microsoft Docs', type: 'docs' },
  body: ['Blazor is a framework.'],
  keyTakeaway: 'Blazor uses C#.',
};

const quizCard: QuizCard = {
  id: 'q-001',
  type: 'quiz',
  quizType: 'true-false',
  tier: 'junior',
  question: 'Is Blazor a .NET framework?',
  answer: true,
  explanation: 'Yes, Blazor runs on .NET.',
};

describe('isQuizCard', () => {
  it('returns false for a learning card', () => {
    expect(isQuizCard(learningCard)).toBe(false);
  });

  it('returns true for a quiz card', () => {
    expect(isQuizCard(quizCard)).toBe(true);
  });

  it('narrows type correctly so quiz properties are accessible', () => {
    if (isQuizCard(quizCard)) {
      expect(quizCard.type).toBe('quiz');
      expect(quizCard.explanation).toBeDefined();
    }
  });
});
