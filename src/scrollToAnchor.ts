import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const JOURNEY_SCROLL_TRIGGER_ID = 'journey-path'
const DESKTOP_JOURNEY_MQ = '(min-width: 1301px)'

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

  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  window.history.replaceState(null, '', `#${id}`)
}
