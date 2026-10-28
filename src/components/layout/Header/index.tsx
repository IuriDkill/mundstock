import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import styles from './style.module.css';
import { useTranslation } from 'react-i18next';

type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'theme';

const NAV_LINKS = [
  { href: '#sobre', key: 'about' },
  { href: '#formacao', key: 'education' },
  { href: '#habilidades', key: 'skills' },
  { href: '#projetos', key: 'projects' },
  { href: '#contato', key: 'contact' },
] as const;

const getInitialTheme = (): Theme => {
  const current = document.documentElement.dataset.theme;
  if (current === 'light' || current === 'dark') return current;

  return 'dark';
};

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.themeIcon}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.themeIcon}>
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
    </svg>
  );
}

export default function Header() {
  const { i18n, t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const headerRef = useRef<HTMLElement>(null);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Storage can be unavailable (private mode); the theme still applies for this visit.
    }
  };

  const changeLanguage = (lng: 'pt-BR' | 'en') => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    document.documentElement.lang = i18n.language === 'en' ? 'en' : 'pt-BR';
  }, [i18n.language]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 24) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
        setIsMenuOpen(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setIsMenuOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isMenuOpen]);

  const currentLang = i18n.language;
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header ref={headerRef} className={`${styles.headerContainer} ${!isVisible ? styles.hidden : ''}`}>
      <div className={styles.headerInner}>
        <a className={styles.brand} href="#top" onClick={closeMenu}>
          <span className={styles.brandMark} aria-hidden="true">IM</span>
          <span className={styles.brandText}>
            <strong>Iuri Mundstock</strong>
            <small>{t('header.role')}</small>
          </span>
        </a>

        <nav className={styles.nav} aria-label={t('header.navAria')}>
          {NAV_LINKS.map((link) => (
            <a key={link.key} href={link.href}>
              {t(`header.nav.${link.key}`)}
            </a>
          ))}
        </nav>

        <div className={styles.headerActions}>
          <a className={styles.cta} href="#contato">
            {t('header.cta')}
          </a>

          <button
            type="button"
            className={styles.iconButton}
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t('header.theme.toLight') : t('header.theme.toDark')}
            title={theme === 'dark' ? t('header.theme.toLight') : t('header.theme.toDark')}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          <div className={styles.langSelector}>
            <button
              onClick={() => changeLanguage('pt-BR')}
              className={`${styles.langButton} ${currentLang !== 'en' ? styles.active : ''}`}
              aria-label="Português"
              aria-pressed={currentLang !== 'en'}
              type="button"
            >
              PT
            </button>

            <button
              onClick={() => changeLanguage('en')}
              className={`${styles.langButton} ${currentLang === 'en' ? styles.active : ''}`}
              aria-label="English"
              aria-pressed={currentLang === 'en'}
              type="button"
            >
              EN
            </button>
          </div>

          <button
            type="button"
            className={`${styles.iconButton} ${styles.menuButton} ${isMenuOpen ? styles.menuButtonOpen : ''}`}
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? t('header.menu.close') : t('header.menu.open')}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              id="mobile-menu"
              className={styles.mobileMenu}
              aria-label={t('header.navAria')}
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {NAV_LINKS.map((link, index) => (
                <motion.a
                  key={link.key}
                  href={link.href}
                  onClick={closeMenu}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * index }}
                >
                  {t(`header.nav.${link.key}`)}
                  <span aria-hidden="true">→</span>
                </motion.a>
              ))}

              <a className={`${styles.cta} ${styles.mobileMenuCta}`} href="#contato" onClick={closeMenu}>
                {t('header.cta')}
              </a>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
