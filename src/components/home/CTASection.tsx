import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Phone, Mail } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient opacity-90" />
      
      {/* Animated gradient overlays */}
      <motion.div
        animate={{ 
          x: [0, 60, 0], 
          y: [0, -40, 0],
          scale: [1, 1.3, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-[5%] w-80 h-80 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/10 blur-3xl"
      />
      <motion.div
        animate={{ 
          x: [0, -50, 0], 
          y: [0, 50, 0],
          scale: [1, 1.4, 1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 right-[10%] w-96 h-96 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/10 blur-3xl"
      />
      <motion.div
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.15, 0.3, 0.15]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-cyan-400/15 to-teal-500/10 blur-3xl"
      />
      
      {/* Floating elements */}
      <motion.div
        animate={{ y: [0, -25, 0], rotate: [0, 10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-16 left-[8%] w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
      />
      <motion.div
        animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-16 right-[12%] w-36 h-36 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], rotate: [45, 90, 45] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 right-[18%] w-20 h-20 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
      />
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/3 left-[18%] w-14 h-14 rounded-lg bg-gradient-to-br from-yellow-300/20 to-orange-400/10 backdrop-blur-sm"
      />
      
      {/* Sparkle particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            y: [0, -40, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1]
          }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          className="absolute w-1.5 h-1.5 rounded-full bg-white/50"
          style={{ left: `${5 + i * 10}%`, top: `${15 + (i % 4) * 20}%` }}
        />
      ))}

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Badge */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white mb-8"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Join the Civic Revolution</span>
            </motion.div>

            {/* Heading */}
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Make <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300">
                Bengaluru Better?
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Your voice matters. Report issues, track progress, and be part of the change. Together, we can transform our city.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/report">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 shadow-xl group">
                    Report an Issue
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/track">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-white/20 backdrop-blur-md border border-white/40 text-white hover:bg-white/30 text-lg px-8 py-6 shadow-lg font-semibold">
                    Track Your Issue
                  </Button>
                </motion.div>
              </Link>
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>1800-XXX-XXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>support@civiscope.gov.in</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
