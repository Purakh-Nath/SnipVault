import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, type LayoutChangeEvent,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';

interface CodeBlockProps {
  code: string;
  language?: string;
  maxHeight?: number;
}

export function CodeBlock({ code, language, maxHeight = 300 }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.container}>
      {/* header bar */}
      <View style={styles.header}>
        <Text style={styles.lang}>{language ?? 'code'}</Text>
        <TouchableOpacity onPress={handleCopy} hitSlop={8}>
          <Text style={[styles.copyBtn, copied && styles.copied]}>
            {copied ? '✓ Copied' : 'Copy'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* code content */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight }}
        nestedScrollEnabled
      >
        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
          <Text style={styles.code} selectable>
            {code}
          </Text>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.codeBg,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: Colors.dark.borderSubtle,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.borderSubtle,
    backgroundColor: Colors.dark.surface,
  },
  lang: {
    fontFamily: Theme.fontFamily.mono,
    fontSize: Theme.fontSize.xs,
    color: Colors.primary,
  },
  copyBtn: {
    fontFamily: Theme.fontFamily.semibold,
    fontSize: Theme.fontSize.xs,
    color: Colors.dark.textSecondary,
  },
  copied: { color: Colors.success },
  code: {
    fontFamily: Theme.fontFamily.mono,
    fontSize: Theme.fontSize.sm,
    color: Colors.dark.textPrimary,
    lineHeight: 22,
    padding: Theme.spacing.md,
  },
});