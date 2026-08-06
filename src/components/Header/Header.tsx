import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '@/components/UI/Icon/Icon'
import { CtaButton } from '@/components/UI/CtaButton/CtaButton'
import { useAnchorNavigation } from '@/useAnchorNavigation'
import styles from '@/components/Header/Header.module.scss'

export function Header() {
  const { t } = useTranslation()
  const goToAnchor = useAnchorNavigation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 780)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 780)
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const navLinks = [
    { key: 'nav.about', label: t('nav.about'), anchorId: 'about' },
    { key: 'nav.path', label: t('nav.path'), anchorId: 'path' },
    { key: 'nav.aiMentor', label: t('nav.aiMentor'), anchorId: 'umma-quest' },
    { key: 'nav.vr', label: t('nav.vr'), anchorId: 'vr' },
    { key: 'nav.live', label: t('nav.live'), href: 'https://live.dalilunfaith.tech' },
    { key: 'nav.frames', label: t('nav.frames'), href: 'https://frames.dalilunfaith.tech' },
  ]

  return (
    <header className={`${styles.root} ${scrolled ? styles.rootScrolled : ''}`}>
      <div className={styles.bar}>
        <a href='/' className={styles.logo} aria-label='Dalilun'>
          <Icon
            id='logo'
            width={isMobile ? 101 : 114}
            height={isMobile ? 32 : 36}
            viewBox='0 0 114 36'
          />
        </a>

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

        <button
          className={styles.burgerButton}
          type='button'
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <Icon
            id={menuOpen ? 'close' : 'burger-menu'}
            width={48}
            height={48}
          />
        </button>
      </div>

      <div
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}
      >
        <div className={styles.mobileMenuBar}>
          <a
            href='/'
            className={styles.logo}
            aria-label='Dalilun'
            onClick={() => setMenuOpen(false)}
          >
            <Icon id='logo' width={101} height={32} viewBox='0 0 114 36' />
          </a>
          <button
            className={styles.burgerButton}
            type='button'
            aria-label='Закрыть меню'
            onClick={() => setMenuOpen(false)}
          >
            <Icon id='close' width={48} height={48} />
          </button>
        </div>

        <nav className={styles.mobileNav}>
          {navLinks.map((link) =>
            link.href ? (
              <a
                key={link.key}
                href={link.href}
                className={styles.mobileNavLink}
                target='_blank'
                rel='noopener noreferrer'
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.key}
                href={`#${link.anchorId}`}
                className={styles.mobileNavLink}
                onClick={(e) => {
                  e.preventDefault()
                  setMenuOpen(false)
                  goToAnchor(link.anchorId!)
                }}
              >
                {link.label}
              </a>
            ),
          )}

          <CtaButton
            className={styles.mobileCtaButton}
            onClick={() => {
              setMenuOpen(false)
              goToAnchor('contact-form')
            }}
          >
            {t('hero.cta')}
          </CtaButton>
        </nav>
      </div>
    </header>
  )
}
