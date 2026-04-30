import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '@/components/UI/Icon/Icon'
import { Container } from '@/components/UI/Container/Container'
import styles from '@/components/AiMentorBlock/AiMentorBlock.module.scss'

const FEATURE_ICON_IDS = ['ai-mentor', 'user', 'fact-check']

export function AiMentorBlock() {
  const { t, i18n } = useTranslation()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 767)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 767)
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const videoSrc =
    i18n.language === 'ru' ? '/output_rus.webm' : '/output_eng.webm'

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
      </Container>
    </section>
  )
}
