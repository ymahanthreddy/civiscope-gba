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
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Smooth transition gradient from hero */}
      <div className="absolute -top-32 left-0 right-0 h-32 bg-gradient-to-b from-slate-900 to-transparent pointer-events-none" />
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-background to-background" />
      
      {/* Animated gradient orbs */}
      <motion.div
        animate={{ 
          x: [0, 40, 0], 
          y: [0, -30, 0],
          scale: [1, 1.3, 1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 left-[15%] w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/10 blur-3xl"
      />
      <motion.div
        animate={{ 
          x: [0, -50, 0], 
          y: [0, 40, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 right-[20%] w-80 h-80 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/10 blur-3xl"
      />
      <motion.div
        animate={{ 
          scale: [1, 1.4, 1],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-emerald-500/15 to-green-500/10 blur-3xl"
      />
      
      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
          className="absolute w-2 h-2 rounded-full bg-primary/40"
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Live Statistics</span>
            <Zap className="w-4 h-4 animate-pulse" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Real-Time</span> Impact
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Track our progress in making Bengaluru a better city, one issue at a time
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: stat.delay, type: 'spring', stiffness: 100 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="group"
            >
              <div className="glass-card rounded-2xl p-6 md:p-8 text-center relative overflow-hidden">
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
