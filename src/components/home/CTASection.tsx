import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Phone, Mail } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient opacity-90" />
      
      {/* Floating elements */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-20 left-[10%] w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm"
      />
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-20 right-[15%] w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-1/3 right-[20%] w-16 h-16 rounded-lg bg-white/10 backdrop-blur-sm rotate-45"
      />

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
