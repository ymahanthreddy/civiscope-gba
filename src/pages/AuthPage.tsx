import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { LogIn, UserPlus, Shield, Eye, EyeOff, Mail, Lock, User, Wrench, Phone, Briefcase } from 'lucide-react';
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

const workerSchema = z.object({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  department: z.string().min(1, 'Select a department'),
  phone: z.string().optional(),
  specialization: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const DEPARTMENTS = [
  'Roads & Infrastructure',
  'Waste Management',
  'Drainage & Sewage',
  'Electrical & Streetlights',
  'Parks & Gardens',
  'Animal Control',
  'General Maintenance',
];

export default function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [workerData, setWorkerData] = useState({ fullName: '', email: '', password: '', confirmPassword: '', department: '', phone: '', specialization: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = loginSchema.safeParse(loginData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => { if (err.path[0]) fieldErrors[err.path[0] as string] = err.message; });
      setErrors(fieldErrors);
      return;
    }
    setIsLoading(true);
    const { error } = await signIn(loginData.email, loginData.password);
    if (error) {
      toast({ title: 'Login Failed', description: error.message || 'Invalid email or password.', variant: 'destructive' });
    } else {
      toast({ title: 'Welcome back! 👋', description: 'You have been logged in successfully.' });
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
      result.error.errors.forEach((err) => { if (err.path[0]) fieldErrors[err.path[0] as string] = err.message; });
      setErrors(fieldErrors);
      return;
    }
    setIsLoading(true);
    const { error } = await signUp(signupData.email, signupData.password, signupData.fullName);
    if (error) {
      toast({ title: 'Sign Up Failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Account Created! 🎉', description: 'Welcome to Civiscope!' });
      navigate('/');
    }
    setIsLoading(false);
  };

  const handleWorkerSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = workerSchema.safeParse(workerData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => { if (err.path[0]) fieldErrors[err.path[0] as string] = err.message; });
      setErrors(fieldErrors);
      return;
    }
    setIsLoading(true);
    
    // Sign up the user first
    const { error: signUpError } = await signUp(workerData.email, workerData.password, workerData.fullName);
    if (signUpError) {
      toast({ title: 'Sign Up Failed', description: signUpError.message, variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    // Wait for session
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      // Create worker profile
      const { error: wpError } = await supabase.from('worker_profiles').insert({
        user_id: session.user.id,
        full_name: workerData.fullName,
        phone: workerData.phone || null,
        skills: workerData.department ? [workerData.department] : [],
      });

      if (wpError) {
        console.error('Worker profile error:', wpError);
      }
    }

    toast({ 
      title: 'Application Submitted! 🎉', 
      description: 'Your worker application is pending admin approval. You\'ll get access once approved.' 
    });
    navigate('/');
    setIsLoading(false);
  };

  const PasswordField = ({ id, value, onChange, placeholder, error: fieldError }: any) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{id.includes('confirm') ? 'Confirm Password' : 'Password'}</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input id={id} type={showPassword ? 'text' : 'password'} placeholder={placeholder}
          value={value} onChange={onChange} className={`pl-10 pr-10 ${fieldError ? 'border-destructive' : ''}`} />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {fieldError && <p className="text-sm text-destructive">{fieldError}</p>}
    </div>
  );

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Card className="shadow-2xl border-primary/10">
            <CardHeader className="text-center pb-2">
              <motion.div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}>
                <img src={logo} alt="Civiscope Logo" className="w-full h-full object-cover" />
              </motion.div>
              <CardTitle className="font-display text-2xl">Welcome to Civiscope</CardTitle>
              <CardDescription>Sign in, create an account, or join as a worker</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="login" className="flex items-center gap-1 text-xs">
                    <LogIn className="w-3 h-3" />Sign In
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="flex items-center gap-1 text-xs">
                    <UserPlus className="w-3 h-3" />Citizen
                  </TabsTrigger>
                  <TabsTrigger value="worker" className="flex items-center gap-1 text-xs">
                    <Wrench className="w-3 h-3" />Worker
                  </TabsTrigger>
                </TabsList>
                
                <AnimatePresence mode="wait">
                  <TabsContent value="login" asChild>
                    <motion.form key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                      onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input id="login-email" type="email" placeholder="Enter your email"
                            value={loginData.email} onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                            className={`pl-10 ${errors.email ? 'border-destructive' : ''}`} />
                        </div>
                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                      </div>
                      <PasswordField id="login-password" value={loginData.password} placeholder="Enter your password"
                        onChange={(e: any) => setLoginData(prev => ({ ...prev, password: e.target.value }))} error={errors.password} />
                      <Button type="submit" className="w-full primary-gradient" disabled={isLoading}>
                        {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><LogIn className="w-4 h-4 mr-2" />Sign In</>}
                      </Button>
                    </motion.form>
                  </TabsContent>

                  <TabsContent value="signup" asChild>
                    <motion.form key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input placeholder="Enter your full name" value={signupData.fullName}
                            onChange={(e) => setSignupData(prev => ({ ...prev, fullName: e.target.value }))}
                            className={`pl-10 ${errors.fullName ? 'border-destructive' : ''}`} />
                        </div>
                        {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input type="email" placeholder="Enter your email" value={signupData.email}
                            onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                            className={`pl-10 ${errors.email ? 'border-destructive' : ''}`} />
                        </div>
                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                      </div>
                      <PasswordField id="signup-password" value={signupData.password} placeholder="Create a password"
                        onChange={(e: any) => setSignupData(prev => ({ ...prev, password: e.target.value }))} error={errors.password} />
                      <PasswordField id="signup-confirm" value={signupData.confirmPassword} placeholder="Confirm password"
                        onChange={(e: any) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))} error={errors.confirmPassword} />
                      <Button type="submit" className="w-full primary-gradient" disabled={isLoading}>
                        {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><UserPlus className="w-4 h-4 mr-2" />Create Citizen Account</>}
                      </Button>
                    </motion.form>
                  </TabsContent>

                  <TabsContent value="worker" asChild>
                    <motion.form key="worker" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleWorkerSignup} className="space-y-3">
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 text-xs text-amber-700 dark:text-amber-400">
                        <Wrench className="w-3 h-3 inline mr-1" />
                        Worker accounts require admin approval before access is granted.
                      </div>
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input placeholder="Your full name" value={workerData.fullName}
                            onChange={(e) => setWorkerData(prev => ({ ...prev, fullName: e.target.value }))}
                            className={`pl-10 ${errors.fullName ? 'border-destructive' : ''}`} />
                        </div>
                        {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input type="email" placeholder="Work email" value={workerData.email}
                            onChange={(e) => setWorkerData(prev => ({ ...prev, email: e.target.value }))}
                            className={`pl-10 ${errors.email ? 'border-destructive' : ''}`} />
                        </div>
                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Department *</Label>
                        <Select value={workerData.department} onValueChange={(v) => setWorkerData(prev => ({ ...prev, department: v }))}>
                          <SelectTrigger className={`bg-background ${errors.department ? 'border-destructive' : ''}`}>
                            <Briefcase className="w-4 h-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        {errors.department && <p className="text-sm text-destructive">{errors.department}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Phone (Optional)</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input placeholder="Phone number" value={workerData.phone}
                            onChange={(e) => setWorkerData(prev => ({ ...prev, phone: e.target.value }))} className="pl-10" />
                        </div>
                      </div>
                      <PasswordField id="worker-password" value={workerData.password} placeholder="Create a password"
                        onChange={(e: any) => setWorkerData(prev => ({ ...prev, password: e.target.value }))} error={errors.password} />
                      <PasswordField id="worker-confirm" value={workerData.confirmPassword} placeholder="Confirm password"
                        onChange={(e: any) => setWorkerData(prev => ({ ...prev, confirmPassword: e.target.value }))} error={errors.confirmPassword} />
                      <Button type="submit" className="w-full primary-gradient" disabled={isLoading}>
                        {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Wrench className="w-4 h-4 mr-2" />Apply as Worker</>}
                      </Button>
                    </motion.form>
                  </TabsContent>
                </AnimatePresence>
              </Tabs>
              
              <div className="mt-6 pt-6 border-t border-border/50 text-center">
                <p className="text-sm text-muted-foreground mb-3">Are you an administrator?</p>
                <Button variant="outline" size="sm" className="w-full border-primary/30 hover:bg-primary/10"
                  onClick={() => navigate('/admin-login')}>
                  <Shield className="w-4 h-4 mr-2" />Go to Admin Portal Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}
