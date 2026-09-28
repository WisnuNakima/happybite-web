import { motion } from 'motion/react'

export const elements = {
  section: motion.section,
  footer: motion.footer,
  div: motion.div,
  article: motion.article,
  h1: motion.h1,
  p: motion.p,
}

export const viewport = { once: false, amount: 0.2 }
const transition = { duration: 0.55, ease: 'easeOut' }
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition },
}
export const slideRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition },
}
export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}
export const hoverTransition = { duration: 0.2, ease: 'easeOut' }
