import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { C } from '../constants/colors';

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
}

const langLabel = (lang: string) => {
  if (lang === 'csharp') return 'C#';
  if (lang === 'bash') return 'Shell';
  if (lang === 'markup') return 'HTML';
  return lang.charAt(0).toUpperCase() + lang.slice(1);
};

export default function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.filename}>{filename ?? langLabel(language)}</Text>
        <TouchableOpacity
          style={styles.copyBtn}
          onPress={handleCopy}
          activeOpacity={0.7}
          accessibilityLabel={copied ? 'Copied!' : 'Copy code'}
        >
          <Text style={[styles.copyText, copied && styles.copiedText]}>
            {copied ? '✓ Copied' : 'Copy'}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.code}>{code}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: C.bgCode,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  filename: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: C.inkDim,
  },
  copyBtn: {
    backgroundColor: C.bgInput,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  copyText: {
    fontSize: 11,
    color: C.inkDim,
  },
  copiedText: {
    color: C.green,
  },
  scroll: {
    maxHeight: 280,
  },
  scrollContent: {
    padding: 14,
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 12.5,
    lineHeight: 20,
    color: '#abb2bf',
  },
});
