import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styles from '@/components/ImmersivePilgrimageBlock/ImmersivePilgrimageBlock.module.scss'

export function ImmersivePilgrimageBlock() {
  const { t } = useTranslation()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    let timer: ReturnType<typeof setTimeout> | null = null

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => {
            el.play()
          }, 1000)
        } else {
          if (timer) {
            clearTimeout(timer)
            timer = null
          }
          el.pause()
        }
      },
      { threshold: 0.7 },
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      if (timer) clearTimeout(timer)
    }
  }, [])

  return (
    <section id='vr' className={styles.section}>
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
          preload="auto"
        />
      </div>
    </section>
  )
}
