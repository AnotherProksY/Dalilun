declare module 'smooth-scroll' {
  export type SmoothScrollEasing =
    | 'Linear'
    | 'easeInQuad'
    | 'easeOutQuad'
    | 'easeInOutQuad'
    | 'easeInCubic'
    | 'easeOutCubic'
    | 'easeInOutCubic'
    | 'easeInQuart'
    | 'easeOutQuart'
    | 'easeInOutQuart'
    | 'easeInQuint'
    | 'easeOutQuint'
    | 'easeInOutQuint'

  export interface SmoothScrollOptions {
    ignore?: string
    header?: string | null
    topOnEmptyHash?: boolean
    speed?: number
    speedAsDuration?: boolean
    durationMax?: number | null
    durationMin?: number | null
    clip?: boolean
    offset?: number | ((anchor: Element, toggle: Element | null) => number)
    easing?: SmoothScrollEasing
    customEasing?: ((time: number) => number) | null
    updateURL?: boolean
    popstate?: boolean
    emitEvents?: boolean
  }

  export default class SmoothScroll {
    constructor(selector?: string, options?: SmoothScrollOptions)
    animateScroll(
      anchor: Element | number,
      toggle?: Element | null,
      options?: SmoothScrollOptions,
    ): void
    cancelScroll(noEvent?: boolean): void
    destroy(): void
  }
}
