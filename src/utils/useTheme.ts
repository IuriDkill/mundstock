import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const readTheme = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

// The Header owns the toggle and writes it to <html data-theme>; this keeps any other component in sync.
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(readTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return theme;
}
