import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Galaxy from '@/components/Galaxy/Galaxy'
import { CtaButton } from '@/components/UI/CtaButton/CtaButton'
import styles from '@/components/HeroBlock/HeroBlock.module.scss'

export function HeroBlock() {
  const { t } = useTranslation()
  const galaxyRef = useRef<HTMLDivElement>(null)

  function handleMouseMove(e: React.MouseEvent) {
    galaxyRef.current?.dispatchEvent(
      new MouseEvent('mousemove', { clientX: e.clientX, clientY: e.clientY, bubbles: false }),
    )
  }

  return (
    <section className={styles.hero}>
      <Galaxy
        ref={galaxyRef}
        mouseRepulsion
        mouseInteraction
        density={1}
        glowIntensity={0.3}
        saturation={0}
        hueShift={140}
        twinkleIntensity={0.3}
        rotationSpeed={0.1}
        repulsionStrength={1}
        autoCenterRepulsion={0}
        starSpeed={0.5}
        speed={1}
        centerProximityBoost={5}
      />

      <div className={styles.content}>
        <h1 className={styles.title}>{t('hero.title')}</h1>
        <p className={styles.subtitle}>{t('hero.subtitle')}</p>
        <div onMouseMove={handleMouseMove} style={{ pointerEvents: 'auto' }}>
          <CtaButton href="#contact-form">{t('hero.cta')}</CtaButton>
        </div>
      </div>
    </section>
  )
}
