import { ALL_CARDS } from '../../data/cards';
import { ALL_QUIZZES } from '../../data/quizzes';
import { isQuizCard } from '../../types';

describe('ALL_CARDS', () => {
  it('contains cards', () => {
    expect(ALL_CARDS.length).toBeGreaterThan(0);
  });

  it('all IDs are unique', () => {
    const ids = ALL_CARDS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all cards have required fields', () => {
    ALL_CARDS.forEach((card) => {
      expect(card.id).toBeTruthy();
      expect(['junior', 'mid', 'senior']).toContain(card.tier);
      expect(card.topicTitle).toBeTruthy();
      expect(card.body.length).toBeGreaterThan(0);
      expect(card.keyTakeaway).toBeTruthy();
      expect(card.source).toBeDefined();
    });
  });

  it('none are accidentally marked as quiz cards', () => {
    ALL_CARDS.forEach((card) => expect(isQuizCard(card)).toBe(false));
  });

  it('covers all three tiers', () => {
    const tiers = new Set(ALL_CARDS.map((c) => c.tier));
    expect(tiers.has('junior')).toBe(true);
    expect(tiers.has('mid')).toBe(true);
    expect(tiers.has('senior')).toBe(true);
  });
});

describe('ALL_QUIZZES', () => {
  it('contains quizzes', () => {
    expect(ALL_QUIZZES.length).toBeGreaterThan(0);
  });

  it('all IDs are unique', () => {
    const ids = ALL_QUIZZES.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('quiz IDs do not overlap with card IDs', () => {
    const cardIds = new Set(ALL_CARDS.map((c) => c.id));
    ALL_QUIZZES.forEach((q) => expect(cardIds.has(q.id)).toBe(false));
  });

  it('all quizzes have required fields', () => {
    ALL_QUIZZES.forEach((quiz) => {
      expect(quiz.id).toBeTruthy();
      expect(quiz.type).toBe('quiz');
      expect(['junior', 'mid', 'senior']).toContain(quiz.tier);
      expect(quiz.question).toBeTruthy();
      expect(quiz.explanation).toBeTruthy();
    });
  });

  it('all are identified as quiz cards by isQuizCard', () => {
    ALL_QUIZZES.forEach((quiz) => expect(isQuizCard(quiz)).toBe(true));
  });

  it('multiple-choice quizzes have options and a correctIndex', () => {
    ALL_QUIZZES.filter((q) => q.quizType === 'multiple-choice').forEach((quiz) => {
      expect(quiz.options).toBeDefined();
      expect(quiz.options!.length).toBeGreaterThan(1);
      expect(quiz.correctIndex).toBeGreaterThanOrEqual(0);
      expect(quiz.correctIndex!).toBeLessThan(quiz.options!.length);
    });
  });

  it('true-false quizzes have a boolean answer', () => {
    ALL_QUIZZES.filter((q) => q.quizType === 'true-false').forEach((quiz) => {
      expect(typeof quiz.answer).toBe('boolean');
    });
  });
});

describe('combined deck integrity', () => {
  it('every item has a unique ID across cards and quizzes combined', () => {
    const allIds = [...ALL_CARDS.map((c) => c.id), ...ALL_QUIZZES.map((q) => q.id)];
    expect(new Set(allIds).size).toBe(allIds.length);
  });
});
