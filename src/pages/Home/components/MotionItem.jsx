import { useReducedMotion } from 'motion/react'
import {
  elements,
  fadeUp,
  slideRight,
  hoverTransition,
} from '@/components/Animation/presets'

export default function MotionItem({
  as = 'article',
  fromRight = false,
  hover = false,
  ...props
}) {
  const reducedMotion = useReducedMotion()
  const Component = reducedMotion ? as : elements[as]

  return reducedMotion ? (
    <Component {...props} />
  ) : (
    <Component
      variants={fromRight ? slideRight : fadeUp}
      whileHover={hover ? { scale: 1.03 } : undefined}
      transition={hoverTransition}
      {...props}
    />
  )
}
