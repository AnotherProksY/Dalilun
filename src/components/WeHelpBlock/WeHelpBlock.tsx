import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styles from '@/components/WeHelpBlock/WeHelpBlock.module.scss'
import img1 from '@/assets/images/we-help-1.webp'
import img2 from '@/assets/images/we-help-2.webp'
import img3 from '@/assets/images/we-help-3.webp'
import { ParticleCard, GlobalSpotlight, useMobileDetection } from './MagicBento'

const IMAGES = [img1, img2, img3]
const GLOW_COLOR = '0, 180, 55'

export function WeHelpBlock() {
  const { t } = useTranslation()
  const gridRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobileDetection()

  const cards = t('weHelp.cards', { returnObjects: true }) as Array<{
    tag: string
    title: string
    text: string
  }>

  return (
    <section className={`${styles.section} mb-section`}>
      <GlobalSpotlight
        gridRef={gridRef}
        disableAnimations={isMobile}
        enabled
        spotlightRadius={600}
        glowColor={GLOW_COLOR}
        cardSelector='.mb-card'
        sectionSelector='.mb-section'
      />
      <h2 className={styles.heading}>{t('weHelp.heading')}</h2>
      <div className={styles.grid} ref={gridRef}>
        {cards.map((card, i) => (
          <ParticleCard
            key={card.tag}
            className={`${styles.card} mb-card`}
            disableAnimations={isMobile}
            particleCount={12}
            glowColor={GLOW_COLOR}
            enableTilt={false}
            enableMagnetism={false}
          >
            <div className={styles.imageWrap}>
              <img src={IMAGES[i]} alt={card.tag} className={styles.image} />
              <div className={styles.imageOverlay} />
              <span className={styles.tag}>{card.tag}</span>
            </div>
            <div className={styles.body}>
              <p className={styles.cardTitle}>{card.title}</p>
              <p className={styles.cardText}>{card.text}</p>
            </div>
          </ParticleCard>
        ))}
      </div>
    </section>
  )
}
