import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from '@/components/JourneyBlock/JourneyBlock.module.scss'
import { Container } from '@/components/UI/Container/Container'

gsap.registerPlugin(ScrollTrigger)

const DOT_POSITIONS: [number, number][] = [
  [9, 18],
  [9, 77],
  [46, 93],
  [100, 7],
  [92, 62],
]

/** RTL: путь читается справа налево — те же шаги 1→5 привязаны к узлам как на макете ar */
const DOT_POSITIONS_AR: [number, number][] = [
  [92, 103],
  [92, 44],
  [62, 7],
  [11, 93],
  [10, 38],
]

const LABEL_TEXT_WIDTHS: number[] = [279, 313, 284, 354, 330]

const LABEL_TEXT_WIDTHS_AR: number[] = [250, 250, 244, 240, 210]

// Позиция текста относительно цифры. DOT_POSITIONS — координаты центра кружка.
const LABEL_TEXT_POSITION: ('left' | 'right' | 'top' | 'bottom')[] = [
  'left',
  'left',
  'bottom',
  'top',
  'right',
]

const LABEL_TEXT_POSITION_AR: ('left' | 'right' | 'top' | 'bottom')[] = [
  'left',
  'left',
  'top',
  'bottom',
  'right',
]

/** При уменьшенном layout.s (масштаб): пункты 1, 2, 5 — как на втором макете */
const LABEL_TEXT_POSITION_AR_SCALED: ('left' | 'right' | 'top' | 'bottom')[] = [
  'right',
  'right',
  'top',
  'bottom',
  'left',
]

const MOBILE_STEP_TOP_PCTS: number[] = [
  (46 / 675) * 100,
  (216 / 675) * 100,
  (383 / 675) * 100,
  (551 / 675) * 100,
  (726 / 675) * 100,
]

const UN_STROKE_START = 23
const UN_STROKE_END = 6

const UN_TRANSLATE_X_PX = -245
const UN_TRANSLATE_Y_PX = -120

const JB_PAD_INLINE = 32

const JB_DESIGN_HEIGHT = 900

const JB_TITLE_STAGE_GAP_BASE = 260

/** 0 = gap как s; больше — при мелком масштабе gap режется слабее (доля базы при s→0) */
const JB_TITLE_GAP_SCALE_FLOOR = 0.5

/**
 * На узких/низких вьюпортах блок вписывается через scale(s).
 * 1 — полная подгонка в доступную область. Меньше — слабее сжатие (ближе к 1).
 */
const JB_LAYOUT_SCALE_INTENSITY = 0.63

/** Не опускать layout.s ниже этого — меньше «ломает» картинку на низких экранах */
const JB_LAYOUT_SCALE_MIN = 0.2

const JB_LAYOUT_SCALED_THRESHOLD = 0.999

function titleStageGapPx(s: number): number {
  const t = JB_TITLE_GAP_SCALE_FLOOR + (1 - JB_TITLE_GAP_SCALE_FLOOR) * s
  return JB_TITLE_STAGE_GAP_BASE * t
}

