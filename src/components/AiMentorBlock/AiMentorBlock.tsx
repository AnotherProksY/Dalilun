import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '@/components/UI/Icon/Icon'
import { Container } from '@/components/UI/Container/Container'
import styles from '@/components/AiMentorBlock/AiMentorBlock.module.scss'

const FEATURE_ICON_IDS = ['ai-mentor', 'user', 'fact-check']

const VIDEO_RU = '/output_rus.webm'
const VIDEO_EN = '/output_eng.webm'

export function AiMentorBlock() {
  const { t, i18n } = useTranslation()
  const frameRef = useRef<HTMLDivElement>(null)
  const ruRef = useRef<HTMLVideoElement>(null)
  const enRef = useRef<HTMLVideoElement>(null)
  const inViewRef = useRef(false)
  const isRuRef = useRef(i18n.language === 'ru')
  isRuRef.current = i18n.language === 'ru'

  const isRu = i18n.language === 'ru'
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 767)

  const syncPlaybackRef = useRef<() => void>(() => {})

  syncPlaybackRef.current = () => {
    const ru = ruRef.current
    const en = enRef.current
    if (!ru || !en) return
    ru.playbackRate = 1.2
    en.playbackRate = 1.2
    if (!inViewRef.current) {
      ru.pause()
      en.pause()
      return
    }
    if (isRuRef.current) {
      en.pause()
      void ru.play().catch(() => {})
    } else {
      ru.pause()
      void en.play().catch(() => {})
    }
  }

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 767)
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const features = t('aiMentorBlock.features', {
    returnObjects: true,
  }) as Array<{
    title: string
    text: string
  }>

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting
        syncPlaybackRef.current()
      },
      { threshold: 0.5 },
    )

    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    syncPlaybackRef.current()
  }, [i18n.language])

  const videoProps = {
    muted: true,
    loop: true,
    playsInline: true,
    preload: 'auto' as const,
  }

  return (
    <section id='ai-mentor' className={styles.section}>
      <Container>
        <div className={styles.inner}>
          <div className={styles.left}>
            <h2 className={styles.title}>{t('aiMentorBlock.title')}</h2>
            <p className={styles.subtitle}>{t('aiMentorBlock.subtitle')}</p>
            <div className={styles.features}>
              {features.map((feature, i) => (
                <div key={i} className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <Icon
                      id={FEATURE_ICON_IDS[i]}
                      width={isMobile ? 28 : 40}
                      height={isMobile ? 28 : 40}
                      viewBox='0 0 40 40'
                    />
                  </div>
                  <div className={styles.featureText}>
                    <p className={styles.featureTitle}>{feature.title}</p>
                    <p className={styles.featureDesc}>{feature.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.right}>
            <div ref={frameRef} className={styles.phoneFrame}>
              <video
                ref={ruRef}
                {...videoProps}
                src={VIDEO_RU}
                className={`${styles.phoneVideo} ${!isRu ? styles.phoneVideoInactive : ''}`}
              />
              <video
                ref={enRef}
                {...videoProps}
                src={VIDEO_EN}
                className={`${styles.phoneVideo} ${isRu ? styles.phoneVideoInactive : ''}`}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
