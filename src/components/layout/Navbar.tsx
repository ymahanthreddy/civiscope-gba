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