export function JourneyBlock() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language.startsWith('ar')
  const dotPositions = isAr ? DOT_POSITIONS_AR : DOT_POSITIONS
  const labelTextWidths = isAr ? LABEL_TEXT_WIDTHS_AR : LABEL_TEXT_WIDTHS
  const [layout, setLayout] = useState<{
    w: number
    h: number
    s: number
  } | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const pinDesktopTitleRef = useRef<HTMLDivElement>(null)
  const blockContentRef = useRef<HTMLDivElement>(null)
  const logoScaleGroupRef = useRef<SVGGElement>(null)
  const pathDIconRef = useRef<SVGPathElement>(null)
  const pathMoonRef = useRef<SVGPathElement>(null)
  const pathDLetterRef = useRef<SVGPathElement>(null)
  const pathLTallRef = useRef<SVGPathElement>(null)
  const pathUnLogoRef = useRef<SVGPathElement>(null)
  const pathL2Ref = useRef<SVGPathElement>(null)
  const pathIRef = useRef<SVGPathElement>(null)
  const pathDotRef = useRef<SVGPathElement>(null)
  const labelsRef = useRef<(HTMLDivElement | null)[]>([])

  const isArScaledLayout =
    isAr &&
    layout != null &&
    layout.s < JB_LAYOUT_SCALED_THRESHOLD
  const labelTextPosition = isAr
    ? isArScaledLayout
      ? LABEL_TEXT_POSITION_AR_SCALED
      : LABEL_TEXT_POSITION_AR
    : LABEL_TEXT_POSITION

  const steps = t('journey.steps', { returnObjects: true }) as Array<{
    title: string
    text: string
  }>

  useLayoutEffect(() => {
    const pin = pinRef.current
    const block = blockContentRef.current
    if (!pin || !block) return

    let raf = 0
    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const w = block.offsetWidth
        const h = block.offsetHeight
        if (w < 1 || h < 1) return

        const pinStyle = getComputedStyle(pin)
        const padTop = parseFloat(pinStyle.paddingTop) || 0
        const padBottom = parseFloat(pinStyle.paddingBottom) || 0
        const titleH =
          pinDesktopTitleRef.current?.getBoundingClientRect().height ?? 0
        let availH = pin.clientHeight - padTop - padBottom - titleH
        const availW = Math.max(0, pin.clientWidth - JB_PAD_INLINE * 2)

        const hForFit = Math.max(h, JB_DESIGN_HEIGHT)
        const k = Math.max(0, JB_LAYOUT_SCALE_INTENSITY)

        const fitScale = (availHeight: number) => {
          const fitS = Math.min(1, availW / w, availHeight / hForFit)
          return Math.max(JB_LAYOUT_SCALE_MIN, 1 - (1 - fitS) * k)
        }

        let clamped = fitScale(availH)
        const gapVis = clamped * titleStageGapPx(clamped)
        availH = pin.clientHeight - padTop - padBottom - titleH - gapVis
        clamped = fitScale(availH)

        setLayout((prev) => {
          if (
            prev &&
            Math.abs(prev.w - w) < 1 &&
            Math.abs(prev.h - hForFit) < 1 &&
            Math.abs(prev.s - clamped) < 0.004
          ) {
            return prev
          }
          return { w, h: hForFit, s: clamped }
        })
      })
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(pin)
    ro.observe(block)
    const titleEl = pinDesktopTitleRef.current
    if (titleEl) ro.observe(titleEl)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
      cancelAnimationFrame(raf)
    }
  }, [i18n.language])

  useEffect(() => {
    ScrollTrigger.refresh()
  }, [layout?.s, layout?.w, layout?.h])

  useEffect(() => {
    const path = sectionRef.current
    if (!path) return
  }, [layout?.s, layout?.w, layout?.h])

  useEffect(() => {
    const section = sectionRef.current
    const pin = pinRef.current
    const logoScaleGroup = logoScaleGroupRef.current
    const pathUnLogo = pathUnLogoRef.current
    const labels = labelsRef.current.filter(Boolean) as HTMLDivElement[]

    if (!section || !pin || !logoScaleGroup || !pathUnLogo) return

    const setHeight = () => {
      section.style.height = `${window.innerHeight * 1.8}px`
      ScrollTrigger.refresh()
    }
    setHeight()
    window.addEventListener('resize', setHeight)

    const fadeOutPaths = [
      pathDIconRef.current,
      pathMoonRef.current,
      pathDLetterRef.current,
      pathLTallRef.current,
      pathL2Ref.current,
      pathIRef.current,
      pathDotRef.current,
    ].filter(Boolean)

    gsap.set(logoScaleGroup, {
      transformOrigin: '85.5% 46.5%',
      force3D: false,
    })
    gsap.set(labels, { opacity: 0 })
    gsap.set(pathUnLogo, { attr: { 'stroke-width': UN_STROKE_START } })

    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'journey-path',
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        pin: pin,
        pinSpacing: false,
      },
    })

    // Фаза 1 (0–40%): увеличиваем логотип и сдвигаем к центру, скрываем все буквы кроме "un"
    tl.to(
      logoScaleGroup,
      {
        scale: 3.4,
        x: UN_TRANSLATE_X_PX,
        y: UN_TRANSLATE_Y_PX,
        ease: 'none',
        duration: 0.4,
        force3D: false,
      },
      0,
    )
    tl.to(fadeOutPaths, { opacity: 0, ease: 'none', duration: 0.35 }, 0)

    // Фаза 2 (40–70%): обводка pathUnLogoRef плавно утончается
    tl.to(
      pathUnLogo,
      {
        attr: { 'stroke-width': UN_STROKE_END },
        ease: 'none',
        duration: 0.28,
      },
      0.4,
    )

    // Фаза 3 (72%): все подписи шагов появляются
    tl.to(labels, { opacity: 1, ease: 'none', duration: 0.28 }, 0.72)

    return () => {
      window.removeEventListener('resize', setHeight)
      ScrollTrigger.getAll().forEach((st) => st.kill())
      tl.kill()
    }
  }, [])

  return (
    <>
      <section id='path' ref={sectionRef} className={styles.section}>
        <div ref={pinRef} className={styles.pin}>
          <div ref={pinDesktopTitleRef} className={styles.pinDesktopTitle}>
            <Container>
              <div
                className={styles.pinDesktopTitleInset}
                dir={isAr ? 'rtl' : undefined}
              >
                <h2 className={styles.title}>{t('journey.title')}</h2>
              </div>
            </Container>
          </div>
          <div
            className={styles.pinBlockOuter}
            style={
              layout
                ? {
                    width: layout.w * layout.s,
                    height: layout.h * layout.s,
                    marginTop: `${layout.s * titleStageGapPx(layout.s)}px`,
                  }
                : { width: '100%' }
            }
          >
            <div
              ref={blockContentRef}
              className={styles.pinBlockInner}
              style={
                layout
                  ? {
                      width: layout.w,
                      transform: `scale(${layout.s})`,
                    }
                  : { width: '100%' }
              }
            >
              <div className={styles.stage}>
                {/* Логотип SVG — все буквы скрываются при скролле */}
                <svg
                  className={styles.logoSvg}
                  width='631'
                  height='200'
                  viewBox='0 0 631 200'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  aria-hidden='true'
                  shapeRendering='geometricPrecision'
                  overflow='visible'
                >
                  <g ref={logoScaleGroupRef}>
                    <mask
                      id='jb-mask'
                      style={{ maskType: 'luminance' } as React.CSSProperties}
                      maskUnits='userSpaceOnUse'
                      x='0'
                      y='0'
                      width='631'
                      height='200'
                    >
                      <path d='M631 0H0V200H631V0Z' fill='white' />
                    </mask>
                    <g mask='url(#jb-mask)'>
                      {/* "un" — stroke-версия, скрывается при появлении обводочной */}
                      <path
                        ref={pathUnLogoRef}
                        d='M461 76V140.553C461 194.105 538.505 193.237 538.505 140.553V129.697M538.505 129.697V76.0001M538.505 129.697C551.124 66.0132 618 74.4079 618 121.744V186'
                        stroke='white'
                        strokeWidth='23'
                      />
                      <path
                        ref={pathDIconRef}
                        d='M265.135 170.988C265.135 169.347 264.996 170.065 264.748 170.494C264.243 171.342 263.61 172.114 262.943 172.843C235.525 202.208 187.844 188.823 175.778 151.222C161.027 105.255 195.676 64.6072 236.911 73.2086C246.795 75.2785 255.863 80.1905 263.341 86.9794L265.146 88.6203V74.1095H288.847V185.97H265.146V170.998L265.135 170.988ZM208.16 158.611C225.351 174.387 253.07 168.167 261.966 146.503C272.591 120.634 255.541 89.3925 225.866 93.3071C195.633 97.286 187.35 139.521 208.16 158.611Z'
                        fill='white'
                      />
                      <path
                        ref={pathMoonRef}
                        d='M76.6757 40.9941L63.379 46.4963C-1.21756 82.0686 33.976 181.247 106.518 169.347C127.718 165.87 150.001 150.014 156.885 129.104C157.293 127.867 157.507 128.027 157.421 129.178C155.32 157.894 134.281 184.179 107.88 194.426C48.5381 217.459 -11.3295 165.593 1.83855 103.427C9.34479 68.0039 40.6565 42.295 76.6757 40.9941Z'
                        fill='#FBBA0E'
                      />
                      <path
                        ref={pathDLetterRef}
                        d='M156.202 113.314C154.608 130.051 139.739 145.963 125.201 152.795C126.271 150.439 127.758 148.34 128.838 145.953C140.391 120.285 122.869 88.5031 93.2486 94.1249C70.1212 98.5153 61.9165 126.249 70.5919 146.242C70.2603 146.574 67.3293 144.079 66.88 143.682C58.472 136.251 51.5295 125.404 48.6092 114.47C48.1706 112.832 46.9725 108.206 47.1222 106.814C47.2506 105.658 50.2779 99.661 51.0695 98.269C56.6428 88.3853 65.115 81.1787 74.8173 76.9918C93.8477 68.7572 116.023 73.2654 130.967 87.6465L132.133 88.7708V21.2664L156.202 0V113.314Z'
                        fill='white'
                      />
                      <path
                        ref={pathLTallRef}
                        d='M426.452 33.541H402.898V186.336H426.452V33.541Z'
                        fill='white'
                      />
                      <path
                        ref={pathL2Ref}
                        d='M334.714 33.541H311.16V186.336H334.714V33.541Z'
                        fill='white'
                      />
                      <path
                        ref={pathIRef}
                        d='M380.583 74.5332H357.029V186.334H380.583V74.5332Z'
                        fill='white'
                      />
                      <path
                        ref={pathDotRef}
                        d='M369.427 60.8703C377.638 60.8703 384.303 54.1948 384.303 45.9635C384.303 37.7321 377.648 31.0566 369.427 31.0566C361.206 31.0566 354.551 37.7321 354.551 45.9635C354.551 54.1948 361.206 60.8703 369.427 60.8703Z'
                        fill='white'
                      />
                    </g>
                  </g>
                </svg>

                {/* Подписи шагов — появляются в фазе 3 */}
                {dotPositions.map(([left, top], i) => (
                  <div
                    key={i}
                    ref={(el) => {
                      labelsRef.current[i] = el
                    }}
                    className={`${styles.label} ${styles[`textPos${labelTextPosition[i].charAt(0).toUpperCase() + labelTextPosition[i].slice(1)}`]}${isAr ? ` ${styles.labelAr}` : ''}`}
                    style={{ left: `${left}%`, top: `${top}%` }}
                  >
                    {labelTextPosition[i] === 'top' && (
                      <>
                        <div
                          className={styles.stepTextWrap}
                          style={{ width: labelTextWidths[i] }}
                        >
                          <p className={styles.stepTitle}>{steps[i].title}</p>
                          <p className={styles.stepText}>{steps[i].text}</p>
                        </div>
                        <span className={styles.stepNum}>{i + 1}</span>
                      </>
                    )}
                    {labelTextPosition[i] === 'bottom' && (
                      <>
                        <span className={styles.stepNum}>{i + 1}</span>
                        <div
                          className={styles.stepTextWrap}
                          style={{ width: labelTextWidths[i] }}
                        >
                          <p className={styles.stepTitle}>{steps[i].title}</p>
                          <p className={styles.stepText}>{steps[i].text}</p>
                        </div>
                      </>
                    )}
                    {labelTextPosition[i] === 'left' && (
                      <>
                        <div
                          className={styles.stepTextWrap}
                          style={{ width: labelTextWidths[i] }}
                        >
                          <p className={styles.stepTitle}>{steps[i].title}</p>
                          <p className={styles.stepText}>{steps[i].text}</p>
                        </div>
                        <span className={styles.stepNum}>{i + 1}</span>
                      </>
                    )}
                    {labelTextPosition[i] === 'right' && (
                      <>
                        <span className={styles.stepNum}>{i + 1}</span>
                        <div
                          className={styles.stepTextWrap}
                          style={{ width: labelTextWidths[i] }}
                        >
                          <p className={styles.stepTitle}>{steps[i].title}</p>
                          <p className={styles.stepText}>{steps[i].text}</p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Мобильная версия — до 1300px */}
      <section className={styles.sectionMobile} data-journey-mobile>
        <Container>
          <h2 className={styles.title}>{t('journey.title')}</h2>
        </Container>
        <div className={styles.mobileStage}>
          {/* SVG-линия как фоновый слой */}
          <svg
            className={styles.mobileLineSvg}
            viewBox='0 0 375 675'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            preserveAspectRatio='none'
            aria-hidden='true'
          >
            <path
              d='M0 1.5H343.498C356.752 1.5 367.498 12.2452 367.498 25.5V135.775C367.498 149.03 356.752 159.775 343.498 159.775H31.5561C18.3013 159.775 7.5561 170.521 7.5561 183.775V314.618C7.5561 327.873 18.3013 338.618 31.5561 338.618H343.498C356.752 338.618 367.498 349.363 367.498 362.618V471.552C367.498 484.807 356.752 495.552 343.498 495.552H31.5561C18.3013 495.552 7.5561 506.297 7.5561 519.552V649.5C7.5561 662.755 18.3013 673.5 31.5561 673.5H375'
              stroke='#4A4A4A'
              strokeWidth='3'
            />
          </svg>

          {/* Шаги с кружками — все по левому краю, top в % от viewBox */}
          {MOBILE_STEP_TOP_PCTS.map((topPct, i) => (
            <div
              key={i}
              className={styles.mobileStepRow}
              style={{ top: `${topPct}%` }}
            >
              <span className={styles.stepNumMobile}>{i + 1}</span>
              <div className={styles.mobileStepText}>
                <p className={styles.stepTitle}>{steps[i].title}</p>
                <p className={styles.stepText}>{steps[i].text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
