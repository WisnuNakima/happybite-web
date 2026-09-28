import { motion, useReducedMotion } from 'motion/react'

const elements = {
  section: motion.section,
  footer: motion.footer,
  div: motion.div,
  article: motion.article,
  h1: motion.h1,
  p: motion.p,
}

const viewport = { once: false, amount: 0.2 }
const transition = { duration: 0.55, ease: 'easeOut' }
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition },
}
const slideRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition },
}
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}
const hoverTransition = { duration: 0.2, ease: 'easeOut' }

// Replace existing elements rather than adding layout wrappers. Reduced-motion
// users get ordinary HTML, including offscreen content, with no hidden state.
export function Reveal({ as = 'section', ...props }) {
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

export function Stagger({ as = 'div', ...props }) {
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

export function MotionItem({
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
