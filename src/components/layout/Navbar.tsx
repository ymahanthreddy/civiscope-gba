import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  FileText, 
  Search, 
  LayoutDashboard, 
  LogIn, 
  LogOut, 
  Menu, 
  X,
  Sparkles,
  User,
  Home
} from 'lucide-react';
import { useState } from 'react';
import logo from '@/assets/logo.png';

export function Navbar() {
  const location = useLocation();
  const { user, signOut, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/report', label: 'Report Issue', icon: FileText },
    { to: '/track', label: 'Track Issue', icon: Search },
    { to: '/about', label: 'About Us', icon: User },
  ];

  // Add user dashboard for logged-in non-admin users
  if (user && !isAdmin) {
    navItems.push({ to: '/dashboard', label: 'My Dashboard', icon: User });
  }

  if (isAdmin) {
    navItems.push({ to: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard });
  }

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/40 shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl overflow-hidden shadow-lg relative"
            >
              <img src={logo} alt="Civiscope Logo" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="font-display font-bold text-lg text-foreground leading-tight group-hover:text-primary transition-colors">
                Civiscope
              </h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-accent" />
                Civic Connect
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.to;
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={item.to}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      size="sm"
                      className={`relative overflow-hidden group ${isActive ? 'primary-gradient neon-glow' : 'hover:bg-primary/10'}`}
                    >
                      <Icon className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                      <span className="relative z-10">{item.label}</span>
                      {!isActive && (
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '0%' }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* WhatsApp Button */}
            <motion.a
              href="https://chat.whatsapp.com/LWT5oqI8AdC2hvxkB5hdLD"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="sm" className="bg-[#25D366] hover:bg-[#128C7E] text-white gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Join Community
              </Button>
            </motion.a>
            
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center gap-3">
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-muted-foreground"
                >
                  Hi, <span className="font-medium text-foreground">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                </motion.span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="group hover:border-destructive hover:text-destructive transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2 group-hover:animate-wiggle" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="group hover:border-primary hover:bg-primary/10"
                >
                  <LogIn className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative"
            >
              <motion.div
                animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.div>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{ 
            height: mobileMenuOpen ? 'auto' : 0,
            opacity: mobileMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 border-t space-y-2">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.to;
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.to}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className={`w-full justify-start ${isActive ? 'primary-gradient' : ''}`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
            <div className="border-t pt-2 mt-2">
              {user ? (
                <Button variant="outline" className="w-full" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
