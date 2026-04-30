import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '@/components/UI/Icon/Icon'
import { scrollToAnchor } from '@/scrollToAnchor'
import styles from '@/components/Footer/Footer.module.scss'

export function Footer() {
  const { t } = useTranslation()
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768)
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const navLinks = [
    { key: 'nav.about', label: t('nav.about'), anchorId: 'about' },
    { key: 'nav.path', label: t('nav.path'), anchorId: 'path' },
    { key: 'nav.aiMentor', label: t('nav.aiMentor'), anchorId: 'ai-mentor' },
    { key: 'nav.vr', label: t('nav.vr'), anchorId: 'vr' },
  ]

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <a href="/" className={styles.logo} aria-label="Dalilun">
            <Icon id="logo" width={isMobile ? 101 : 114} height={isMobile ? 32 : 36} viewBox="0 0 114 36" />
          </a>

          <nav className={styles.nav}>
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={`#${link.anchorId}`}
                className={styles.navLink}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToAnchor(link.anchorId)
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button type="button" className={styles.scrollBtn} onClick={scrollTop} aria-label={t('footer.scrollUp')}>
            <Icon id="arrow-top" width={14} height={16} />
          </button>
        </div>

        <div className={styles.bottom}>
          <span className={styles.copy} dir="ltr">
            © 2026 Dalilun
          </span>
          <div className={styles.legal}>
            <a href="#" className={styles.legalLink}>{t('footer.privacy')}</a>
            <a href="#" className={styles.legalLink}>{t('footer.cookies')}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
