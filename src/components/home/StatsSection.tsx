import { motion } from 'framer-motion';
import { useSupabaseIssues } from '@/hooks/useSupabaseIssues';
import { FileText, CheckCircle2, Clock, Users, TrendingUp, Zap } from 'lucide-react';

export function StatsSection() {
  const { issues, officials, loading } = useSupabaseIssues();

  const stats = [
    {
      label: 'Total Issues',
      value: loading ? '...' : issues.length,
      icon: FileText,
      gradient: 'from-blue-500 to-cyan-500',
      delay: 0,
    },
    {
      label: 'Resolved',
      value: loading ? '...' : issues.filter(i => i.status === 'closed').length,
      icon: CheckCircle2,
      gradient: 'from-emerald-500 to-green-500',
      delay: 0.1,
    },
    {
      label: 'In Progress',
      value: loading ? '...' : issues.filter(i => i.status === 'in_progress' || i.status === 'assigned').length,
      icon: Clock,
      gradient: 'from-violet-500 to-purple-500',
      delay: 0.2,
    },
    {
      label: 'Officials',
      value: loading ? '...' : officials.length,
      icon: Users,
      gradient: 'from-orange-500 to-amber-500',
      delay: 0.3,
    },
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden bg-background">
      {/* Background Effects - Light themed */}
      <div className="absolute inset-0">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-background to-cyan-50/80 dark:from-emerald-950/20 dark:via-background dark:to-cyan-950/20" />
        
        {/* Floating gradient orbs */}
        <motion.div
          animate={{ 
            x: [0, 40, 0], 
            y: [0, -30, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 left-[15%] w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/15 dark:from-blue-500/15 dark:to-cyan-500/10 blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -50, 0], 
            y: [0, 40, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-[20%] w-80 h-80 rounded-full bg-gradient-to-br from-violet-400/20 to-purple-400/15 dark:from-violet-500/15 dark:to-purple-500/10 blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.35, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-emerald-400/20 to-green-400/15 dark:from-emerald-500/10 dark:to-green-500/10 blur-3xl"
        />

        {/* Animated dots grid */}
        <div className="absolute inset-0 opacity-40 dark:opacity-20">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={`stat-dot-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full bg-primary/30"
              style={{
                left: `${(i % 6) * 18 + 5}%`,
                top: `${Math.floor(i / 6) * 22 + 10}%`,
              }}
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Geometric decorations */}
        <motion.div
          className="absolute top-10 right-[10%] w-20 h-20 border-2 border-emerald-200/40 dark:border-emerald-500/20 rounded-xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-20 left-[8%] w-16 h-16 border-2 border-cyan-200/40 dark:border-cyan-500/20 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/2 right-[5%] w-12 h-12 border-2 border-violet-200/40 dark:border-violet-500/20"
          style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
          className="absolute w-2 h-2 rounded-full bg-primary/30"
          style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 25}%` }}
        />
      ))}

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-primary/10 text-emerald-700 dark:text-primary mb-6 border border-emerald-200 dark:border-emerald-500/30">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Live Statistics</span>
            <Zap className="w-4 h-4 animate-pulse" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">
            <span className="text-gradient">Real-Time</span> Impact
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Track our progress in making Bengaluru a better city, one issue at a time
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: stat.delay, type: 'spring', stiffness: 100 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="group"
            >
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 text-center relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                {/* Animated gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 15 }}
                  className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Value */}
                <motion.p
                  className="text-4xl md:text-5xl font-bold text-foreground mb-2"
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: stat.delay + 0.2, type: 'spring' }}
                >
                  {stat.value}
                </motion.p>

                {/* Label */}
                <p className="text-muted-foreground font-medium">{stat.label}</p>

                {/* Decorative line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
