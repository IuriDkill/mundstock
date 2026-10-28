import { useTranslation } from 'react-i18next';
import { CONTACT } from '@/pages/home/content';
import styles from './style.module.css';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <p>
          © {year} Iuri Mundstock · {t('footer.madeWith')}
        </p>

        <nav className={styles.links} aria-label={t('footer.linksAria')}>
          <a href={CONTACT.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={CONTACT.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={`mailto:${CONTACT.email}`}>Email</a>
        </nav>
      </div>
    </footer>
  );
}
