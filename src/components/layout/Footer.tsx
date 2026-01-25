import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';

export function Footer() {
  return (
    <footer className="border-t bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Civiscope Logo" className="w-10 h-10 rounded-xl shadow-lg" />
              <div>
                <h3 className="font-display font-bold text-foreground">Civiscope</h3>
                <p className="text-xs text-muted-foreground">Civic Connect Platform</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering citizens to build a better community, one issue at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/report" className="hover:text-primary transition-colors">Report an Issue</Link></li>
              <li><Link to="/track" className="hover:text-primary transition-colors">Track Your Complaint</Link></li>
              <li><Link to="/auth" className="hover:text-primary transition-colors">Sign In</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Helpline: 1800-XXX-XXXX</li>
              <li>Email: support@civiscope.in</li>
              <li>Head Office, Bengaluru</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Civiscope - Civic Issue Management System
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Powered by AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
