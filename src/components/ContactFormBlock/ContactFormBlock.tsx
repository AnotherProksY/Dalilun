import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CtaButton } from '@/components/UI/CtaButton/CtaButton'
import { Icon } from '@/components/UI/Icon/Icon'
import styles from './ContactFormBlock.module.scss'

function isValidContact(value: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const telegramRegex = /^@\w{4,}$/
  return emailRegex.test(value) || telegramRegex.test(value)
}

export function ContactFormBlock() {
  const { t } = useTranslation()

  const goalOptions = t('contactForm.goalOptions', { returnObjects: true }) as string[]

  const [contact, setContact] = useState('')
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const [contactTouched, setContactTouched] = useState(false)
  const [nameTouched, setNameTouched] = useState(false)
  const [goalTouched, setGoalTouched] = useState(false)

  const contactError = !contact
    ? t('contactForm.validationContact')
    : !isValidContact(contact)
      ? t('contactForm.validationContactFormat')
      : null

  const nameError = name && !/^[\p{L}\s-]+$/u.test(name) ? t('contactForm.validationContactFormat') : null

  const goalError = !goal ? t('contactForm.validationGoal') : null

  const isFormValid = !contactError && !goalError && consent

  function resetForm() {
    setContact('')
    setName('')
    setGoal('')
    setDropdownOpen(false)
    setConsent(false)
    setContactTouched(false)
    setNameTouched(false)
    setGoalTouched(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setContactTouched(true)
    setGoalTouched(true)
    if (!isFormValid) return
    setStatus('loading')
    try {
      await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact, name, goal }),
      })
      resetForm()
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

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.fieldWrapper}>
            <input
              className={[styles.input, contactTouched && contactError ? styles.inputError : ''].join(' ')}
              type='text'
              placeholder={t('contactForm.contactPlaceholder')}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              onBlur={() => setContactTouched(true)}
              required
            />
            {contactTouched && contactError && (
              <p className={styles.fieldError}>{contactError}</p>
            )}
          </div>

          <div className={styles.fieldWrapper}>
            <input
              className={[styles.input, nameTouched && nameError ? styles.inputError : ''].join(' ')}
              type='text'
              placeholder={t('contactForm.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setNameTouched(true)}
            />
            {nameTouched && nameError && (
              <p className={styles.fieldError}>{nameError}</p>
            )}
          </div>

          <div className={styles.fieldWrapper}>
            <div className={styles.dropdownWrapper}>
              <button
                type='button'
                className={[
                  styles.input,
                  styles.dropdownTrigger,
                  goal ? styles.dropdownSelected : '',
                  goalTouched && goalError ? styles.inputError : '',
                ].join(' ')}
                onClick={() => setDropdownOpen((v) => !v)}
                onBlur={() => setGoalTouched(true)}
              >
                <span>{goal || t('contactForm.goalPlaceholder')}</span>
                <Icon
                  id='chevron'
                  width={16}
                  height={16}
                  className={[styles.dropdownArrow, dropdownOpen ? styles.dropdownArrowOpen : ''].join(' ')}
                />
              </button>

              <div className={[styles.dropdownList, dropdownOpen ? styles.dropdownListOpen : ''].join(' ')}>
                <ul className={styles.dropdownListInner}>
                  {goalOptions.map((option) => (
                    <li key={option} className={styles.dropdownItem}>
                      <button
                        type='button'
                        className={[styles.dropdownOption, goal === option ? styles.dropdownOptionActive : ''].join(' ')}
                        onClick={() => {
                          setGoal(option)
                          setGoalTouched(true)
                          setDropdownOpen(false)
                        }}
                      >
                        {option}
                        {goal === option && <span className={styles.dot} />}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {goalTouched && goalError && (
              <p className={styles.fieldError}>{goalError}</p>
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
              <a href='#' className={styles.consentLink}>
                {t('contactForm.consentLink')}
              </a>
            </span>
          </label>

          <CtaButton type='submit' className={styles.submitButton} disabled={status === 'loading' || !isFormValid}>
            {t('contactForm.submit')}
          </CtaButton>
        </form>

        {status === 'success' && (
          <div className={styles.overlay} onClick={() => setStatus('idle')}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <p className={styles.modalTitle}>{t('contactForm.successTitle')}</p>
              <p className={styles.modalSubtitle}>{t('contactForm.successSubtitle')}</p>
              <CtaButton className={styles.modalButton} onClick={() => setStatus('idle')}>{t('contactForm.successButton')}</CtaButton>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
