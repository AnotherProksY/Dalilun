import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from '@/components/ImmersivePilgrimageBlock/ImmersivePilgrimageBlock.module.scss'

const VIDEO_MOBILE_MQ = '(max-width: 500px)'
const VIDEO_OVERLAY_MQ = '(min-width: 1000px)'
const VIDEO_DESKTOP_SRC = '/Kaaba_Proletka_16_9.mp4'
const VIDEO_MOBILE_SRC = '/Kaaba_Proletka_9_16.mp4'
const VIDEO_PLACEHOLDER_SRC = '/immersive-video-placeholder.webp'
const LOOP_PAUSE_MS = 3000

export function ImmersivePilgrimageBlock() {
  const { t } = useTranslation()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isNarrow, setIsNarrow] = useState(false)
  const [isOverlay, setIsOverlay] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)

  const videoSrc = isNarrow ? VIDEO_MOBILE_SRC : VIDEO_DESKTOP_SRC

  useEffect(() => {
    const mq = window.matchMedia(VIDEO_MOBILE_MQ)
    const sync = () => setIsNarrow(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia(VIDEO_OVERLAY_MQ)
    const sync = () => setIsOverlay(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    setIsVideoReady(false)
  }, [videoSrc])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    void el.play().catch(() => {})
  }, [videoSrc])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    let pauseTimer: ReturnType<typeof setTimeout> | undefined

    const onEnded = () => {
      if (pauseTimer) clearTimeout(pauseTimer)
      pauseTimer = setTimeout(() => {
        el.currentTime = 0
        void el.play().catch(() => {})
      }, LOOP_PAUSE_MS)
    }

    el.addEventListener('ended', onEnded)
    return () => {
      el.removeEventListener('ended', onEnded)
      if (pauseTimer) clearTimeout(pauseTimer)
    }
  }, [videoSrc])

  const textBlock = (
    <div className={styles.textOverlay}>
      <h2 className={styles.title}>{t('immersivePilgrimage.title')}</h2>
      <p className={styles.text}>{t('immersivePilgrimage.text')}</p>
    </div>
  )

  return (
    <section id="vr" className={styles.section}>
      {!isOverlay && textBlock}
      <div className={styles.videoWrap} data-vr-video-align>
        <img
          src={VIDEO_PLACEHOLDER_SRC}
          alt=""
          aria-hidden
          className={`${styles.videoPlaceholder} ${isVideoReady ? styles.videoPlaceholderHidden : ''}`.trim()}
          width={1920}
          height={1080}
          decoding="async"
        />
        <video
          key={videoSrc}
          ref={videoRef}
          className={styles.video}
          src={videoSrc}
          muted
          autoPlay
          playsInline
          preload="auto"
          onLoadedData={() => setIsVideoReady(true)}
        />
        {isOverlay && textBlock}
      </div>
    </section>
  )
}
