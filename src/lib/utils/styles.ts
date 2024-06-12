import type { TStylesConstant, TStylesVariant } from '@/lib/types'

export function getStyleVariant<T extends TStylesConstant>(
  css: T,
  userChoice: TStylesVariant<T>
) {
  const variantKey = (userChoice.variant ?? css.defaults?.variant) as keyof (
    | T['variants']
    | undefined
  )
  const sizeKey = (userChoice.size ?? css.defaults?.size) as keyof (
    | T['sizes']
    | undefined
  )
  return cn(css.variants?.[variantKey], css.sizes?.[sizeKey])
}

export function cn(...inputs: (string | undefined | false | null)[]) {
  return inputs.filter(Boolean).join(' ')
}

export function findTruthy<T>(...inputs: T[]): T | undefined {
  return inputs.find(Boolean)
}
