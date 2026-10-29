import { Sparkles, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '@/assets/logo.png';

export function Footer() {
  return (
    <footer className="border-t bg-card/50 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <motion.img 
                src={logo} 
                alt="Civiscope Logo" 
                className="w-10 h-10 rounded-xl shadow-lg"
                whileHover={{ rotate: 10, scale: 1.1 }}
              />
              <div>
                <h3 className="font-display font-bold text-foreground text-lg">Civiscope</h3>
                <p className="text-xs text-muted-foreground">Civic Connect Platform</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering citizens to build a better Bengaluru, one issue at a time. AI-powered civic issue management.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Platform</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/report" className="hover:text-primary transition-colors animated-underline inline-block">Report an Issue</Link></li>
              <li><Link to="/track" className="hover:text-primary transition-colors animated-underline inline-block">Track Complaint</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors animated-underline inline-block">About Us</Link></li>
              <li><Link to="/auth" className="hover:text-primary transition-colors animated-underline inline-block">Sign In</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/admin-login" className="hover:text-primary transition-colors animated-underline inline-block">Admin Portal</Link></li>
              <li><a href="https://chat.whatsapp.com/LWT5oqI8AdC2hvxkB5hdLD" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors animated-underline inline-flex items-center gap-1">Community <ExternalLink className="w-3 h-3" /></a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>📞 +91-9483410461</li>
              <li>✉️ support@civiscope.in</li>
              <li>📍 Bengaluru, Karnataka</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Civiscope. All rights reserved.
          </p>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
            <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span className="text-sm font-medium bg-gradient-to-r from-emerald-600 to-cyan-500 bg-clip-text text-transparent">Powered by Agentic AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
