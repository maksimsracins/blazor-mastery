import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
  Linking,
} from 'react-native';
import type {
  LearningCard as LearningCardType,
  Abbreviation,
  GlossaryEntry,
} from '../types';
import { C, tierColor, tierBg } from '../constants/colors';
import CodeBlock from './CodeBlock';
import YouTubeCard from './YouTubeCard';

const SOURCE_TYPE_LABEL: Record<string, string> = {
  docs: 'Official Documentation',
  book: 'Book',
  youtube: 'YouTube Channel',
  blog: 'Blog',
};

// Splits a body paragraph into an array of plain strings and matched abbreviations
type Segment = { type: 'text'; value: string } | { type: 'abbrev'; abbrev: Abbreviation };

function parseSegments(text: string, abbrevs: Abbreviation[]): Segment[] {
  if (!abbrevs.length) return [{ type: 'text', value: text }];

  const escaped = abbrevs.map((a) => a.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`\\b(${escaped.join('|')})\\b`, 'g');
  const segments: Segment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    const abbrev = abbrevs.find((a) => a.term === match![0])!;
    segments.push({ type: 'abbrev', abbrev });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    segments.push({ type: 'text', value: text.slice(lastIndex) });
  }
  return segments;
}

interface LearningCardProps {
  card: LearningCardType;
  cardIndex: number;
  totalCards: number;
  onDiscover: (entry: GlossaryEntry) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
}

export default function LearningCard({
  card,
  cardIndex,
  totalCards,
  onDiscover,
  isBookmarked,
  onToggleBookmark,
}: LearningCardProps) {
  const [openAbbrev, setOpenAbbrev] = useState<Abbreviation | null>(null);
  const abbrevs = card.abbreviations ?? [];
  const showHint = cardIndex < 3;

  const handleAbbrevPress = (abbrev: Abbreviation) => {
    setOpenAbbrev(abbrev);
    onDiscover({
      term: abbrev.term,
      fullForm: abbrev.fullForm,
      definition: abbrev.definition,
      firstCardId: card.id,
      firstCardTitle: card.topicTitle,
    });
  };

  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.inner}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={[styles.tierBadge, { backgroundColor: tierBg(card.tier) }]}>
            <Text style={[styles.tierText, { color: tierColor(card.tier) }]}>
              {card.tier.charAt(0).toUpperCase() + card.tier.slice(1)}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.sourceChip}>
              {SOURCE_TYPE_LABEL[card.source.type] ?? card.source.type}
            </Text>
            {onToggleBookmark && (
              <TouchableOpacity
                style={styles.bookmarkBtn}
                onPress={() => onToggleBookmark(card.id)}
                activeOpacity={0.7}
                accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Save card'}
              >
                <Text style={[styles.bookmarkIcon, isBookmarked && styles.bookmarkIconActive]}>
                  {isBookmarked ? '🔖' : '🔖'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>{card.topicTitle}</Text>

        {/* Body */}
        <View style={styles.body}>
          {card.body.map((para, i) => {
            const segments = parseSegments(para, abbrevs);
            return (
              <Text key={i} style={styles.bodyText}>
                {segments.map((seg, j) => {
                  if (seg.type === 'text') {
                    return <Text key={j}>{seg.value}</Text>;
                  }
                  return (
                    <Text
                      key={j}
                      style={styles.abbrevChip}
                      onPress={() => handleAbbrevPress(seg.abbrev)}
                      suppressHighlighting
                    >
                      {'·'}{seg.abbrev.term}
                    </Text>
                  );
                })}
              </Text>
            );
          })}
        </View>

        {/* Code block */}
        {card.codeBlock && (
          <CodeBlock
            code={card.codeBlock.code}
            language={card.codeBlock.language}
            filename={card.codeBlock.filename}
          />
        )}

        {/* YouTube reference */}
        {card.youtubeRef && <YouTubeCard yt={card.youtubeRef} />}

        {/* Key takeaway */}
        <View style={styles.keyTakeaway}>
          <Text style={styles.keyTakeawayLabel}>Key Takeaway</Text>
          <Text style={styles.keyTakeawayText}>{card.keyTakeaway}</Text>
        </View>

        {/* Source attribution */}
        <TouchableOpacity
          style={styles.attribution}
          activeOpacity={card.source.url ? 0.6 : 1}
          onPress={() => card.source.url && Linking.openURL(card.source.url)}
          disabled={!card.source.url}
        >
          <Text style={styles.attributionLabel}>Content sourced from</Text>
          <Text style={[styles.attributionName, card.source.url && styles.attributionLink]}>
            {card.source.name}{card.source.url ? ' ↗' : ''}
          </Text>
        </TouchableOpacity>

        {showHint && (
          <Text style={styles.swipeHint}>Swipe right when ready →</Text>
        )}

        <View style={{ height: 4 }} />
      </ScrollView>

      {/* Abbreviation tooltip modal */}
      <Modal
        visible={!!openAbbrev}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenAbbrev(null)}
      >
        <TouchableWithoutFeedback onPress={() => setOpenAbbrev(null)}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.tooltip}>
                <Text style={styles.tooltipFullForm}>{openAbbrev?.fullForm}</Text>
                <Text style={styles.tooltipDef}>{openAbbrev?.definition}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  inner: {
    padding: 20,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sourceChip: {
    fontSize: 10,
    color: C.inkMuted,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  attribution: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.border,
    paddingTop: 12,
    gap: 2,
  },
  attributionLabel: {
    fontSize: 10,
    color: C.inkDim,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  attributionName: {
    fontSize: 13,
    color: C.inkMuted,
    fontWeight: '600',
  },
  attributionLink: {
    color: C.accentLight,
  },
  bookmarkBtn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkIcon: {
    fontSize: 16,
    opacity: 0.4,
  },
  bookmarkIconActive: {
    opacity: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 25,
    letterSpacing: -0.5,
    color: C.ink,
  },
  body: {
    gap: 10,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 23.8,
    color: C.ink2,
  },
  abbrevChip: {
    color: C.accentLight,
    fontWeight: '600',
    backgroundColor: C.accentDim,
  },
  keyTakeaway: {
    borderWidth: 1,
    borderColor: 'rgba(124, 111, 247, 0.3)',
    backgroundColor: 'rgba(124, 111, 247, 0.06)',
    borderRadius: 12,
    padding: 12,
  },
  keyTakeawayLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: C.accentLight,
    marginBottom: 5,
  },
  keyTakeawayText: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19.5,
    color: C.ink,
  },
  swipeHint: {
    fontSize: 11,
    color: C.inkDim,
    textAlign: 'center',
    paddingBottom: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  tooltip: {
    backgroundColor: C.bgCard2,
    borderWidth: 1,
    borderColor: C.borderStrong,
    borderRadius: 12,
    padding: 16,
    maxWidth: 320,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  tooltipFullForm: {
    fontSize: 15,
    fontWeight: '700',
    color: C.ink,
    marginBottom: 6,
  },
  tooltipDef: {
    fontSize: 13,
    color: C.inkMuted,
    lineHeight: 19.5,
  },
});
