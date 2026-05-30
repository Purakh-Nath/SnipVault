import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Tag } from '../ui/Tag';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import { LANGUAGES } from '../../constants/languages';
import type { CreateSnippetInput } from '../../db/types';

interface SnippetFormProps {
  initial?: Partial<CreateSnippetInput>;
  onSubmit: (input: CreateSnippetInput) => void;
  onCancel: () => void;
  loading?: boolean;
  submitLabel?: string;
}

export function SnippetForm({
  initial,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Save',
}: SnippetFormProps) {
  const [title,    setTitle]    = useState(initial?.title    ?? '');
  const [code,     setCode]     = useState(initial?.code     ?? '');
  const [language, setLanguage] = useState(initial?.language ?? 'javascript');
  const [tags,     setTags]     = useState<string[]>(initial?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [errors,   setErrors]   = useState<Record<string, string>>({});

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t) && tags.length < 8) {
      setTags(prev => [...prev, t]);
      setTagInput('');
    }
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Title is required';
    if (!code.trim())  e.code  = 'Code is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ title: title.trim(), code: code.trim(), language, tags });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <Input
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. useDebounce hook"
          error={errors.title}
        />

        {/* Language picker */}
        <View style={styles.field}>
          <Text style={styles.label}>Language</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.langRow}>
              {LANGUAGES.map(l => (
                <TouchableOpacity
                  key={l.value}
                  onPress={() => setLanguage(l.value)}
                  style={[
                    styles.langChip,
                    language === l.value && {
                      borderColor: l.color,
                      backgroundColor: l.color + '22',
                    },
                  ]}
                >
                  <Text style={[
                    styles.langChipText,
                    language === l.value && { color: l.color },
                  ]}>
                    {l.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Code */}
        <Input
          label="Code"
          value={code}
          onChangeText={setCode}
          placeholder="Paste or type your code here..."
          multiline
          numberOfLines={10}
          textAlignVertical="top"
          mono
          style={styles.codeInput}
          error={errors.code}
        />

        {/* Tags */}
        <View style={styles.field}>
          <Text style={styles.label}>Tags</Text>
          <View style={styles.tagInputRow}>
            <Input
              value={tagInput}
              onChangeText={setTagInput}
              placeholder="Add a tag..."
              onSubmitEditing={addTag}
              returnKeyType="done"
              style={styles.tagInput}
            />
            <Button label="Add" onPress={addTag} variant="secondary" size="sm" />
          </View>
          {tags.length > 0 && (
            <View style={styles.tagList}>
              {tags.map(t => (
                <Tag
                  key={t}
                  label={t}
                  onRemove={() => setTags(prev => prev.filter(x => x !== t))}
                />
              ))}
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button label="Cancel"    onPress={onCancel}     variant="ghost"   size="md" style={styles.actionBtn} />
          <Button label={submitLabel} onPress={handleSubmit} variant="primary" size="md" loading={loading} style={styles.actionBtn} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll:  { flex: 1, backgroundColor: Colors.dark.background },
  content: { padding: Theme.spacing.md, gap: Theme.spacing.md, paddingBottom: 60 },
  field:   { gap: 6 },
  label: {
    fontFamily: Theme.fontFamily.semibold,
    fontSize:   Theme.fontSize.sm,
    color:      Colors.dark.textSecondary,
  },
  langRow:  { flexDirection: 'row', gap: 8 },
  langChip: {
    paddingHorizontal: 12,
    paddingVertical:   6,
    borderRadius:      Theme.radius.full,
    borderWidth:       1,
    borderColor:       Colors.dark.border,
    backgroundColor:   Colors.dark.surfaceRaised,
  },
  langChipText: {
    fontFamily: Theme.fontFamily.regular,
    fontSize:   Theme.fontSize.sm,
    color:      Colors.dark.textSecondary,
  },
  codeInput:   { minHeight: 200 },
  tagInputRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  tagInput:    { flex: 1 },
  tagList:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  actions:     { flexDirection: 'row', gap: 12, marginTop: Theme.spacing.sm },
  actionBtn:   { flex: 1 },
});