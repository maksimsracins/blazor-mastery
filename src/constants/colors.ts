export const C = {
  bg: '#0E0E10',
  bgCard: '#17171A',
  bgCard2: '#1A1A1E',
  bgCode: '#111113',
  bgInput: '#1E1E22',

  ink: '#F2F0EB',
  ink2: '#C8C6C1',
  inkMuted: '#9B9894',
  inkDim: '#6B6965',
  inkDisabled: '#3E3E42',

  accent: '#7C6FF7',
  accentLight: '#9B95F9',
  accentDim: 'rgba(124, 111, 247, 0.15)',
  accentGlow: 'rgba(124, 111, 247, 0.25)',

  tierJunior: '#7C6FF7',
  tierJuniorBg: 'rgba(124, 111, 247, 0.12)',
  tierMid: '#2DD4BF',
  tierMidBg: 'rgba(45, 212, 191, 0.12)',
  tierSenior: '#F59E0B',
  tierSeniorBg: 'rgba(245, 158, 11, 0.12)',

  green: '#22C55E',
  greenBg: 'rgba(34, 197, 94, 0.15)',
  amber: '#F59E0B',
  amberBg: 'rgba(245, 158, 11, 0.15)',
  red: '#EF4444',
  redBg: 'rgba(239, 68, 68, 0.12)',

  border: 'rgba(255, 255, 255, 0.07)',
  borderStrong: 'rgba(255, 255, 255, 0.12)',
};

export const tierColor = (tier: string) => {
  if (tier === 'junior') return C.tierJunior;
  if (tier === 'mid') return C.tierMid;
  return C.tierSenior;
};

export const tierBg = (tier: string): string => {
  if (tier === 'junior') return C.tierJuniorBg;
  if (tier === 'mid') return C.tierMidBg;
  return C.tierSeniorBg;
};
