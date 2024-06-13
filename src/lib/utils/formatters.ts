import { STR_REPLACER_PATTERN } from '@/lib/constants'
import type { TReplacerKeys } from '@/lib/types'

export function strReplacer<S extends string>(
  value: S,
  mappedReplacer: TReplacerKeys<S>
): string {
  const { prefix, suffix } = STR_REPLACER_PATTERN
  const shortcodes = Object.keys(mappedReplacer)

  if (shortcodes.length && value.includes(prefix) && value.includes(suffix)) {
    const pattern = new RegExp(
      `${prefix}(${shortcodes.join('|')})${suffix}`,
      'g'
    )
    return value.replace(pattern, (_, key: keyof typeof mappedReplacer) =>
      String(mappedReplacer[key] ?? '')
    )
  }
  return value
}

export function toNumber(value: unknown, fallbackValue = 0): number {
  if (typeof value === 'number') {
    return value
  }
  if (typeof value === 'string') {
    const parsedValue = Number(value)
    return Number.isNaN(parsedValue) ? fallbackValue : parsedValue
  }
  return fallbackValue
}

export function toAbsNumber(
  value: unknown,
  fallbackValue: number | undefined = 0
): number {
  return Math.abs(toNumber(value, fallbackValue))
}

export function objectToMap<T extends Record<string, unknown>>(
  obj: T
): Map<keyof T, T[keyof T]> {
  return new Map(Object.entries(obj) as [keyof T, T[keyof T]][])
}
