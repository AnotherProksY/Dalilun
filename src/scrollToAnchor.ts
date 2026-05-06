import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(ScrollToPlugin)

const JOURNEY_SCROLL_TRIGGER_ID = 'journey-path'
const DESKTOP_JOURNEY_MQ = '(min-width: 1301px)'
const VR_VIDEO_OVERLAY_MQ = '(min-width: 1000px)'

const VR_SCROLL_OFFSET_TOP_PX = 100
const SECTION_HEADER_SCROLL_OFFSET_TOP_PX = 110
const ANCHOR_IDS_WITH_HEADER_OFFSET = new Set(['about', 'ai-mentor'])

/** px/s: участок до начала scrub JourneyBlock (совпадает с start: 'top top') */
const JOURNEY_APPROACH_PX_PER_SEC = 3200
/** px/s: проход по зоне анимации JourneyBlock (pin + scrub) — ниже = заметнее замедление */
const JOURNEY_ANIM_PX_PER_SEC = 850

const JOURNEY_PHASE_DUR_MIN = 0.18
const JOURNEY_PHASE_DUR_MAX = 2.6

/** Доля длительности (0–1) вокруг стыка скоростей — сглаживание без полной остановки */
const JOURNEY_SPEED_JOIN_SMOOTH = 0.09

function phaseScrollDuration(distPx: number, pxPerSec: number): number {
  const sec = distPx / pxPerSec
  return Math.min(
    JOURNEY_PHASE_DUR_MAX,
    Math.max(JOURNEY_PHASE_DUR_MIN, sec),
  )
}

/** Доля пути до scrub (0–1), ta — доля времени на неё; плавное сшивание производной около ta */
function journeyScrollProgress(
  u: number,
  pSplit: number,
  ta: number,
): number {
  if (u <= 0) return 0
  if (u >= 1) return 1
  if (pSplit <= 0 || ta <= 0) return u
  if (pSplit >= 1 || ta >= 1) return u

  const frL = (x: number) => (x / ta) * pSplit
  const frR = (x: number) =>
    pSplit + ((x - ta) / (1 - ta)) * (1 - pSplit)

  const half = Math.min(
    JOURNEY_SPEED_JOIN_SMOOTH * 0.5,
    ta * 0.45,
    (1 - ta) * 0.45,
  )
  const lo = ta - half
  const hi = ta + half
  if (half < 1e-4 || lo <= 0 || hi >= 1) {
    if (u <= ta) return frL(u)
    return frR(u)
  }
  if (u <= lo) return frL(u)
  if (u >= hi) return frR(u)
  const s = (u - lo) / (hi - lo)
  const w = s * s * (3 - 2 * s)
  return (1 - w) * frL(u) + w * frR(u)
}

/** Один непрерывный скролл: быстрее до yPhase2Start, плавно ниже скорость до yTo */
function scrollWindowJourneyBlend(
  yFrom: number,
  yTo: number,
  yPhase2Start: number,
) {
  const totalDist = yTo - yFrom
  if (totalDist <= 0) {
    gsap.to(window, {
      duration: 0.85,
      scrollTo: yTo,
      ease: 'power2.out',
    })
    return
  }
  const d1 = Math.max(0, yPhase2Start - yFrom)
  const d2 = Math.max(0, yTo - yPhase2Start)
  if (d1 === 0) {
    const T = phaseScrollDuration(d2, JOURNEY_ANIM_PX_PER_SEC)
    const o = { u: 0 }
    gsap.to(o, {
      u: 1,
      duration: T,
      ease: 'power2.out',
      onUpdate: () => {
        window.scrollTo(0, yFrom + d2 * o.u)
      },
    })
    return
  }
  const T1 = phaseScrollDuration(d1, JOURNEY_APPROACH_PX_PER_SEC)
  const T2 = phaseScrollDuration(d2, JOURNEY_ANIM_PX_PER_SEC)
  const Ta = T1 / (T1 + T2)
  const pSplit = d1 / (d1 + d2)
  const o = { u: 0 }
  gsap.to(o, {
    u: 1,
    duration: T1 + T2,
    ease: 'none',
    onUpdate: () => {
      const fr = journeyScrollProgress(o.u, pSplit, Ta)
      window.scrollTo(0, yFrom + totalDist * fr)
    },
  })
}

