import { useThemeStore } from '../store/useThemeStore';
import { Colors } from '../constants/colors';

export function useColors() {
  const mode = useThemeStore(s => s.mode);
  return {
    scheme: mode,
    c: mode === 'dark' ? Colors.dark : Colors.light,
    Colors,
  };
}
