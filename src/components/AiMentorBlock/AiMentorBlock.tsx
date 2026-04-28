import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Container } from '@/components/UI/Container/Container'
import styles from '@/components/AiMentorBlock/AiMentorBlock.module.scss'

const FEATURE_ICON_IDS = ['user', 'ai-mentor', 'fact-check']

export function AiMentorBlock() {
  const { t, i18n } = useTranslation()
  const videoRef = useRef<HTMLVideoElement>(null)

  const videoSrc =
    i18n.language === 'ru' ? '/mobile-video.mp4' : '/mobile-video-english.mp4'

  const features = t('aiMentorBlock.features', {
    returnObjects: true,
  }) as Array<{
    title: string
    text: string
  }>

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    el.playbackRate = 1.2
    el.load()
  }, [videoSrc])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play()
        } else {
          el.pause()
        }
      },
      { threshold: 0.5 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.inner}>
          <div className={styles.left}>
            <h2 className={styles.title}>{t('aiMentorBlock.title')}</h2>
            <p className={styles.subtitle}>{t('aiMentorBlock.subtitle')}</p>
            <div className={styles.features}>
              {features.map((feature, i) => (
                <div key={i} className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <svg width='40' height='40' aria-hidden='true'>
                      <use href={`/icons.svg#${FEATURE_ICON_IDS[i]}`} />
                    </svg>
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
            <div className={styles.phoneWrap}>
              <div className={styles.phoneFrame}>
                <video
                  ref={videoRef}
                  className={styles.phoneVideo}
                  src={videoSrc}
                  muted
                  loop
                  playsInline
                  preload='metadata'
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
