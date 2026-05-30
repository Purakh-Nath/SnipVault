export interface Language {
  label: string;
  value: string;
  color: string;
}

export const LANGUAGES: Language[] = [
  { label: 'JavaScript', value: 'javascript', color: '#F7DF1E' },
  { label: 'TypeScript', value: 'typescript', color: '#3178C6' },
  { label: 'Python',     value: 'python',     color: '#3572A5' },
  { label: 'Rust',       value: 'rust',       color: '#FF6B35' },
  { label: 'Go',         value: 'go',         color: '#00ADD8' },
  { label: 'Java',       value: 'java',       color: '#B07219' },
  { label: 'C++',        value: 'cpp',        color: '#F34B7D' },
  { label: 'C#',         value: 'csharp',     color: '#178600' },
  { label: 'PHP',        value: 'php',        color: '#4F5D95' },
  { label: 'Swift',      value: 'swift',      color: '#F05138' },
  { label: 'Kotlin',     value: 'kotlin',     color: '#7F52FF' },
  { label: 'Dart',       value: 'dart',       color: '#00B4AB' },
  { label: 'HTML',       value: 'html',       color: '#E34C26' },
  { label: 'CSS',        value: 'css',        color: '#563D7C' },
  { label: 'SQL',        value: 'sql',        color: '#00D9A3' },
  { label: 'Shell',      value: 'shell',      color: '#89E051' },
  { label: 'JSON',       value: 'json',       color: '#7D8590' },
  { label: 'YAML',       value: 'yaml',       color: '#CB171E' },
  { label: 'Plain Text', value: 'plaintext',  color: '#7D8590' },
];

export function getLanguageColor(value: string): string {
  return LANGUAGES.find(l => l.value === value)?.color ?? '#7D8590';
}

export function getLanguageLabel(value: string): string {
  return LANGUAGES.find(l => l.value === value)?.label ?? value;
}