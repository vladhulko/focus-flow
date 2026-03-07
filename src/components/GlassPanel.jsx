import { motion } from 'framer-motion'

const GlassPanel = ({
  children,
  className = '',
  strong = false,
  animate = true,
  delay = 0,
  glow = '',
  onClick,
  ...props
}) => {
  const baseClass = strong ? 'glass-strong' : 'glass'
  const glowClass = glow ? `glow-${glow}` : ''

  const Wrapper = animate ? motion.div : 'div'
  const animationProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay, ease: 'easeOut' },
      }
    : {}

  return (
    <Wrapper
      className={`${baseClass} ${glowClass} p-6 ${className}`}
      onClick={onClick}
      {...animationProps}
      {...props}
    >
      {children}
    </Wrapper>
  )
}

export default GlassPanel

