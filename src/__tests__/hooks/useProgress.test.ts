import { renderHook, waitFor, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProgress } from '../../hooks/useProgress';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn(),
}));

const mockGetItem = AsyncStorage.getItem as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
});

describe('useProgress – loading', () => {
  it('starts with loaded=false', async () => {
    mockGetItem.mockReturnValue(new Promise(() => {}));
    const { result } = await renderHook(() => useProgress());
    expect(result.current.loaded).toBe(false);
  });

  it('becomes loaded when storage returns null', async () => {
    mockGetItem.mockResolvedValue(null);
    const { result } = await renderHook(() => useProgress());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.progress.currentTier).toBe('junior');
  });

  it('restores saved progress', async () => {
    mockGetItem.mockResolvedValue(
      JSON.stringify({ streak: 7, currentTier: 'mid', completedCards: ['j-001'] }),
    );
    const { result } = await renderHook(() => useProgress());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.progress.streak).toBe(7);
    expect(result.current.progress.currentTier).toBe('mid');
    expect(result.current.progress.completedCards).toContain('j-001');
  });

  it('falls back to defaults when stored JSON is corrupt', async () => {
    mockGetItem.mockResolvedValue('NOT { JSON }}}');
    const { result } = await renderHook(() => useProgress());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.progress.currentTier).toBe('junior');
  });

  // This is the bug that caused the black screen on iPadOS 26 —
  // AsyncStorage rejected but loaded never became true.
  it('becomes loaded even when AsyncStorage rejects', async () => {
    mockGetItem.mockRejectedValue(new Error('Storage unavailable'));
    const { result } = await renderHook(() => useProgress());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.progress.currentTier).toBe('junior');
  });
});

describe('useProgress – markComplete', () => {
  beforeEach(() => mockGetItem.mockResolvedValue(null));

  it('adds a card to completedCards', async () => {
    const { result } = await renderHook(() => useProgress());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    await act(async () => { result.current.markComplete('j-001'); });
    expect(result.current.progress.completedCards).toContain('j-001');
  });

  it('is idempotent', async () => {
    const { result } = await renderHook(() => useProgress());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    await act(async () => { result.current.markComplete('j-001'); });
    await act(async () => { result.current.markComplete('j-001'); });
    const matches = result.current.progress.completedCards.filter((id) => id === 'j-001');
    expect(matches).toHaveLength(1);
  });

  it('removes the card from skippedCards', async () => {
    mockGetItem.mockResolvedValue(JSON.stringify({ skippedCards: ['j-001'] }));
    const { result } = await renderHook(() => useProgress());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    await act(async () => { result.current.markComplete('j-001'); });
    expect(result.current.progress.skippedCards).not.toContain('j-001');
  });
});

describe('useProgress – toggleBookmark', () => {
  beforeEach(() => mockGetItem.mockResolvedValue(null));

  it('adds a bookmark on first call', async () => {
    const { result } = await renderHook(() => useProgress());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    await act(async () => { result.current.toggleBookmark('j-002'); });
    expect(result.current.progress.bookmarkedCards).toContain('j-002');
  });

  it('removes a bookmark on second call', async () => {
    const { result } = await renderHook(() => useProgress());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    await act(async () => { result.current.toggleBookmark('j-002'); });
    await act(async () => { result.current.toggleBookmark('j-002'); });
    expect(result.current.progress.bookmarkedCards).not.toContain('j-002');
  });
});

describe('useProgress – streak', () => {
  beforeEach(() => mockGetItem.mockResolvedValue(null));

  it('sets streak to 1 on first active day', async () => {
    const { result } = await renderHook(() => useProgress());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    await act(async () => { result.current.updateStreak(); });
    expect(result.current.progress.streak).toBe(1);
  });

  it('does not increment streak when called twice on the same day', async () => {
    const { result } = await renderHook(() => useProgress());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    await act(async () => { result.current.updateStreak(); });
    await act(async () => { result.current.updateStreak(); });
    expect(result.current.progress.streak).toBe(1);
  });
});

describe('useProgress – setCurrentTier', () => {
  beforeEach(() => mockGetItem.mockResolvedValue(null));

  it('changes tier and resets index to 0', async () => {
    const { result } = await renderHook(() => useProgress());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    await act(async () => { result.current.setCurrentIndex(5); });
    await act(async () => { result.current.setCurrentTier('senior'); });
    expect(result.current.progress.currentTier).toBe('senior');
    expect(result.current.progress.currentIndex).toBe(0);
  });
});

describe('useProgress – resetProgress', () => {
  it('clears all progress back to defaults', async () => {
    mockGetItem.mockResolvedValue(
      JSON.stringify({ streak: 99, completedCards: ['j-001', 'j-002'] }),
    );
    const { result } = await renderHook(() => useProgress());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    await act(async () => { result.current.resetProgress(); });
    expect(result.current.progress.streak).toBe(0);
    expect(result.current.progress.completedCards).toHaveLength(0);
  });
});
