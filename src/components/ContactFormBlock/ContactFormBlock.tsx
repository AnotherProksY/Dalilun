import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CtaButton } from '@/components/UI/CtaButton/CtaButton'
import styles from './ContactFormBlock.module.scss'

export function ContactFormBlock() {
  const { t } = useTranslation()

  const goalOptions = t('contactForm.goalOptions', { returnObjects: true }) as string[]

  const [contact, setContact] = useState('')
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!contact || !goal || !consent) return
    setStatus('loading')
    try {
      await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact, name, goal }),
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact-form" className={styles.section}>
      <div className={styles.left}>
        <p className={styles.sideText}>{t('contactForm.sideText')}</p>
      </div>

      <div className={styles.right}>
        <h2 className={styles.title}>{t('contactForm.title')}</h2>
        <p className={styles.formLabel}>{t('contactForm.formLabel')}</p>

        {status === 'success' ? (
          <p className={styles.successMessage}>{t('contactForm.successMessage')}</p>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <input
              className={styles.input}
              type='text'
              placeholder={t('contactForm.contactPlaceholder')}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
            <input
              className={styles.input}
              type='text'
              placeholder={t('contactForm.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className={styles.dropdownWrapper}>
              <button
                type='button'
                className={[styles.input, styles.dropdownTrigger, goal ? styles.dropdownSelected : ''].join(' ')}
                onClick={() => setDropdownOpen((v) => !v)}
              >
                <span>{goal || t('contactForm.goalPlaceholder')}</span>
                <svg
                  className={[styles.dropdownArrow, dropdownOpen ? styles.dropdownArrowOpen : ''].join(' ')}
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                >
                  <path d='M5 7.5L10 12.5L15 7.5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
              </button>

              {dropdownOpen && (
                <ul className={styles.dropdownList}>
                  {goalOptions.map((option) => (
                    <li key={option} className={styles.dropdownItem}>
                      <button
                        type='button'
                        className={[styles.dropdownOption, goal === option ? styles.dropdownOptionActive : ''].join(' ')}
                        onClick={() => {
                          setGoal(option)
                          setDropdownOpen(false)
                        }}
                      >
                        {option}
                        {goal === option && <span className={styles.dot} />}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {status === 'error' && <p className={styles.errorMessage}>{t('contactForm.errorMessage')}</p>}

            <label className={styles.consentLabel}>
              <input
                type='checkbox'
                className={styles.checkbox}
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>
                {t('contactForm.consent')}
                <a href='/privacy' className={styles.consentLink}>
                  {t('contactForm.consentLink')}
                </a>
              </span>
            </label>

            <CtaButton type='submit' className={styles.submitButton} disabled={status === 'loading'}>
              {t('contactForm.submit')}
            </CtaButton>
          </form>
        )}
      </div>
    </section>
  )
}
