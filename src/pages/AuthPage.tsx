import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { LogIn, UserPlus, Shield, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { z } from 'zod';
import logo from '@/assets/logo.png';

const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    fullName: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = loginSchema.safeParse(loginData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(loginData.email, loginData.password);
    
    if (error) {
      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid email or password.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Welcome back! 👋',
        description: 'You have been logged in successfully.',
      });
      navigate('/');
    }
    
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = signupSchema.safeParse(signupData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(signupData.email, signupData.password, signupData.fullName);
    
    if (error) {
      let message = error.message;
      if (message.includes('already registered')) {
        message = 'This email is already registered. Please sign in instead.';
      }
      toast({
        title: 'Sign Up Failed',
        description: message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Account Created! 🎉',
        description: 'Welcome to Civiscope! You are now logged in.',
      });
      navigate('/');
    }
    
    setIsLoading(false);
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-primary/10">
            <CardHeader className="text-center pb-2">
              <motion.div 
                className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                animate={{ 
                  boxShadow: ['0 0 20px rgba(var(--primary), 0.3)', '0 0 40px rgba(var(--primary), 0.5)', '0 0 20px rgba(var(--primary), 0.3)']
                }}
                transition={{ boxShadow: { duration: 2, repeat: Infinity } }}
              >
                <img src={logo} alt="Civiscope Logo" className="w-full h-full object-cover" />
              </motion.div>
              <CardTitle className="font-display text-2xl">Welcome to Civiscope</CardTitle>
              <CardDescription>
                Sign in to your account or create a new one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login" className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                
                <AnimatePresence mode="wait">
                  <TabsContent value="login" asChild>
                    <motion.form
                      key="login"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onSubmit={handleLogin}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="Enter your email"
                            value={loginData.email}
                            onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                            className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                          />
                        </div>
                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={loginData.password}
                            onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                            className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                      </div>

                      <Button
                        type="submit"
                        className="w-full primary-gradient"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <LogIn className="w-4 h-4 mr-2" />
                            Sign In
                          </>
                        )}
                      </Button>
                    </motion.form>
                  </TabsContent>
                  
                  <TabsContent value="signup" asChild>
                    <motion.form
                      key="signup"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleSignup}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="signup-name"
                            placeholder="Enter your full name"
                            value={signupData.fullName}
                            onChange={(e) => setSignupData(prev => ({ ...prev, fullName: e.target.value }))}
                            className={`pl-10 ${errors.fullName ? 'border-destructive' : ''}`}
                          />
                        </div>
                        {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="Enter your email"
                            value={signupData.email}
                            onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                            className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                          />
                        </div>
                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="signup-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a password"
                            value={signupData.password}
                            onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                            className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="signup-confirm"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            value={signupData.confirmPassword}
                            onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className={`pl-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                          />
                        </div>
                        {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                      </div>

                      <Button
                        type="submit"
                        className="w-full primary-gradient"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Create Account
                          </>
                        )}
                      </Button>
                    </motion.form>
                  </TabsContent>
                </AnimatePresence>
              </Tabs>
              
              {/* Admin Portal Link */}
              <div className="mt-6 pt-6 border-t border-border/50">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">Are you an administrator?</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-primary/30 hover:bg-primary/10 hover:border-primary transition-all"
                    onClick={() => navigate('/admin-login')}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Go to Admin Portal Login
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}
