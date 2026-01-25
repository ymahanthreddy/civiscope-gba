import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, MapPin, Shield, Zap, ChevronDown } from 'lucide-react';
import logo from '@/assets/logo.png';

export function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 hero-gradient" />
      
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: Math.random() * 60 + 20,
              height: Math.random() * 60 + 20,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              scale: [1, Math.random() * 0.5 + 0.8, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />

      <motion.div style={{ y, opacity }} className="container mx-auto px-4 relative z-10 text-center pt-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="mb-6"
          >
            <motion.img 
              src={logo} 
              alt="Civiscope Logo" 
              className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-2xl shadow-2xl"
              whileHover={{ scale: 1.1, rotate: 10 }}
              animate={{ 
                boxShadow: ['0 0 20px rgba(255,255,255,0.3)', '0 0 40px rgba(255,255,255,0.5)', '0 0 20px rgba(255,255,255,0.3)']
              }}
              transition={{ boxShadow: { duration: 2, repeat: Infinity } }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-8"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium">Transforming Civic Engagement</span>
            <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            <span className="block">Civiscope</span>
            <span className="block text-3xl md:text-4xl lg:text-5xl font-normal text-white/80 mt-2">Greater Bengaluru Area</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-xl md:text-2xl text-white/90 mb-4 font-medium">
            From Complaint to Closure —
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 font-bold mb-8">
            A Civic Transformation
          </motion.p>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-lg text-white/70 max-w-2xl mx-auto mb-10">
            Report civic issues, track resolutions in real-time, and be part of building a smarter, cleaner Bengaluru.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/report">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 shadow-2xl shadow-white/20 group">
                  Report an Issue
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>
            <Link to="/track">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 backdrop-blur-sm">
                  Track Your Issue
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="flex flex-wrap justify-center gap-6 md:gap-12 text-white/60">
            <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-cyan-400" /><span className="text-sm">12+ Areas Covered</span></div>
            <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-emerald-400" /><span className="text-sm">Secure & Private</span></div>
            <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-400" /><span className="text-sm">AI-Powered</span></div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center text-white/50">
          <span className="text-xs mb-2">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}