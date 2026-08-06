import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Container } from '@/components/UI/Container/Container'
import { CtaButton } from '@/components/UI/CtaButton/CtaButton'
import styles from '@/components/UmmaQuestBlock/UmmaQuestBlock.module.scss'

const PROJECT_URL = 'https://app.dalilunfaith.tech/app/'
const VIDEO_SRC = '/UmmaQuestVideo.mov'

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function UmmaQuestBlock() {
  const { t } = useTranslation()
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const phoneFrameRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const lastUiTimeRef = useRef(0)

  const bullets = t('ummaQuestBlock.bullets', {
    returnObjects: true,
  }) as string[]

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const syncDuration = () => {
      const d = video.duration
      if (Number.isFinite(d)) setDuration(d)
    }

    const onTimeUpdate = () => {
      const now = performance.now()
      if (now - lastUiTimeRef.current >= 100) {
        lastUiTimeRef.current = now
        setCurrentTime(video.currentTime)
      }
    }

    const onPlayPause = () => setIsPlaying(!video.paused)

    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('play', onPlayPause)
    video.addEventListener('pause', onPlayPause)
    video.addEventListener('loadedmetadata', syncDuration)
    video.addEventListener('durationchange', syncDuration)

    video.playbackRate = 1.2
    syncDuration()

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('play', onPlayPause)
      video.removeEventListener('pause', onPlayPause)
      video.removeEventListener('loadedmetadata', syncDuration)
      video.removeEventListener('durationchange', syncDuration)
    }
  }, [])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      void video.play().catch(() => {})
    } else {
      video.pause()
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
      const video = videoRef.current
      if (!video || !Number.isFinite(duration)) return
      video.currentTime = value
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
          const video = videoRef.current
          if (!video) return
          void video.play().catch(() => {})
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
    <section ref={sectionRef} id='umma-quest' className={styles.section}>
      <Container>
        <div className={styles.inner}>
          <div className={styles.left}>
            <h2 className={styles.title}>{t('ummaQuestBlock.title')}</h2>
            <p className={styles.lead}>{t('ummaQuestBlock.lead')}</p>
            <p className={styles.description}>
              {t('ummaQuestBlock.description')}
            </p>
            <ul className={styles.bullets}>
              {bullets.map((item) => (
                <li key={item} className={styles.bulletItem}>
                  {item}
                </li>
              ))}
            </ul>
            <CtaButton
              className={styles.cta}
              href={PROJECT_URL}
              target='_blank'
              rel='noopener noreferrer'
            >
              {t('ummaQuestBlock.cta')}
            </CtaButton>
          </div>

          <div className={styles.right}>
            <div
              ref={phoneFrameRef}
              className={styles.phoneFrame}
              data-playing={isPlaying ? '' : undefined}
              onPointerLeave={onPhoneFramePointerLeave}
            >
              <video
                ref={videoRef}
                {...videoProps}
                preload='auto'
                src={VIDEO_SRC}
                className={styles.phoneVideo}
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
