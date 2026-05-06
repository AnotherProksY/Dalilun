import { useTranslation } from 'react-i18next'
import { CtaButton } from '@/components/UI/CtaButton/CtaButton'
import styles from '@/components/SimpleCtaBlock/SimpleCtaBlock.module.scss'

export function SimpleCtaBlock() {
  const { t } = useTranslation()

  return (
    <section className={styles.section} data-gap-anchor='simple-cta'>
      <h2 className={styles.title}>{t('simpleCtaBlock.title')}</h2>
      <CtaButton href="#contact-form">{t('simpleCtaBlock.cta')}</CtaButton>
    </section>
  )
}
