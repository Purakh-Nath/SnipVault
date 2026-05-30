import db from './database';
import type { Snippet, CreateSnippetInput } from './types';

export const snippetQueries = {
  getAll(): Snippet[] {
    return db.getAllSync(
      'SELECT * FROM snippets ORDER BY updated_at DESC'
    ) as Snippet[];
  },

  getById(id: number): Snippet | null {
    return db.getFirstSync(
      'SELECT * FROM snippets WHERE id = ?',
      [id]
    ) as Snippet | null;
  },

  getFavorites(): Snippet[] {
    return db.getAllSync(
      'SELECT * FROM snippets WHERE is_favorite = 1 ORDER BY updated_at DESC'
    ) as Snippet[];
  },

  getByLanguage(language: string): Snippet[] {
    return db.getAllSync(
      'SELECT * FROM snippets WHERE language = ? ORDER BY updated_at DESC',
      [language]
    ) as Snippet[];
  },

  search(query: string): Snippet[] {
    if (!query.trim()) return this.getAll();
    try {
      return db.getAllSync(
        `SELECT s.* FROM snippets s
         JOIN snippets_fts fts ON s.id = fts.rowid
         WHERE snippets_fts MATCH ?
         ORDER BY rank`,
        [`${query.trim()}*`]
      ) as Snippet[];
    } catch {
      // fallback to LIKE search if FTS fails
      const q = `%${query}%`;
      return db.getAllSync(
        'SELECT * FROM snippets WHERE title LIKE ? OR code LIKE ? ORDER BY updated_at DESC',
        [q, q]
      ) as Snippet[];
    }
  },

  create(input: CreateSnippetInput): number {
    const result = db.runSync(
      `INSERT INTO snippets (title, code, language, tags)
       VALUES (?, ?, ?, ?)`,
      [input.title, input.code, input.language, JSON.stringify(input.tags)]
    );
    return result.lastInsertRowId;
  },

  update(id: number, input: Partial<CreateSnippetInput>): void {
    const current = this.getById(id);
    if (!current) return;
    db.runSync(
      `UPDATE snippets SET
        title      = ?,
        code       = ?,
        language   = ?,
        tags       = ?,
        updated_at = datetime('now')
       WHERE id = ?`,
      [
        input.title    ?? current.title,
        input.code     ?? current.code,
        input.language ?? current.language,
        input.tags     ? JSON.stringify(input.tags) : current.tags,
        id,
      ]
    );
  },

  toggleFavorite(id: number): void {
    db.runSync(
      'UPDATE snippets SET is_favorite = NOT is_favorite, updated_at = datetime(\'now\') WHERE id = ?',
      [id]
    );
  },

  delete(id: number): void {
    db.runSync('DELETE FROM snippets WHERE id = ?', [id]);
  },

  getCount(): number {
    const result = db.getFirstSync('SELECT COUNT(*) as count FROM snippets') as { count: number };
    return result?.count ?? 0;
  },
};