// src/app/+not-found.tsx

import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '../constants/colors';
import { Theme } from '../constants/theme';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🔍</Text>
      <Text style={styles.title}>Page not found</Text>
      <Link href="/" style={styles.link}>
        Go home
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: Colors.dark.background,
    alignItems:      'center',
    justifyContent:  'center',
    gap:             Theme.spacing.md,
  },
  emoji: { fontSize: 48 },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize:   Theme.fontSize.xl,
    color:      Colors.dark.textPrimary,
  },
  link: {
    fontFamily: 'Inter_400Regular',
    fontSize:   Theme.fontSize.md,
    color:      Colors.primary,
  },
});