import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '@/components/UI/Icon/Icon'
import styles from '@/components/Header/Header.module.scss'

const LANGUAGES = [
  { code: 'ar', label: 'عربي' },
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
]

export function Header() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[2]

  const handleSelect = (code: string) => {
    void i18n.changeLanguage(code)
    setOpen(false)
  }

  const navLinks = [
    { key: 'nav.about', label: t('nav.about') },
    { key: 'nav.path', label: t('nav.path') },
    { key: 'nav.aiMentor', label: t('nav.aiMentor') },
    { key: 'nav.vr', label: t('nav.vr') },
  ]

  return (
    <header
      className={`${styles.root} ${scrolled ? styles.rootScrolled : ''}`}
    >
      <div className={styles.bar}>
        <a href="/" className={styles.logo} aria-label="Dalilun">
          <Icon id="logo" width={114} height={36} />
        </a>

        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <a key={link.key} href="#" className={styles.navLink}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.langWrapper} ref={ref}>
          <button
            className={styles.langButton}
            type="button"
            onClick={() => setOpen((v) => !v)}
          >
            {currentLang.label}
            <Icon
              id="chevron"
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
                    type="button"
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
      </div>
    </header>
  )
}
