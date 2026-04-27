import { useEffect, useRef } from 'react'
import ru from '@/locales/ru'
import styles from '@/components/ImmersivePilgrimageBlock/ImmersivePilgrimageBlock.module.scss'

export function ImmersivePilgrimageBlock() {
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
      <h2 className={styles.title}>{ru.immersivePilgrimage.title}</h2>
      <p className={styles.text}>{ru.immersivePilgrimage.text}</p>
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
