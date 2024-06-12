export function isObject<T extends Record<string, unknown>>(
  obj: unknown
): obj is T {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj)
}

export function isArray<T = unknown[]>(obj: unknown): obj is T[] {
  return Array.isArray(obj)
}

export function isString(obj: unknown): obj is string {
  return typeof obj === 'string'
}

export function isNumber(obj: unknown): obj is number {
  return typeof obj === 'number'
}

export function isBoolean(obj: unknown): obj is boolean {
  return typeof obj === 'boolean'
}

export function isFunction<T extends (...args: unknown[]) => unknown>(
  obj: unknown
): obj is T {
  return typeof obj === 'function'
}

export function isEmpty(obj: unknown): boolean {
  if (isArray(obj)) {
    return obj.length === 0
  }

  if (isObject(obj)) {
    return Object.keys(obj).length === 0
  }

  return !obj
}

export function isLikeNumber(value: unknown): value is number {
  return !Number.isNaN(Number(value))
}
