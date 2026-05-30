import { useState, useCallback } from 'react';
import {
  listFiles,
  pickAndSaveFile,
  deleteFile,
  shareFile,
  type ManagedFile,
} from '../services/fileManager';

export function useFileSystem() {
  const [files, setFiles] = useState<ManagedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listFiles();
      setFiles(result);
    } catch (e) {
      setError('Failed to load files');
    } finally {
      setLoading(false);
    }
  }, []);

  const pickFile = useCallback(async (): Promise<boolean> => {
    try {
      const file = await pickAndSaveFile();
      if (file) {
        await refresh();
        return true;
      }
      return false;
    } catch {
      setError('Failed to import file');
      return false;
    }
  }, [refresh]);

  const removeFile = useCallback(async (path: string) => {
    try {
      await deleteFile(path);
      await refresh();
    } catch {
      setError('Failed to delete file');
    }
  }, [refresh]);

  const share = useCallback(async (path: string) => {
    try {
      await shareFile(path);
    } catch {
      setError('Failed to share file');
    }
  }, []);

  return { files, loading, error, refresh, pickFile, removeFile, share };
}