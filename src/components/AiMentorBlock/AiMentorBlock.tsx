import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '@/components/UI/Icon/Icon'
import { Container } from '@/components/UI/Container/Container'
import styles from '@/components/AiMentorBlock/AiMentorBlock.module.scss'

const FEATURE_ICON_IDS = ['ai-mentor', 'user', 'fact-check']

const VIDEO_RU = '/output_rus.webm'
const VIDEO_EN = '/output_eng.webm'

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function AiMentorBlock() {
  const { t, i18n } = useTranslation()
  const ruRef = useRef<HTMLVideoElement>(null)
  const enRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const phoneFrameRef = useRef<HTMLDivElement>(null)
  const isRuRef = useRef(i18n.language === 'ru')
  isRuRef.current = i18n.language === 'ru'

  const isRu = i18n.language === 'ru'
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 767 : false,
  )
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  /** Не триггерить React на каждом timeupdate — разгружает главный поток под видео. */
  const lastUiTimeRef = useRef(0)

  const getActive = () => (isRuRef.current ? ruRef.current : enRef.current)
  const getInactive = () => (isRuRef.current ? enRef.current : ruRef.current)

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
    const ru = ruRef.current
    const en = enRef.current
    if (!ru || !en) return

    const syncDurationLocal = () => {
      const a = getActive()
      if (!a) return
      const d = a.duration
      if (Number.isFinite(d)) setDuration(d)
    }

    const onTimeUpdate = () => {
      const a = getActive()
      const i = getInactive()
      if (!a || !i) return
      const now = performance.now()
      if (now - lastUiTimeRef.current >= 100) {
        lastUiTimeRef.current = now
        setCurrentTime(a.currentTime)
      }
      if (Math.abs(i.currentTime - a.currentTime) > 0.05) {
        i.currentTime = a.currentTime
      }
    }

    const onPlayPause = () => {
      const a = getActive()
      if (!a) return
      setIsPlaying(!a.paused)
    }

    ru.addEventListener('timeupdate', onTimeUpdate)
    en.addEventListener('timeupdate', onTimeUpdate)
    ru.addEventListener('play', onPlayPause)
    ru.addEventListener('pause', onPlayPause)
    en.addEventListener('play', onPlayPause)
    en.addEventListener('pause', onPlayPause)
    ru.addEventListener('loadedmetadata', syncDurationLocal)
    en.addEventListener('loadedmetadata', syncDurationLocal)
    ru.addEventListener('durationchange', syncDurationLocal)
    en.addEventListener('durationchange', syncDurationLocal)

    ru.playbackRate = 1.2
    en.playbackRate = 1.2

    syncDurationLocal()

    return () => {
      ru.removeEventListener('timeupdate', onTimeUpdate)
      en.removeEventListener('timeupdate', onTimeUpdate)
      ru.removeEventListener('play', onPlayPause)
      ru.removeEventListener('pause', onPlayPause)
      en.removeEventListener('play', onPlayPause)
      en.removeEventListener('pause', onPlayPause)
      ru.removeEventListener('loadedmetadata', syncDurationLocal)
      en.removeEventListener('loadedmetadata', syncDurationLocal)
      ru.removeEventListener('durationchange', syncDurationLocal)
      en.removeEventListener('durationchange', syncDurationLocal)
    }
  }, [])

  useEffect(() => {
    const ru = ruRef.current
    const en = enRef.current
    if (!ru || !en) return

    const tShared = ru.currentTime
    const wasPlaying = !ru.paused || !en.paused

    ru.pause()
    en.pause()
    ru.currentTime = tShared
    en.currentTime = tShared

    const active = isRu ? ru : en
    setCurrentTime(active.currentTime)
    if (wasPlaying) {
      void active.play().catch(() => {})
    }
  }, [isRu])

  const togglePlay = useCallback(() => {
    const ru = ruRef.current
    const en = enRef.current
    if (!ru || !en) return
    const active = isRuRef.current ? ru : en
    const inactive = isRuRef.current ? en : ru

    inactive.currentTime = active.currentTime
    if (active.paused) {
      inactive.pause()
      void active.play().catch(() => {})
    } else {
      ru.pause()
      en.pause()
    }
  }, [])

  const onPhoneFramePointerLeave = useCallback(() => {
    const root = phoneFrameRef.current
    if (!root) return
    const active = document.activeElement
    if (active instanceof HTMLElement && root.contains(active)) {
      active.blur()
    }
  }, [])

  const onSeek = useCallback(
    (value: number) => {
      const ru = ruRef.current
      const en = enRef.current
      if (!ru || !en || !Number.isFinite(duration)) return
      ru.currentTime = value
      en.currentTime = value
      setCurrentTime(value)
    },
    [duration],
  )

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const active = isRuRef.current ? ruRef.current : enRef.current
          const inactive = isRuRef.current ? enRef.current : ruRef.current
          if (!active || !inactive) return
          inactive.pause()
          void active.play().catch(() => {})
        }
      },
      { threshold: 0.5 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const progressPct =
    duration > 0
      ? Math.min(100, Math.max(0, (currentTime / duration) * 100))
      : 0

  const videoProps = {
    muted: true,
    loop: true,
    playsInline: true,
  } as const

  return (
    <section ref={sectionRef} id='ai-mentor' className={styles.section}>
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
            <div
              ref={phoneFrameRef}
              className={styles.phoneFrame}
              data-playing={isPlaying ? '' : undefined}
              onPointerLeave={onPhoneFramePointerLeave}
            >
              <video
                ref={ruRef}
                {...videoProps}
                preload='auto'
                src={VIDEO_RU}
                className={`${styles.phoneVideo} ${!isRu ? styles.phoneVideoInactive : ''}`}
              />
              <video
                ref={enRef}
                {...videoProps}
                preload='auto'
                src={VIDEO_EN}
                className={`${styles.phoneVideo} ${isRu ? styles.phoneVideoInactive : ''}`}
              />
              <div className={styles.controls}>
                <div className={styles.seekRow} dir='ltr'>
                  <button
                    type='button'
                    className={styles.playBtn}
                    onClick={(e) => {
                      e.stopPropagation()
                      togglePlay()
                    }}
                    aria-label={
                      isPlaying
                        ? t('immersivePilgrimage.pauseVideo')
                        : t('immersivePilgrimage.playVideo')
                    }
                  >
                    {isPlaying ? (
                      <svg
                        width='20'
                        height='20'
                        viewBox='0 0 28 28'
                        fill='none'
                        aria-hidden
                      >
                        <rect
                          x='6'
                          y='5'
                          width='6'
                          height='18'
                          rx='1'
                          fill='currentColor'
                        />
                        <rect
                          x='16'
                          y='5'
                          width='6'
                          height='18'
                          rx='1'
                          fill='currentColor'
                        />
                      </svg>
                    ) : (
                      <svg
                        width='20'
                        height='20'
                        viewBox='0 0 28 28'
                        fill='none'
                        aria-hidden
                      >
                        <path d='M10 6l14 8-14 8V6z' fill='currentColor' />
                      </svg>
                    )}
                  </button>
                  <span className={styles.time}>{formatTime(currentTime)}</span>
                  <input
                    type='range'
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
          </div>
        </div>
      </Container>
    </section>
  )
}
