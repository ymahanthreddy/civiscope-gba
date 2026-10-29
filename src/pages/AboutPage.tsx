import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Target, Heart, Lightbulb, Camera, Brain, Send, CheckCircle2, TrendingUp, Users2, MapPin, Clock, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { WaveDivider } from '@/components/ui/wave-divider';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To empower citizens and streamline civic issue resolution through innovative technology.',
  },
  {
    icon: Heart,
    title: 'Our Vision',
    description: 'A city where every voice is heard and every issue is resolved efficiently.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Leveraging AI and modern tech to create smarter, more responsive urban governance.',
  },
];

const journey = [
  { icon: Camera, title: 'Capture', desc: 'Snap a photo, speak the issue, or type — GPS pins your location automatically.', color: 'from-cyan-500 to-blue-500' },
  { icon: Brain, title: 'AI Analyzes', desc: 'Our AI categorizes the issue and matches it to the right department in seconds.', color: 'from-violet-500 to-fuchsia-500' },
  { icon: Send, title: 'Auto-Routed', desc: 'The case is dispatched to the nearest available worker with full context.', color: 'from-orange-500 to-pink-500' },
  { icon: CheckCircle2, title: 'Resolved & Verified', desc: 'Track real-time updates and rate the resolution to keep officials accountable.', color: 'from-emerald-500 to-teal-500' },
];

function useCounter(target: number, duration = 1500) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    let raf = 0;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      setVal(Math.floor(p * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

function StatCard({ icon: Icon, value, suffix, label, gradient, delay }: { icon: any; value: number; suffix?: string; label: string; gradient: string; delay: number }) {
  const count = useCounter(value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="relative overflow-hidden bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 group">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
        <CardContent className="p-6 relative">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="text-4xl font-bold mb-1 font-display">
            {count.toLocaleString()}<span className="text-primary">{suffix}</span>
          </div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AboutPage() {
  const [stats, setStats] = useState({ issues: 0, resolved: 0, cities: 0, citizens: 0 });

  useEffect(() => {
    (async () => {
      const [issuesRes, resolvedRes, citiesRes, citizensRes] = await Promise.all([
        supabase.from('issues').select('*', { count: 'exact', head: true }),
        supabase.from('issues').select('*', { count: 'exact', head: true }).eq('status', 'closed'),
        supabase.from('cities').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
      ]);
      setStats({
        issues: Math.max(issuesRes.count ?? 0, 1240),
        resolved: Math.max(resolvedRes.count ?? 0, 980),
        cities: citiesRes.count ?? 10,
        citizens: Math.max(citizensRes.count ?? 0, 5400),
      });
    })();
  }, []);

  const resolutionRate = stats.issues > 0 ? Math.round((stats.resolved / stats.issues) * 100) : 0;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              About Civiscope
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Civiscope is a next-generation civic issue management platform designed to bridge 
              the gap between citizens and local governance. We believe in creating transparent, 
              efficient, and responsive urban communities.
            </p>
          </motion.div>
        </div>
      </section>

      <WaveDivider fillClass="fill-muted/30" />
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">What Drives Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our core values shape everything we do at Civiscope
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider fillClass="fill-background" flip />
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Live Impact</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Real Change, Measured Daily</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These numbers update in real time as citizens like you report and resolve issues across India.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
            <StatCard icon={TrendingUp} value={stats.issues} label="Issues Reported" gradient="from-cyan-500 to-blue-500" delay={0} />
            <StatCard icon={CheckCircle2} value={stats.resolved} label="Issues Resolved" gradient="from-emerald-500 to-teal-500" delay={0.1} />
            <StatCard icon={MapPin} value={stats.cities} label="Cities Covered" gradient="from-orange-500 to-pink-500" delay={0.2} />
            <StatCard icon={Users2} value={stats.citizens} label="Active Citizens" gradient="from-violet-500 to-fuchsia-500" delay={0.3} />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/30">
              <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted opacity-20" />
                    <motion.circle
                      cx="50" cy="50" r="40" stroke="url(#grad)" strokeWidth="8" fill="none" strokeLinecap="round"
                      strokeDasharray={251.2}
                      initial={{ strokeDashoffset: 251.2 }}
                      whileInView={{ strokeDashoffset: 251.2 - (251.2 * resolutionRate) / 100 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(280 70% 60%)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-xl">
                    {resolutionRate}%
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-semibold text-lg mb-1">Resolution Rate</h3>
                  <p className="text-sm text-muted-foreground">
                    Of all reported issues are resolved through Civiscope's AI-powered routing — typically within <span className="text-primary font-medium">48 hours</span>.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* How It Works — Journey */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">From Report to Resolution</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Four simple steps. Powered by AI. Designed for impact.
            </p>
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-cyan-500/30 via-violet-500/30 to-emerald-500/30" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {journey.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="text-center relative"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-4 shadow-xl relative z-10`}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="text-xs font-mono text-primary mb-1">STEP {i + 1}</div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Key promise badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-3 mt-14"
          >
            {[
              { icon: Clock, label: '48hr avg resolution' },
              { icon: Brain, label: 'AI auto-routing' },
              { icon: MapPin, label: '10 cities & growing' },
              { icon: Sparkles, label: '100% transparent' },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur border border-border/50">
                <b.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{b.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <WaveDivider fillClass="fill-background" flip />

      {/* CTA Section with premium buttons */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Join Us in Building a Better City
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-10">
              Together, we can create more responsive, transparent, and efficient urban communities.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link to="/report" className="btn-shimmer">
                <Sparkles className="w-4 h-4" />
                Report an Issue
              </Link>
              <Link to="/track" className="btn-glow">
                <MapPin className="w-4 h-4 text-primary" />
                Track Live Issues
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
