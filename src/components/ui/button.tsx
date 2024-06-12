import { cn, getStyleVariant } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import type { ButtonHTMLAttributes, RefAttributes } from 'react'

const css = {
  base: 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  variants: {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive:
      'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline:
      'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  },
  sizes: {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  },
  defaults: {
    variant: 'default',
    size: 'default',
  },
}

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    RefAttributes<HTMLButtonElement> {
  variant?: keyof typeof css.variants
  size?: keyof typeof css.sizes
  asChild?: boolean
}

const Button: React.FC<ButtonProps> = ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) => {
  const Comp = asChild ? Slot : 'button'
  const classNames = cn(
    css.base,
    className,
    getStyleVariant(css, { variant, size })
  )
  return <Comp className={classNames} {...props} />
}

export { Button, css as buttonCss }
