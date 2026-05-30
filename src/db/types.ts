// src/db/types.ts

export interface Snippet {
  id: number;
  title: string;
  code: string;
  language: string;
  tags: string; // stored as JSON string in SQLite '["react","hooks"]'
  is_favorite: 0 | 1;
  created_at: string;
  updated_at: string;
}

export interface SnippetParsed extends Omit<Snippet, 'tags' | 'is_favorite'> {
  tags: string[];
  is_favorite: boolean;
}

export interface CreateSnippetInput {
  title: string;
  code: string;
  language: string;
  tags: string[];
}

export interface FileRecord {
  id: number;
  name: string;
  path: string;
  size: number | null;
  mime_type: string | null;
  snippet_id: number | null;
  created_at: string;
}