export function objectToMap<T extends Record<string, unknown>>(
  obj: T
): Map<keyof T, T[keyof T]> {
  return new Map(Object.entries(obj) as [keyof T, T[keyof T]][])
}
