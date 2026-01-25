import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, MapPin, Shield, Zap, Play, CheckCircle2, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Sample data for the pie chart
const issueData = [
  { name: 'Roads', value: 35, color: '#10b981' },
  { name: 'Garbage', value: 25, color: '#06b6d4' },
  { name: 'Streetlights', value: 20, color: '#f59e0b' },
  { name: 'Drainage', value: 12, color: '#8b5cf6' },
  { name: 'Parks', value: 8, color: '#ec4899' },
];

export function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Animated Background Elements - Enhanced for white background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating gradient orbs */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full blur-3xl"
            style={{
              width: Math.random() * 400 + 200,
              height: Math.random() * 400 + 200,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.1))' 
                : i % 3 === 1
                ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(59, 130, 246, 0.08))'
                : 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(236, 72, 153, 0.08))',
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 60 - 30],
              scale: [1, Math.random() * 0.3 + 0.85, 1],
            }}
            transition={{ 
              duration: Math.random() * 15 + 10, 
              repeat: Infinity, 
              ease: "easeInOut",
              repeatType: "reverse"
            }}
          />
        ))}

        {/* Animated dots grid */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={`dot-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full bg-primary/40"
              style={{
                left: `${(i % 10) * 11}%`,
                top: `${Math.floor(i / 10) * 22}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Floating lines */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
            style={{
              width: Math.random() * 300 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              rotate: Math.random() * 60 - 30,
            }}
            animate={{
              opacity: [0, 0.5, 0],
              x: [0, 100],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}

        {/* Geometric shapes */}
        <motion.div
          className="absolute top-20 right-[15%] w-32 h-32 border-2 border-emerald-200/30 rounded-2xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-40 left-[10%] w-24 h-24 border-2 border-cyan-200/30 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/3 left-[5%] w-16 h-16 border-2 border-amber-200/30"
          style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-cyan-50/50 dark:from-emerald-950/20 dark:via-transparent dark:to-cyan-950/20" />

      <motion.div style={{ y, opacity }} className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-cyan-100 dark:from-emerald-500/20 dark:to-cyan-500/20 border border-emerald-200 dark:border-emerald-500/30 mb-6"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Smart City Platform</span>
              <Zap className="w-4 h-4 text-cyan-600 dark:text-cyan-400 animate-pulse" />
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 }} 
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight"
            >
              <span className="block">Your Voice</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500">
                Shapes the City
              </span>
              <span className="block">of Tomorrow</span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4 }} 
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl"
            >
              Connect with your city, report civic issues, and track resolutions in real-time. 
              Get <span className="text-cyan-600 dark:text-cyan-400 font-semibold">AI-powered insights</span>, discover local improvements, 
              and build a better Bengaluru together.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.5 }} 
              className="flex flex-wrap gap-4 mb-10"
            >
              <Link to="/report">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white text-lg px-8 py-6 shadow-2xl shadow-emerald-500/25 group">
                    Report an Issue
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/track">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" className="border-2 border-slate-300 dark:border-slate-600 text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 text-lg px-8 py-6 shadow-lg group">
                    <Play className="mr-2 w-5 h-5" />
                    Track Progress
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Stats Row */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.7 }} 
              className="flex flex-wrap gap-6 text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-500" />
                <span className="text-sm">12+ Areas</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-500" />
                <span className="text-sm">Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <span className="text-sm">AI-Powered</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Interactive Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Main Chart Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/10 border border-slate-200 dark:border-slate-700 bg-card p-6"
            >
              {/* Chart Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Issue Distribution</h3>
                  <p className="text-sm text-muted-foreground">Real-time civic data</p>
                </div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">Live</span>
                </motion.div>
              </div>

              {/* Pie Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={issueData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      animationBegin={500}
                      animationDuration={1000}
                    >
                      {issueData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      }}
                      formatter={(value: number) => [`${value}%`, 'Issues']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                {issueData.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Floating Card - AI Powered */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="absolute -top-4 -right-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30"
            >
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">AI-Powered</p>
                <p className="text-white/80 text-xs">Smart analytics</p>
              </div>
            </motion.div>

            {/* Floating Card - Active Issues */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="absolute -bottom-4 -left-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-slate-200 dark:border-slate-700 shadow-xl"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-foreground font-bold text-sm">Active Community</p>
                <p className="text-muted-foreground text-xs">1000+ issues resolved</p>
              </div>
            </motion.div>

            {/* Floating Card - Trending */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              whileHover={{ scale: 1.05 }}
              className="absolute bottom-1/3 -right-8 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500 shadow-lg shadow-amber-500/30"
            >
              <TrendingUp className="w-4 h-4 text-white" />
              <span className="text-white text-xs font-bold">+24% this week</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative Rotating Elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 border border-emerald-200/20 dark:border-primary/5 rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 border border-cyan-200/20 dark:border-accent/5 rounded-full"
      />
    </section>
  );
}
