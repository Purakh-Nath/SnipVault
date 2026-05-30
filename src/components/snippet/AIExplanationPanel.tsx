import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import { useAI } from '../../hooks/useAI';

interface AIExplanationPanelProps {
  code:     string;
  language: string;
}

export function AIExplanationPanel({ code, language }: AIExplanationPanelProps) {
  const { status, data, error, explain, reset } = useAI();

  if (status === 'idle') {
    return (
      <Card style={styles.card}>
        <Text style={styles.heading}>✦ AI Explanation</Text>
        <Text style={styles.hint}>
          Get an AI-powered explanation, summary, and improvement suggestions for this snippet.
        </Text>
        <Button
          label="Explain this code"
          onPress={() => explain(code, language)}
          variant="primary"
          size="md"
          fullWidth
          style={styles.btn}
        />
      </Card>
    );
  }

  if (status === 'loading') {
    return (
      <Card style={[styles.card, styles.center]}>
        <ActivityIndicator color={Colors.primary} size="large" />
        <Text style={styles.hint}>Analyzing your code...</Text>
      </Card>
    );
  }

  if (status === 'error') {
    return (
      <Card style={styles.card}>
        <Text style={styles.heading}>✦ AI Explanation</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Button label="Try again" onPress={reset} variant="secondary" size="sm" style={styles.btn} />
      </Card>
    );
  }

  // success
  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.heading}>✦ AI Explanation</Text>
        <Button label="Reset" onPress={reset} variant="ghost" size="sm" />
      </View>

      {/* Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>SUMMARY</Text>
        <Text style={styles.summaryText}>{data!.summary}</Text>
      </View>

      {/* Explanation */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>EXPLANATION</Text>
        <Text style={styles.bodyText}>{data!.explanation}</Text>
      </View>

      {/* Improvements */}
      {data!.improvements.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SUGGESTIONS</Text>
          {data!.improvements.map((item, i) => (
            <View key={i} style={styles.bullet}>
              <Text style={styles.bulletDot}>→</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card:    { gap: Theme.spacing.md },
  center:  { alignItems: 'center', gap: Theme.spacing.md },
  row:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heading: {
    fontFamily: Theme.fontFamily.semibold,
    fontSize:   Theme.fontSize.md,
    color:      Colors.primary,
  },
  hint: {
    fontFamily: Theme.fontFamily.regular,
    fontSize:   Theme.fontSize.sm,
    color:      Colors.dark.textSecondary,
    lineHeight: 20,
  },
  errorText: {
    fontFamily: Theme.fontFamily.regular,
    fontSize:   Theme.fontSize.sm,
    color:      Colors.danger,
    lineHeight: 20,
  },
  btn: { marginTop: Theme.spacing.xs },
  section:      { gap: 6 },
  sectionLabel: {
    fontFamily: Theme.fontFamily.semibold,
    fontSize:   Theme.fontSize.xs,
    color:      Colors.dark.textMuted,
    letterSpacing: 1,
  },
  summaryText: {
    fontFamily: Theme.fontFamily.semibold,
    fontSize:   Theme.fontSize.md,
    color:      Colors.dark.textPrimary,
    lineHeight: 22,
  },
  bodyText: {
    fontFamily: Theme.fontFamily.regular,
    fontSize:   Theme.fontSize.sm,
    color:      Colors.dark.textSecondary,
    lineHeight: 22,
  },
  bullet:     { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  bulletDot:  { color: Colors.primary, fontFamily: Theme.fontFamily.mono, marginTop: 2 },
  bulletText: {
    flex: 1,
    fontFamily: Theme.fontFamily.regular,
    fontSize:   Theme.fontSize.sm,
    color:      Colors.dark.textSecondary,
    lineHeight: 20,
  },
});