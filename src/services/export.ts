import * as Sharing from 'expo-sharing';
import { saveTextAsFile } from './fileManager';
import type { SnippetParsed } from '../db/types';

export type ExportFormat = 'txt' | 'js' | 'json';

function buildContent(snippet: SnippetParsed, format: ExportFormat): string {
  if (format === 'json') {
    return JSON.stringify(
      {
        title: snippet.title,
        language: snippet.language,
        tags: snippet.tags,
        code: snippet.code,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  }
  if (format === 'js') {
    return `// ${snippet.title}\n// Language: ${snippet.language}\n// Tags: ${snippet.tags.join(', ')}\n\n${snippet.code}`;
  }
  // txt
  return `Title: ${snippet.title}\nLanguage: ${snippet.language}\nTags: ${snippet.tags.join(', ')}\nCreated: ${snippet.created_at}\n\n${snippet.code}`;
}

function buildFilename(title: string, format: ExportFormat): string {
  const safe = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  return `${safe}.${format}`;
}

export async function exportSnippet(
  snippet: SnippetParsed,
  format: ExportFormat
): Promise<void> {
  const content  = buildContent(snippet, format);
  const filename = buildFilename(snippet.title, format);
  const path     = await saveTextAsFile(filename, content);

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(path, {
      mimeType: format === 'json' ? 'application/json' : 'text/plain',
      dialogTitle: `Export "${snippet.title}"`,
    });
  }
}