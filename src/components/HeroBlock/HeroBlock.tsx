import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Galaxy from '@/components/Galaxy/Galaxy'
import { CtaButton } from '@/components/UI/CtaButton/CtaButton'
import styles from '@/components/HeroBlock/HeroBlock.module.scss'

/** Сила общего мышиного эффекта на CTA */
const HERO_CTA_GALAXY_BOOST = 4.8
/** Линейное стягивание — широкий радиус */
const HERO_CTA_ATTRACT_WIDE = 0.3
/** Ядро 1/d^pow — плотная «точка» у курсора */
const HERO_CTA_ATTRACT_CLUSTER = 0.12
const HERO_CTA_CLUSTER_SOFT = 0.088
const HERO_CTA_CLUSTER_POW = 1.38

export function HeroBlock() {
  const { t } = useTranslation()
  const galaxyRef = useRef<HTMLDivElement>(null)
  const galaxyInteractionBoostRef = useRef(1)
  const galaxyAttractionRef = useRef(0)

  function handleMouseMove(e: React.MouseEvent) {
    galaxyRef.current?.dispatchEvent(
      new MouseEvent('mousemove', {
        clientX: e.clientX,
        clientY: e.clientY,
        bubbles: false,
      }),
    )
  }

  return (
    <section id='about' className={styles.hero}>
      <Galaxy
        ref={galaxyRef}
        interactionBoostRef={galaxyInteractionBoostRef}
        interactionAttractionRef={galaxyAttractionRef}
        mouseScreenAttractStrength={HERO_CTA_ATTRACT_WIDE}
        mouseAttractClusterStrength={HERO_CTA_ATTRACT_CLUSTER}
        mouseAttractClusterSoft={HERO_CTA_CLUSTER_SOFT}
        mouseAttractClusterPow={HERO_CTA_CLUSTER_POW}
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
        centerProximityBoost={0}
      />

      <div className={styles.content}>
        <h1 className={styles.title}>{t('hero.title')}</h1>
        <p className={styles.subtitle}>{t('hero.subtitle')}</p>
        <div
          onMouseMove={handleMouseMove}
          onMouseEnter={() => {
            galaxyInteractionBoostRef.current = HERO_CTA_GALAXY_BOOST
            galaxyAttractionRef.current = 1
          }}
          onMouseLeave={() => {
            galaxyInteractionBoostRef.current = 1
            galaxyAttractionRef.current = 0
          }}
          style={{ pointerEvents: 'auto' }}
        >
          <CtaButton href='#contact-form'>{t('hero.cta')}</CtaButton>
        </div>
      </div>
    </section>
  )
}
