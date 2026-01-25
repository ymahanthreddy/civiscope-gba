import { motion } from 'framer-motion';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Floating orbs */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-20 dark:opacity-10"
          style={{
            width: `${80 + i * 40}px`,
            height: `${80 + i * 40}px`,
            left: `${10 + i * 15}%`,
            top: `${5 + i * 12}%`,
            background: `linear-gradient(135deg, hsl(var(--primary) / 0.3), hsl(var(--accent) / 0.2))`,
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 15 + i * 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 2,
          }}
        />
      ))}

      {/* Moving gradient lines */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full opacity-30 dark:opacity-20"
        style={{
          background: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 100px,
            hsl(var(--primary) / 0.03) 100px,
            hsl(var(--primary) / 0.03) 101px
          )`,
        }}
        animate={{
          backgroundPosition: ['0px 0px', '200px 200px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Slow rotating accent circle */}
      <motion.div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-10"
        style={{
          background: `radial-gradient(circle, hsl(var(--primary) / 0.4), transparent 70%)`,
        }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: { duration: 60, repeat: Infinity, ease: 'linear' },
          scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      {/* Top left accent */}
      <motion.div
        className="absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-10"
        style={{
          background: `radial-gradient(circle, hsl(var(--accent) / 0.5), transparent 60%)`,
        }}
        animate={{
          rotate: [360, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          rotate: { duration: 50, repeat: Infinity, ease: 'linear' },
          scale: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      {/* Subtle particle dots */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-primary/30 dark:bg-primary/20"
          style={{
            left: `${5 + (i * 8)}%`,
            top: `${10 + (i % 4) * 25}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4 + (i % 3) * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}
