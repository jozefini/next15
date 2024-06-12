// Events

type EventEl = MediaQueryList | Element

export type TElementEvent = (
  el: EventEl,
  event: string,
  handler: EventListener
) => void

// Formatters

export type TExtractKeys<S extends string> =
  S extends `${string}{{${infer K}}}${infer Rest}`
    ? K | TExtractKeys<Rest>
    : never

export type TReplacerKeys<S extends string> =
  TExtractKeys<S> extends infer K
    ? K extends string
      ? Record<K, string | number> & Record<string, string | number>
      : never
    : never

// Styles

export type TStylesConstant = {
  variants?: Record<string, string>
  sizes?: Record<string, string>
  defaults?: {
    variant?: keyof TStylesConstant['variants'] | string
    size?: keyof TStylesConstant['sizes'] | string
  }
} & {
  [key: string]: string | Record<string, string> | undefined
}

export type TStylesVariant<T extends TStylesConstant> = {
  variant?: keyof T['variants']
  size?: keyof T['sizes']
}

// Misc

export type TFunction = (...args: unknown[]) => unknown
