import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polygon, Text as SvgText } from 'react-native-svg';
import { C, tierColor, tierBg } from '../constants/colors';
import type { Tier } from '../types';

interface TopBarProps {
  currentTier: Tier;
  bookmarkCount: number;
}

export default function TopBar({ currentTier, bookmarkCount }: TopBarProps) {
  const tierLabel = currentTier.charAt(0).toUpperCase() + currentTier.slice(1);

  return (
    <View style={styles.container}>
      <View style={styles.logoArea}>
        <Svg width={28} height={28} viewBox="0 0 28 28">
          <Polygon
            points="14,2 26,8 26,20 14,26 2,20 2,8"
            fill="none"
            stroke={C.accent}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <SvgText
            x="14"
            y="18"
            fontFamily="system-ui"
            fontSize="10"
            fontWeight="800"
            fill={C.ink}
            textAnchor="middle"
          >
            B
          </SvgText>
        </Svg>
        <Text style={styles.logoText}>BlazorPath</Text>
      </View>

      <View style={styles.right}>
        {bookmarkCount > 0 && (
          <View style={styles.bookmarkBadge}>
            <Text style={styles.bookmarkCount}>{bookmarkCount}</Text>
          </View>
        )}
        <View style={[styles.tierBadge, { backgroundColor: tierBg(currentTier) }]}>
          <Text style={[styles.tierText, { color: tierColor(currentTier) }]}>
            {tierLabel}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 20,
    backgroundColor: C.bg,
  },
  logoArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: C.ink,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bookmarkBadge: {
    backgroundColor: C.bgInput,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
  },
  bookmarkCount: {
    fontSize: 12,
    fontWeight: '600',
    color: C.inkMuted,
  },
  tierBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  tierText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.44,
    textTransform: 'uppercase',
  },
});
