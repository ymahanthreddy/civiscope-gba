import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, LogIn, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@civiscope.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Try to sign in first
    let { error } = await signIn(email, password);

    if (error) {
      // Try signing up if login fails
      const signUpResult = await signUp(email, password, 'Admin');
      
      if (signUpResult.error && !signUpResult.error.message.includes('already registered')) {
        toast({
          title: 'Login Failed',
          description: signUpResult.error.message || 'Please try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      // Try signing in again after signup
      const retryResult = await signIn(email, password);
      if (retryResult.error) {
        toast({
          title: 'Login Failed',
          description: 'Please try again in a moment.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
    }

    // Update the user's role to admin
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Update existing role to admin
      await supabase.from('user_roles').update({ role: 'admin' }).eq('user_id', user.id);
    }

    toast({
      title: 'Welcome, Admin!',
      description: 'Redirecting to admin portal...',
    });
    
    // Force reload to refresh auth context with new role
    window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-primary/20 shadow-2xl backdrop-blur-sm bg-card/95">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
            <CardDescription>CiviScope Administration Access</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@civiscope.com"
                  className="bg-background/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-background/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <p className="font-medium text-foreground mb-1">Default Credentials:</p>
                <p className="text-muted-foreground">Email: admin@civiscope.com</p>
                <p className="text-muted-foreground">Password: admin123</p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In to Admin Portal
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/auth')}
                className="text-muted-foreground"
              >
                ← Back to Citizen Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
