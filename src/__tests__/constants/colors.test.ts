import { C, tierColor, tierBg } from '../../constants/colors';

describe('tierColor', () => {
  it('returns junior color', () => expect(tierColor('junior')).toBe(C.tierJunior));
  it('returns mid color', () => expect(tierColor('mid')).toBe(C.tierMid));
  it('returns senior color', () => expect(tierColor('senior')).toBe(C.tierSenior));
  it('falls back to senior for unknown values', () => {
    expect(tierColor('unknown')).toBe(C.tierSenior);
  });
});

describe('tierBg', () => {
  it('returns junior bg', () => expect(tierBg('junior')).toBe(C.tierJuniorBg));
  it('returns mid bg', () => expect(tierBg('mid')).toBe(C.tierMidBg));
  it('returns senior bg', () => expect(tierBg('senior')).toBe(C.tierSeniorBg));
});

describe('C palette', () => {
  it('background color is the expected dark value', () => {
    expect(C.bg).toBe('#0E0E10');
  });

  it('accent color is defined', () => {
    expect(C.accent).toBeTruthy();
  });

  it('all tier colors are distinct', () => {
    const tierColors = [C.tierJunior, C.tierMid, C.tierSenior];
    const unique = new Set(tierColors);
    expect(unique.size).toBe(3);
  });
});
