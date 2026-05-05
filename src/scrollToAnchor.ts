import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const JOURNEY_SCROLL_TRIGGER_ID = 'journey-path'
const DESKTOP_JOURNEY_MQ = '(min-width: 1301px)'
const VR_VIDEO_OVERLAY_MQ = '(min-width: 1000px)'
const VR_SCROLL_OFFSET_TOP_PX = 100

function scrollToPath() {
  const desktop = window.matchMedia(DESKTOP_JOURNEY_MQ).matches
  ScrollTrigger.refresh()

  if (desktop) {
    const st = ScrollTrigger.getById(JOURNEY_SCROLL_TRIGGER_ID)
    if (st && st.end > st.start) {
      window.scrollTo({ top: st.end, behavior: 'smooth' })
      window.history.replaceState(null, '', '#path')
      return
    }
    const section = document.getElementById('path')
    const h =
      section && section.offsetHeight > 0
        ? section.offsetHeight
        : window.innerHeight * 1.8
    if (section) {
      const top = section.offsetTop + h - window.innerHeight
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
      window.history.replaceState(null, '', '#path')
      return
    }
  }

  const mobile = document.querySelector<HTMLElement>('[data-journey-mobile]')
  if (mobile) {
    mobile.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState(null, '', '#path')
  }
}

export function scrollToAnchor(elementId: string) {
  const id = elementId.replace(/^#/, '')

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
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
      window.history.replaceState(null, '', '#vr')
      return
    }
  }

  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  window.history.replaceState(null, '', `#${id}`)
}
