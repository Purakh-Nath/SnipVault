// src/app/snippet/create.tsx

import { router } from 'expo-router';
import { SnippetForm } from '../../components/snippet/SnippetForm';
import { useSnippetStore } from '../../store/useSnippetStore';
import type { CreateSnippetInput } from '../../db/types';

export default function CreateSnippetScreen() {
  const createSnippet = useSnippetStore(s => s.create);

  const handleSubmit = (input: CreateSnippetInput) => {
    createSnippet(input);
    router.back();
  };

  return (
    <SnippetForm
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
      submitLabel="Save Snippet"
    />
  );
}