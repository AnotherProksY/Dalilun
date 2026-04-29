import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '@/components/UI/Icon/Icon'
import { CtaButton } from '@/components/UI/CtaButton/CtaButton'
import styles from '@/components/Header/Header.module.scss'

const LANGUAGES = [
  { code: 'ar', label: 'عربي' },
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
]

export function Header() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 780)
  const ref = useRef<HTMLDivElement>(null)

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

  const currentLang =
    LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[2]

  const handleSelect = (code: string) => {
    void i18n.changeLanguage(code)
    setOpen(false)
  }

  const handleMobileSelect = (code: string) => {
    void i18n.changeLanguage(code)
    setOpen(false)
    setMenuOpen(false)
  }

  const navLinks = [
    { key: 'nav.about', label: t('nav.about') },
    { key: 'nav.path', label: t('nav.path') },
    { key: 'nav.aiMentor', label: t('nav.aiMentor') },
    { key: 'nav.vr', label: t('nav.vr') },
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
          {navLinks.map((link) => (
            <a key={link.key} href='#' className={styles.navLink}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.langWrapper} ref={ref}>
          <button
            className={styles.langButton}
            type='button'
            onClick={() => setOpen((v) => !v)}
          >
            {currentLang.label}
            <Icon
              id='chevron'
              width={16}
              height={16}
              className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
            />
          </button>

          {open && (
            <ul className={styles.dropdown}>
              {LANGUAGES.map((l) => (
                <li key={l.code}>
                  <button
                    type='button'
                    className={`${styles.dropdownItem} ${l.code === i18n.language ? styles.dropdownItemActive : ''}`}
                    onClick={() => handleSelect(l.code)}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

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
          {navLinks.map((link) => (
            <a
              key={link.key}
              href='#'
              className={styles.mobileNavLink}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}

          <div className={styles.mobileLangWrapper}>
            <button
              className={styles.mobileLangButton}
              type='button'
              onClick={() => setOpen((v) => !v)}
            >
              {currentLang.label}
              <Icon
                id='chevron'
                width={16}
                height={16}
                className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
              />
            </button>

            <ul
              className={`${styles.mobileDropdown} ${open ? styles.mobileDropdownOpen : ''}`}
            >
              {LANGUAGES.map((l) => (
                <li key={l.code}>
                  <button
                    type='button'
                    className={`${styles.mobileDropdownItem} ${l.code === i18n.language ? styles.dropdownItemActive : ''}`}
                    onClick={() => handleMobileSelect(l.code)}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <CtaButton className={styles.mobileCtaButton} href='#contact-form'>
            {t('hero.cta')}
          </CtaButton>
        </nav>
      </div>
    </header>
  )
}
