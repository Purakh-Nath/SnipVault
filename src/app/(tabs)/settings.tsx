import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Alert, StyleSheet,
} from 'react-native';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { saveApiKey, getApiKey, deleteApiKey } from '../../services/ai';
import { useThemeStore } from '../../store/useThemeStore';
import { useColors } from '../../hooks/useColors';
import { Theme } from '../../constants/theme';
import { snippetQueries } from '../../db/snippets';

function SettingsRow({
  label,
  value,
  onPress,
  destructive = false,
}: {
  label: string;
  value?: string;
  onPress: () => void;
  destructive?: boolean;
}) {
  const { c, Colors } = useColors();
  return (
    <TouchableOpacity style={[styles.row, { borderBottomColor: c.borderSubtle }]} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.rowLabel, { color: c.textPrimary }, destructive && { color: Colors.danger }]}>
        {label}
      </Text>
      {value && <Text style={[styles.rowValue, { color: c.textSecondary }]}>{value}</Text>}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { mode, toggle } = useThemeStore();
  const { c, Colors } = useColors();
  const [apiKey,    setApiKey]    = useState('');
  const [hasKey,    setHasKey]    = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [count,     setCount]     = useState(0);

  useEffect(() => {
    (async () => {
      const saved = await getApiKey();
      setHasKey(!!saved);
      setCount(snippetQueries.getCount());
    })();
  }, []);

  const handleSaveKey = async () => {
    if (!apiKey.trim()) return;
    setSaving(true);
    try {
      await saveApiKey(apiKey.trim());
      setHasKey(true);
      setApiKey('');
      Alert.alert('Saved', 'API key saved securely.');
    } catch {
      Alert.alert('Error', 'Failed to save API key.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteKey = () => {
    Alert.alert(
      'Remove API Key',
      'This will disable AI explanations until you add a new key.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await deleteApiKey();
            setHasKey(false);
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: c.background }]}
      contentContainerStyle={styles.content}
    >
      {/* App info */}
      <View style={styles.appInfo}>
        <Text style={styles.appName}>SnipVault</Text>
        <Text style={[styles.appSub, { color: c.textSecondary }]}>Your offline code library</Text>
        <View style={[styles.statPill, { backgroundColor: c.surface, borderColor: c.border }]}>
          <Text style={[styles.statText, { color: c.textSecondary }]}>{count} snippets saved</Text>
        </View>
      </View>

      {/* Appearance */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: c.textMuted }]}>APPEARANCE</Text>
        <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
          <SettingsRow
            label="Theme"
            value={mode === 'dark' ? '🌙 Dark' : '☀️ Light'}
            onPress={toggle}
          />
        </View>
      </View>

      {/* AI */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: c.textMuted }]}>AI INTEGRATION</Text>
        <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
          <View style={[styles.keyStatus, { borderBottomColor: c.borderSubtle }]}>
            <Text style={[styles.rowLabel, { color: c.textPrimary }]}>OpenRouter API Key</Text>
            <View style={[styles.badge, hasKey ? styles.badgeGreen : [styles.badgeGray, { backgroundColor: c.surfaceRaised, borderColor: c.border }]]}>
              <Text style={[styles.badgeText, { color: c.textPrimary }]}>{hasKey ? 'Active' : 'Not set'}</Text>
            </View>
          </View>

          {!hasKey ? (
            <View style={styles.keyForm}>
              <Input
                value={apiKey}
                onChangeText={setApiKey}
                placeholder="sk-or-v1-"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Button
                label="Save API Key"
                onPress={handleSaveKey}
                loading={saving}
                variant="primary"
                fullWidth
              />
              <Text style={[styles.keyHint, { color: c.textMuted }]}>
                Your key is stored securely on-device using SecureStore and never sent anywhere except the AI provider.
              </Text>
            </View>
          ) : (
            <SettingsRow
              label="Remove API Key"
              onPress={handleDeleteKey}
              destructive
            />
          )}
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: c.textMuted }]}>ABOUT</Text>
        <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
          <SettingsRow label="Version"  value="1.0.0" onPress={() => {}} />
          <SettingsRow label="Storage"  value="SQLite + FileSystem" onPress={() => {}} />
          <SettingsRow label="SDK"      value="Expo 55" onPress={() => {}} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content:   { padding: Theme.spacing.md, gap: Theme.spacing.lg, paddingBottom: 60 },

  appInfo: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.xl,
    gap: Theme.spacing.xs,
  },
  appName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize:   Theme.fontSize.display,
    color:      '#00D9A3',
    letterSpacing: -0.5,
  },
  appSub: {
    fontFamily: 'Inter_400Regular',
    fontSize:   Theme.fontSize.md,
  },
  statPill: {
    marginTop:       Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical:   Theme.spacing.xs,
    borderRadius:     Theme.radius.full,
    borderWidth:      1,
  },
  statText: {
    fontFamily: 'Inter_400Regular',
    fontSize:   Theme.fontSize.sm,
  },

  section:      { gap: Theme.spacing.sm },
  sectionTitle: {
    fontFamily:    'Inter_600SemiBold',
    fontSize:      Theme.fontSize.xs,
    letterSpacing: 1.2,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius:    Theme.radius.lg,
    borderWidth:     1,
    overflow:        'hidden',
  },

  row: {
    flexDirection:   'row',
    justifyContent:  'space-between',
    alignItems:      'center',
    padding:         Theme.spacing.md,
    borderBottomWidth: 1,
  },
  rowLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize:   Theme.fontSize.md,
  },
  rowValue: {
    fontFamily: 'Inter_400Regular',
    fontSize:   Theme.fontSize.sm,
  },

  keyStatus: {
    flexDirection:   'row',
    justifyContent:  'space-between',
    alignItems:      'center',
    padding:         Theme.spacing.md,
    borderBottomWidth: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical:    3,
    borderRadius:       Theme.radius.full,
  },
  badgeGreen: { backgroundColor: '#3FB950' + '22', borderWidth: 1, borderColor: '#3FB950' + '55' },
  badgeGray:  { borderWidth: 1 },
  badgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize:   Theme.fontSize.xs,
  },

  keyForm: {
    padding: Theme.spacing.md,
    gap:     Theme.spacing.md,
  },
  keyHint: {
    fontFamily: 'Inter_400Regular',
    fontSize:   Theme.fontSize.xs,
    lineHeight: 18,
    textAlign:  'center',
  },
});