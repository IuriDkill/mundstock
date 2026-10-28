import { lazy, Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { CONTACT, EDUCATION, PROJECTS, SKILL_GROUPS } from './content';
import { GitHubIcon, LinkedInIcon, MailIcon, ArrowIcon, GlobeIcon } from './icons';
import styles from './style.module.css';

// three.js only loads after the text is on screen.
const Scene3D = lazy(() => import('./Scene3D'));

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
} as const;

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <motion.header className={styles.sectionHeading} {...reveal}>
      <span className={styles.eyebrow}>{eyebrow}</span>
      <h2>{title}</h2>
    </motion.header>
  );
}

function Hero() {
  const { t } = useTranslation();

  return (
    <section id="top" className={styles.hero}>
      <motion.div
        className={styles.heroText}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className={styles.prompt}>
          <span aria-hidden="true">~/mundstock $</span> whoami
        </span>
        <p className={styles.greeting}>{t('hero.greeting')}</p>
        <h1 className={styles.name}>
          Iuri <span>Mundstock</span>
        </h1>
        <p className={styles.role}>{t('hero.role')}</p>
        <p className={styles.lead}>{t('hero.lead')}</p>

        <div className={styles.heroActions}>
          <a className={styles.primaryButton} href="#projetos">
            {t('hero.primary')}
            <ArrowIcon />
          </a>
          <a className={styles.secondaryButton} href="#contato">
            {t('hero.secondary')}
          </a>
        </div>

        <div className={styles.heroSocial}>
          <a href={CONTACT.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            <GitHubIcon />
          </a>
          <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <LinkedInIcon />
          </a>
          <a href={`mailto:${CONTACT.email}`} aria-label="Email">
            <MailIcon />
          </a>
        </div>
      </motion.div>

      <div className={styles.stage} role="img" aria-label={t('hero.sceneAria')}>
        <Suspense fallback={<div className={styles.stageFallback} />}>
          <Scene3D />
        </Suspense>
        <span className={styles.stageHint} aria-hidden="true">{t('hero.sceneHint')}</span>
      </div>
    </section>
  );
}

function About() {
  const { t } = useTranslation();
  const facts = ['role', 'focus', 'study'] as const;

  return (
    <section id="sobre" className={styles.section}>
      <SectionHeading eyebrow={t('about.eyebrow')} title={t('about.title')} />

      <div className={styles.aboutGrid}>
        <motion.div className={styles.aboutText} {...reveal}>
          <p>{t('about.p1')}</p>
          <p>{t('about.p2')}</p>
        </motion.div>

        <motion.dl className={styles.facts} {...reveal}>
          {facts.map((fact) => (
            <div key={fact} className={styles.fact}>
              <dt>{t(`about.facts.${fact}.label`)}</dt>
              <dd>{t(`about.facts.${fact}.value`)}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}

function Education() {
  const { t } = useTranslation();

  return (
    <section id="formacao" className={styles.section}>
      <SectionHeading eyebrow={t('education.eyebrow')} title={t('education.title')} />

      <ol className={styles.timeline}>
        {EDUCATION.map((item, index) => (
          <motion.li
            key={item.key}
            className={styles.timelineItem}
            {...reveal}
            transition={{ ...reveal.transition, delay: index * 0.1 }}
          >
            <span className={`${styles.badge} ${item.current ? styles.badgeLive : ''}`}>
              {item.current ? t('education.current') : t('education.done')}
            </span>
            <h3>{t(`education.items.${item.key}.degree`)}</h3>
            <p>{t(`education.items.${item.key}.school`)}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

function Skills() {
  const { t } = useTranslation();

  return (
    <section id="habilidades" className={styles.section}>
      <SectionHeading eyebrow={t('skills.eyebrow')} title={t('skills.title')} />

      <div className={styles.skillGrid}>
        {SKILL_GROUPS.map((group, index) => (
          <motion.article
            key={group.key}
            className={styles.skillCard}
            {...reveal}
            transition={{ ...reveal.transition, delay: index * 0.08 }}
          >
            <h3>
              <span aria-hidden="true">0{index + 1}</span>
              {t(`skills.groups.${group.key}`)}
            </h3>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  const { t } = useTranslation();

  return (
    <section id="projetos" className={styles.section}>
      <SectionHeading eyebrow={t('projects.eyebrow')} title={t('projects.title')} />

      <div className={styles.projectGrid}>
        {PROJECTS.map((project, index) => (
          <motion.article
            key={project.key}
            className={`${styles.projectCard} ${project.featured ? styles.projectFeatured : ''}`}
            {...reveal}
            transition={{ ...reveal.transition, delay: index * 0.06 }}
            whileHover={{ y: -6 }}
          >
            <div className={styles.projectTop}>
              <span className={styles.projectIcon} aria-hidden="true">
                {project.live ? <GlobeIcon /> : <GitHubIcon />}
              </span>
              {project.featured && <span className={styles.badge}>{t('projects.featured')}</span>}
            </div>

            <h3>{project.name}</h3>
            <p>{t(`projects.items.${project.key}`)}</p>

            <ul className={styles.stack}>
              {project.stack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>

            <div className={styles.projectLinks}>
              {project.live && (
                <a className={styles.liveLink} href={project.live} target="_blank" rel="noreferrer">
                  {t('projects.live')}
                  <ArrowIcon />
                </a>
              )}
              {project.repo && (
                <a className={styles.projectLink} href={project.repo} target="_blank" rel="noreferrer">
                  {t('projects.view')}
                  <ArrowIcon />
                </a>
              )}
            </div>
          </motion.article>
        ))}

        <motion.a className={styles.moreCard} href={CONTACT.github} target="_blank" rel="noreferrer" {...reveal}>
          <GitHubIcon />
          {t('projects.more')}
          <ArrowIcon />
        </motion.a>
      </div>
    </section>
  );
}

function Contact() {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the mailto link next to it still works.
    }
  };

  return (
    <section id="contato" className={styles.section}>
      <motion.div className={styles.contactCard} {...reveal}>
        <span className={styles.eyebrow}>{t('contact.eyebrow')}</span>
        <h2>{t('contact.title')}</h2>
        <p>{t('contact.lead')}</p>

        <div className={styles.emailRow}>
          <a className={styles.email} href={`mailto:${CONTACT.email}`}>
            {CONTACT.email}
          </a>
          <button type="button" className={styles.secondaryButton} onClick={copyEmail} aria-live="polite">
            {copied ? t('contact.copied') : t('contact.copy')}
          </button>
        </div>

        <div className={styles.contactLinks}>
          <a className={styles.primaryButton} href={CONTACT.linkedin} target="_blank" rel="noreferrer">
            <LinkedInIcon />
            LinkedIn
          </a>
          <a className={styles.secondaryButton} href={CONTACT.github} target="_blank" rel="noreferrer">
            <GitHubIcon />
            GitHub
          </a>
        </div>
      </motion.div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Education />
      <Skills />
      <Projects />
      <Contact />
    </>
  );
}
