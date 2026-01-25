import { Building2, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl primary-gradient flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display font-bold text-foreground">GBA-IMS</h3>
                <p className="text-xs text-muted-foreground">Greater Bengaluru Area</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering citizens to build a better Bengaluru, one issue at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/report" className="hover:text-primary transition-colors">Report an Issue</a></li>
              <li><a href="/track" className="hover:text-primary transition-colors">Track Your Complaint</a></li>
              <li><a href="/admin/login" className="hover:text-primary transition-colors">Official Portal</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Helpline: 1800-XXX-XXXX</li>
              <li>Email: support@gba-ims.gov.in</li>
              <li>BBMP Head Office, Bengaluru</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Greater Bengaluru Area Information Management System
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
