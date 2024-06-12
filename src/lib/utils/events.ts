import type { TElementEvent } from '@/lib/types'

export const on: TElementEvent = (el, event, handler) => {
  return el?.addEventListener(event, handler)
}

export const off: TElementEvent = (el, event, handler) => {
  return el?.removeEventListener(event, handler)
}
