import { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
} from 'react-native';
import Svg, { Rect, Path } from 'react-native-svg';
import type { GlossaryEntry } from '../types';
import { C } from '../constants/colors';

interface GlossaryViewProps {
  entries: GlossaryEntry[];
}

type GroupedItem =
  | { type: 'header'; letter: string }
  | { type: 'entry'; entry: GlossaryEntry };

export default function GlossaryView({ entries }: GlossaryViewProps) {
  const [query, setQuery] = useState('');

  const listData = useMemo((): GroupedItem[] => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? entries.filter(
          (e) =>
            e.term.toLowerCase().includes(q) ||
            e.fullForm.toLowerCase().includes(q) ||
            e.definition.toLowerCase().includes(q),
        )
      : entries;

    const sorted = [...filtered].sort((a, b) => a.term.localeCompare(b.term));
    const grouped: GroupedItem[] = [];
    let currentLetter = '';

    for (const entry of sorted) {
      const letter = entry.term[0].toUpperCase();
      if (letter !== currentLetter) {
        currentLetter = letter;
        grouped.push({ type: 'header', letter });
      }
      grouped.push({ type: 'entry', entry });
    }
    return grouped;
  }, [entries, query]);

  if (entries.length === 0) {
    return (
      <View style={styles.empty}>
        <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="3" width="18" height="18" rx="3" stroke={C.inkDisabled} strokeWidth="1.5" />
          <Path d="M8 12h3m0 0h1a2 2 0 0 1 0 4H8v-8h3.5a2 2 0 0 1 0 4Z" stroke={C.inkDisabled} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
        <Text style={styles.emptyTitle}>Glossary is empty</Text>
        <Text style={styles.emptyBody}>
          Tap any highlighted abbreviation on a learning card to add it here. Your glossary builds as you learn.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.search}
          placeholder="Search terms..."
          placeholderTextColor={C.inkDim}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {listData.length === 0 ? (
        <View style={[styles.empty, { height: 'auto', paddingTop: 40 }]}>
          <Text style={styles.emptyTitle}>No results</Text>
          <Text style={styles.emptyBody}>Try a different search term.</Text>
        </View>
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(item, index) =>
            item.type === 'header' ? `h-${item.letter}` : `e-${item.entry.term}-${index}`
          }
          renderItem={({ item }) => {
            if (item.type === 'header') {
              return (
                <View style={styles.letterHeader}>
                  <Text style={styles.letterText}>{item.letter}</Text>
                </View>
              );
            }
            const { entry } = item;
            return (
              <View style={styles.entry}>
                <View style={styles.entryTermRow}>
                  <Text style={styles.term}>{entry.term}</Text>
                  <Text style={styles.fullForm}>{entry.fullForm}</Text>
                </View>
                <Text style={styles.definition}>{entry.definition}</Text>
                <Text style={styles.cardRef}>From: {entry.firstCardTitle}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchWrap: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: C.bg,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  search: {
    backgroundColor: C.bgInput,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    color: C.ink,
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 44,
  },
  letterHeader: {
    backgroundColor: C.bg,
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  letterText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: C.inkDim,
  },
  entry: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: 4,
  },
  entryTermRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  term: {
    fontSize: 15,
    fontWeight: '700',
    color: C.ink,
  },
  fullForm: {
    fontSize: 12,
    fontWeight: '600',
    color: C.accentLight,
  },
  definition: {
    fontSize: 13,
    color: C.inkMuted,
    lineHeight: 19.5,
  },
  cardRef: {
    fontSize: 11,
    color: C.inkDim,
    marginTop: 2,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.inkMuted,
  },
  emptyBody: {
    fontSize: 13,
    color: C.inkDim,
    lineHeight: 20.8,
    maxWidth: 240,
    textAlign: 'center',
  },
});
