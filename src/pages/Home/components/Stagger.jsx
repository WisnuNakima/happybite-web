import { useReducedMotion } from 'motion/react'
import { elements, viewport, stagger } from '@/components/Animation/presets'

export default function Stagger({ as = 'div', ...props }) {
  const reducedMotion = useReducedMotion()
  const Component = reducedMotion ? as : elements[as]

  return reducedMotion ? (
    <Component {...props} />
  ) : (
    <Component
      initial="hidden"
      animate="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={stagger}
      {...props}
    />
  )
}