function scrollToPath() {
  const desktop = window.matchMedia(DESKTOP_JOURNEY_MQ).matches
  ScrollTrigger.refresh()
  gsap.killTweensOf(window)

  if (desktop) {
    const st = ScrollTrigger.getById(JOURNEY_SCROLL_TRIGGER_ID)
    if (st && st.end > st.start) {
      const y = window.scrollY
      const yStart = st.start
      const yEnd = st.end
      if (y < yStart) {
        scrollWindowJourneyBlend(y, yEnd, yStart)
      } else if (y < yEnd) {
        const leg = yEnd - y
        const T = phaseScrollDuration(leg, JOURNEY_ANIM_PX_PER_SEC)
        const o = { u: 0 }
        gsap.to(o, {
          u: 1,
          duration: T,
          ease: 'power2.out',
          onUpdate: () => {
            window.scrollTo(0, y + leg * o.u)
          },
        })
      } else {
        gsap.to(window, {
          duration: 0.85,
          scrollTo: yEnd,
          ease: 'power2.out',
        })
      }
      window.history.replaceState(null, '', '#path')
      return
    }
    const section = document.getElementById('path')
    const h =
      section && section.offsetHeight > 0
        ? section.offsetHeight
        : window.innerHeight * 1.8
    if (section) {
      const yStart = section.offsetTop
      const yEnd = Math.max(0, section.offsetTop + h - window.innerHeight)
      const y = window.scrollY
      if (y < yStart) {
        scrollWindowJourneyBlend(y, yEnd, yStart)
      } else {
        const leg = Math.abs(yEnd - y)
        const T = phaseScrollDuration(leg, JOURNEY_ANIM_PX_PER_SEC)
        const dir = yEnd >= y ? 1 : -1
        const o = { u: 0 }
        gsap.to(o, {
          u: 1,
          duration: T,
          ease: 'power2.out',
          onUpdate: () => {
            window.scrollTo(0, y + dir * leg * o.u)
          },
        })
      }
      window.history.replaceState(null, '', '#path')
      return
    }
  }

  const mobile = document.querySelector<HTMLElement>('[data-journey-mobile]')
  if (mobile) {
    gsap.to(window, {
      duration: 1,
      scrollTo: mobile,
      ease: 'power2.inOut'
    })
    window.history.replaceState(null, '', '#path')
  }
}

export function scrollToAnchor(elementId: string) {
  const id = elementId.replace(/^#/, '')
  gsap.killTweensOf(window)

  if (id === 'path') {
    scrollToPath()
    return
  }

  if (id === 'vr' && window.matchMedia(VR_VIDEO_OVERLAY_MQ).matches) {
    const section = document.getElementById('vr')
    const videoEl = section?.querySelector<HTMLElement>('[data-vr-video-align]')
    if (section && videoEl) {
      const top =
        videoEl.getBoundingClientRect().top +
        window.scrollY -
        VR_SCROLL_OFFSET_TOP_PX
        gsap.to(window, {
          duration: 1,
          scrollTo: Math.max(0, top),
          ease: 'power2.inOut'
        })
      window.history.replaceState(null, '', '#vr')
      return
    }
  }

  const el = document.getElementById(id)
  if (!el) return
  const offsetY = ANCHOR_IDS_WITH_HEADER_OFFSET.has(id)
    ? SECTION_HEADER_SCROLL_OFFSET_TOP_PX
    : 0
  gsap.to(window, {
    duration: 1,
    scrollTo: {
      y: el,
      offsetY
    },
    ease: 'power2.inOut'
  })
  window.history.replaceState(null, '', `#${id}`)
}

export function smoothAnchorClickNavigation(
  e: MouseEvent,
  elementId: string,
): void {
  if (e.defaultPrevented) return
  if (e.button !== 0) return
  if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return
  e.preventDefault()
  scrollToAnchor(elementId)
}
