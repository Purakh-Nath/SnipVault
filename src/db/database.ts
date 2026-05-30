import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('snipvault.db');

export async function initDatabase(): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS snippets (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT NOT NULL,
      code        TEXT NOT NULL,
      language    TEXT NOT NULL DEFAULT 'plaintext',
      tags        TEXT NOT NULL DEFAULT '[]',
      is_favorite INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS files (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      path        TEXT NOT NULL UNIQUE,
      size        INTEGER,
      mime_type   TEXT,
      snippet_id  INTEGER REFERENCES snippets(id) ON DELETE SET NULL,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS snippets_fts
    USING fts5(title, code, tags, content=snippets, content_rowid=id);

    CREATE TRIGGER IF NOT EXISTS snippets_ai AFTER INSERT ON snippets BEGIN
      INSERT INTO snippets_fts(rowid, title, code, tags)
      VALUES (new.id, new.title, new.code, new.tags);
    END;

    CREATE TRIGGER IF NOT EXISTS snippets_au AFTER UPDATE ON snippets BEGIN
      INSERT INTO snippets_fts(snippets_fts, rowid, title, code, tags)
      VALUES('delete', old.id, old.title, old.code, old.tags);
      INSERT INTO snippets_fts(rowid, title, code, tags)
      VALUES (new.id, new.title, new.code, new.tags);
    END;

    CREATE TRIGGER IF NOT EXISTS snippets_ad AFTER DELETE ON snippets BEGIN
      INSERT INTO snippets_fts(snippets_fts, rowid, title, code, tags)
      VALUES('delete', old.id, old.title, old.code, old.tags);
    END;
  `);
}

export default db;