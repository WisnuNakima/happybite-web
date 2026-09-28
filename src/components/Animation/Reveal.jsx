import { useReducedMotion } from 'motion/react'
import { elements, viewport, fadeUp } from './presets'

// Reduced-motion users receive ordinary HTML, without hidden state.
export default function Reveal({ as = 'section', ...props }) {
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
      variants={fadeUp}
      {...props}
    />
  )
}
