import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Icon } from '@/components/UI/Icon/Icon'
import { useAnchorNavigation } from '@/useAnchorNavigation'
import { ROUTES } from '@/routes'
import styles from '@/components/Footer/Footer.module.scss'

export function Footer() {
  const { t } = useTranslation()
  const goToAnchor = useAnchorNavigation()
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const navLinks = [
    { key: 'nav.about', label: t('nav.about'), anchorId: 'about' },
    { key: 'nav.path', label: t('nav.path'), anchorId: 'path' },
    { key: 'nav.aiMentor', label: t('nav.aiMentor'), anchorId: 'umma-quest' },
    { key: 'nav.vr', label: t('nav.vr'), anchorId: 'vr' },
    { key: 'nav.live', label: t('nav.live'), href: 'https://live.dalilunfaith.tech' },
    { key: 'nav.frames', label: t('nav.frames'), href: 'https://frames.dalilunfaith.tech' },
  ]

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.copyWrap}>
            <span className={styles.copy} dir="ltr">
              © 2026 Dalilun
            </span>
          </div>

          <nav className={styles.nav}>
            {navLinks.map((link) =>
              link.href ? (
                <a
                  key={link.key}
                  href={link.href}
                  className={styles.navLink}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {link.label}
                </a>
              ) : (
                <a
                  key={link.key}
                  href={`#${link.anchorId}`}
                  className={styles.navLink}
                  onClick={(e) => {
                    e.preventDefault()
                    goToAnchor(link.anchorId!)
                  }}
                >
                  {link.label}
                </a>
              ),
            )}
          </nav>

          <div className={styles.scrollBtnWrap}>
            <button type="button" className={styles.scrollBtn} onClick={scrollTop} aria-label={t('footer.scrollUp')}>
              <Icon id="arrow-top" width={14} height={16} />
            </button>
          </div>
        </div>

        <div className={styles.bottom}>
          <Link to={ROUTES.privacyPolicy} className={styles.legalLink}>
            {t('footer.privacy')}
          </Link>
          <Link to={ROUTES.cookiePolicy} className={styles.legalLink}>
            {t('footer.cookies')}
          </Link>
        </div>
      </div>
    </footer>
  )
}
