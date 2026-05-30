import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import { formatFileSize } from '../utils/format';

const snipvaultDir = new FileSystem.Directory(FileSystem.Paths.document, 'snipvault_files');
export const FILES_DIR = snipvaultDir.uri;

export interface ManagedFile {
  name: string;
  path: string;
  size: string;
  modifiedAt: string;
  isDirectory: boolean;
}

export async function ensureFilesDir(): Promise<void> {
  if (!snipvaultDir.exists) {
    snipvaultDir.create({ intermediates: true });
  }
}

export async function listFiles(): Promise<ManagedFile[]> {
  await ensureFilesDir();
  try {
    const list = snipvaultDir.list();
    const files = list.map((item) => {
      const isDirectory = item instanceof FileSystem.Directory;
      let sizeText = '—';
      let modTime = new Date().toISOString();

      if (item instanceof FileSystem.File) {
        sizeText = item.size ? formatFileSize(item.size) : '—';
        modTime = item.modificationTime
          ? new Date(item.modificationTime).toISOString()
          : new Date().toISOString();
      } else if (item instanceof FileSystem.Directory) {
        // Directory doesn't have modificationTime directly on the object, or if it does, fallback is fine
        modTime = new Date().toISOString();
      }

      return {
        name: item.name,
        path: item.uri,
        size: sizeText,
        modifiedAt: modTime,
        isDirectory,
      } as ManagedFile;
    });
    return files.sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    return [];
  }
}

export async function pickAndSaveFile(): Promise<ManagedFile | null> {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
    multiple: false,
  });
  if (result.canceled) return null;

  const asset = result.assets[0];
  await ensureFilesDir();
  
  const sourceFile = new FileSystem.File(asset.uri);
  const destFile = new FileSystem.File(snipvaultDir, asset.name);
  
  sourceFile.copy(destFile);
  
  return {
    name: asset.name,
    path: destFile.uri,
    size: destFile.size ? formatFileSize(destFile.size) : '—',
    modifiedAt: destFile.modificationTime
      ? new Date(destFile.modificationTime).toISOString()
      : new Date().toISOString(),
    isDirectory: false,
  };
}

export async function deleteFile(path: string): Promise<void> {
  const info = FileSystem.Paths.info(path);
  if (info.exists) {
    if (info.isDirectory) {
      new FileSystem.Directory(path).delete();
    } else {
      new FileSystem.File(path).delete();
    }
  }
}

export async function shareFile(path: string): Promise<void> {
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(path);
  }
}

export async function saveTextAsFile(
  filename: string,
  content: string
): Promise<string> {
  await ensureFilesDir();
  const file = new FileSystem.File(snipvaultDir, filename);
  file.write(content);
  return file.uri;
}
