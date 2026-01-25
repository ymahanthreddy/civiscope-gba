import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CATEGORY_CONFIG } from '@/lib/constants';
import { IssueCategory } from '@/contexts/IssueContext';
import { 
  FileText, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Users,
  TrendingUp,
  Shield,
  Sparkles,
  Zap,
  Star
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

export function HeroSection() {
  const categories = Object.entries(CATEGORY_CONFIG) as [IssueCategory, typeof CATEGORY_CONFIG[IssueCategory]][];

  return (
    <section className="relative overflow-hidden">
      {/* Hero Background */}
      <div className="hero-gradient min-h-[90vh] relative particles-bg">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            animate={{ 
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" 
          />
          <motion.div 
            animate={{ 
              x: [0, -20, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" 
          />
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl" 
          />
          
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          {/* Main Hero Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6 cursor-pointer"
            >
              <Shield className="w-4 h-4 text-accent animate-pulse" />
              <span>Official Civic Platform</span>
              <Sparkles className="w-4 h-4 text-warning" />
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Greater Bengaluru Area
              <motion.span 
                className="block text-gradient-rainbow mt-2"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{
                  backgroundImage: 'linear-gradient(135deg, #f97316, #eab308, #22c55e, #06b6d4, #8b5cf6, #ec4899)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Information Management System
              </motion.span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-white/80 mb-8 font-light"
            >
              From Complaint to Closure — A Civic Transformation
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/report">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="accent-gradient text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all neon-glow-accent group">
                    <FileText className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                    Report an Issue
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/track">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm group">
                    <Search className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Track Your Complaint
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16"
          >
            {[
              { icon: FileText, value: '12,847', label: 'Issues Reported', color: 'from-amber-400 to-orange-500' },
              { icon: CheckCircle2, value: '11,432', label: 'Issues Resolved', color: 'from-emerald-400 to-green-500' },
              { icon: Clock, value: '2.3 days', label: 'Avg Resolution', color: 'from-cyan-400 to-blue-500' },
              { icon: Users, value: '89%', label: 'Satisfaction', color: 'from-violet-400 to-purple-500' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-card rounded-2xl p-4 text-center cursor-pointer card-hover-effect group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <motion.div 
                  className="font-display text-2xl font-bold text-foreground"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Categories */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-5xl mx-auto"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-center text-white/80 text-lg mb-6 font-medium flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 text-warning" />
              What can you report?
              <Zap className="w-5 h-5 text-warning" />
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {categories.map(([key, category], i) => (
                <motion.div
                  key={key}
                  variants={itemVariants}
                  whileHover={{ scale: 1.1, y: -10, rotate: [-1, 1, -1, 0] }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-card rounded-xl p-4 text-center cursor-pointer card-hover-effect group"
                >
                  <motion.div 
                    className="text-4xl mb-2"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  >
                    {category.icon}
                  </motion.div>
                  <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                    {category.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-background py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="w-4 h-4" />
              Simple Process
            </motion.div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple, transparent, and effective issue resolution workflow
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { step: '01', title: 'Report', desc: 'Submit your issue with details and location', icon: '📝', color: 'from-amber-400 to-orange-500' },
              { step: '02', title: 'Assign', desc: 'Issue is assigned to the right department', icon: '👤', color: 'from-blue-400 to-cyan-500' },
              { step: '03', title: 'Track', desc: 'Monitor progress in real-time', icon: '🔍', color: 'from-violet-400 to-purple-500' },
              { step: '04', title: 'Resolve', desc: 'Issue closed with photo evidence', icon: '✅', color: 'from-emerald-400 to-green-500' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <motion.div 
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all h-full border border-border/50 group"
                >
                  <motion.div 
                    className="text-5xl mb-4"
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                  >
                    {item.icon}
                  </motion.div>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${item.color} mb-3`}>
                    STEP {item.step}
                  </div>
                  <h3 className="font-display font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-6 h-6 text-primary" />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="primary-gradient py-16 relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 100% 100%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="inline-block mb-4"
            >
              <TrendingUp className="w-12 h-12 text-accent" />
            </motion.div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Be Part of the <span className="text-accent">Change</span>
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Your voice matters. Together, we can build a cleaner, safer, and smarter Bengaluru.
            </p>
            <Link to="/report">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Button size="lg" className="accent-gradient text-lg px-8 neon-glow-accent">
                  Start Reporting Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
