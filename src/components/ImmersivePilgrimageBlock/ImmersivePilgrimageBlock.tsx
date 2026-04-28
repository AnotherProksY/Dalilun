import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styles from '@/components/ImmersivePilgrimageBlock/ImmersivePilgrimageBlock.module.scss'

export function ImmersivePilgrimageBlock() {
  const { t } = useTranslation()
  const videoRef = useRef<HTMLVideoElement>(null)

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
      { threshold: 1 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{t('immersivePilgrimage.title')}</h2>
      <p className={styles.text}>{t('immersivePilgrimage.text')}</p>
      <div className={styles.videoWrap}>
        <video
          ref={videoRef}
          className={styles.video}
          src="/Saudi_Train_Station.mp4"
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
    </section>
  )
}
