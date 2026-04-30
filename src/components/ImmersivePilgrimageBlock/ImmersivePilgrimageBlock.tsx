import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import styles from '@/components/ImmersivePilgrimageBlock/ImmersivePilgrimageBlock.module.scss'

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const VIDEO_MOBILE_MQ = '(max-width: 500px)'
const VIDEO_DESKTOP_SRC = '/Kaaba_Proletka_16_9.mp4'
const VIDEO_MOBILE_SRC = '/Kaaba_Proletka_9_16.mp4'

export function ImmersivePilgrimageBlock() {
  const { t } = useTranslation()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isNarrow, setIsNarrow] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const videoSrc = isNarrow ? VIDEO_MOBILE_SRC : VIDEO_DESKTOP_SRC

  useEffect(() => {
    setCurrentTime(0)
    setDuration(0)
    setIsPlaying(false)
  }, [videoSrc])

  useEffect(() => {
    const mq = window.matchMedia(VIDEO_MOBILE_MQ)
    const sync = () => setIsNarrow(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const syncDuration = useCallback(() => {
    const el = videoRef.current
    if (!el) return
    const d = el.duration
    if (Number.isFinite(d)) setDuration(d)
  }, [])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    const onTimeUpdate = () => setCurrentTime(el.currentTime)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onLoadedMeta = () => syncDuration()

    el.addEventListener('timeupdate', onTimeUpdate)
    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)
    el.addEventListener('loadedmetadata', onLoadedMeta)
    el.addEventListener('durationchange', onLoadedMeta)

    syncDuration()

    return () => {
      el.removeEventListener('timeupdate', onTimeUpdate)
      el.removeEventListener('play', onPlay)
      el.removeEventListener('pause', onPause)
      el.removeEventListener('loadedmetadata', onLoadedMeta)
      el.removeEventListener('durationchange', onLoadedMeta)
    }
  }, [syncDuration, videoSrc])

  const togglePlay = useCallback(() => {
    const el = videoRef.current
    if (!el) return
    if (el.paused) void el.play().catch(() => {})
    else el.pause()
  }, [])

  const onSeek = useCallback((value: number) => {
    const el = videoRef.current
    if (!el || !Number.isFinite(duration)) return
    el.currentTime = value
    setCurrentTime(value)
  }, [duration])

  const progressPct =
    duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0

  return (
    <section id='vr' className={styles.section}>
      <h2 className={styles.title}>{t('immersivePilgrimage.title')}</h2>
      <p className={styles.text}>{t('immersivePilgrimage.text')}</p>
      <div className={styles.videoWrap} data-playing={isPlaying ? '' : undefined}>
        <video
          key={videoSrc}
          ref={videoRef}
          className={styles.video}
          src={videoSrc}
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className={styles.controls}>
          <div className={styles.controlsBackdrop} />
          <div className={styles.controlsInner}>
            <button
              type="button"
              className={styles.playBtn}
              onClick={(e) => {
                e.stopPropagation()
                togglePlay()
              }}
              aria-label={isPlaying ? t('immersivePilgrimage.pauseVideo') : t('immersivePilgrimage.playVideo')}
            >
              {isPlaying ? (
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
                  <rect x="6" y="5" width="6" height="18" rx="1" fill="currentColor" />
                  <rect x="16" y="5" width="6" height="18" rx="1" fill="currentColor" />
                </svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
                  <path d="M10 6l14 8-14 8V6z" fill="currentColor" />
                </svg>
              )}
            </button>
          </div>
          <div className={styles.seekRow} dir="ltr">
            <span className={styles.time}>{formatTime(currentTime)}</span>
            <input
              type="range"
              className={styles.seek}
              style={{ '--progress': `${progressPct}%` } as CSSProperties}
              min={0}
              max={duration || 0}
              step={0.1}
              value={Math.min(currentTime, duration || 0)}
              disabled={!Number.isFinite(duration) || duration <= 0}
              aria-valuetext={`${formatTime(currentTime)} / ${formatTime(duration)}`}
              onChange={(e) => onSeek(Number(e.target.value))}
            />
            <span className={styles.time}>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
