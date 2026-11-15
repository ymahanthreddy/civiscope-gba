import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  BrainCircuit,
  Camera,
  CheckCircle2,
  HeartHandshake,
  MapPin,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UsersRound,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import cityImage from '@/assets/hero-city.jpg';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const values = [
  {
    icon: Target,
    title: 'Make every report count',
    description: 'Give residents a clear way to share local problems and keep an eye on what happens next.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: ShieldCheck,
    title: 'Build trust through visibility',
    description: 'A shared issue lifecycle makes progress easier to follow for citizens and officials alike.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: HeartHandshake,
    title: 'Put people at the center',
    description: 'Connect community concerns with the teams responsible for responding to them.',
    color: 'from-orange-500 to-pink-500',
  },
];

const steps = [
  { icon: Camera, title: 'Report', description: 'Describe the issue, choose its area, and attach a photo if helpful.' },
  { icon: BrainCircuit, title: 'Route', description: 'The issue enters a workflow for review, assignment, and action.' },
  { icon: MessageSquareText, title: 'Follow progress', description: 'Use your tracking ID to check updates as the report moves forward.' },
  { icon: CheckCircle2, title: 'Close the loop', description: 'See when work is marked complete and share feedback on the outcome.' },
];

function useImpactStats() {
  const [stats, setStats] = useState({ issues: 0, resolved: 0 });

  useEffect(() => {
    let active = true;

    const loadStats = async () => {
      const [issuesResult, resolvedResult] = await Promise.all([
        supabase.from('issues').select('*', { count: 'exact', head: true }),
        supabase.from('issues').select('*', { count: 'exact', head: true }).eq('status', 'closed'),
      ]);

      if (active) {
        setStats({
          issues: issuesResult.count ?? 0,
          resolved: resolvedResult.count ?? 0,
        });
      }
    };

    void loadStats();
    return () => {
      active = false;
    };
  }, []);

  return stats;
}

export default function AboutPage() {
  const stats = useImpactStats();
  const resolutionRate = stats.issues > 0 ? Math.round((stats.resolved / stats.issues) * 100) : 0;

  return (
    <Layout>
      <section className="relative isolate overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-20 bg-muted/40" />
        <div className="absolute inset-y-0 right-0 -z-10 hidden w-[58%] bg-gradient-to-l from-primary/10 via-secondary/10 to-transparent lg:block" />
        <div className="container mx-auto grid min-h-[540px] items-center gap-12 px-4 py-16 md:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-2xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 border-l-2 border-primary pl-3 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" /> A clearer path from concern to action
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Better cities begin with <span className="text-primary">being heard.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Civiscope brings civic reporting, issue tracking, and response workflows together—so local concerns are easier to raise and easier to follow.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-6">
                <Link to="/report">Report an issue <ArrowRight aria-hidden="true" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-6">
                <Link to="/track">Track a report <MapPin aria-hidden="true" /></Link>
              </Button>
            </div>
            <a href="#how-it-works" className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Explore how it works <ArrowDown className="h-4 w-4" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="relative mx-auto w-full max-w-xl"
          >
            <div className="overflow-hidden rounded-md border border-border/60 shadow-xl">
              <img src={cityImage} alt="Illustrated city with civic issue reporting and infrastructure data" className="aspect-[1.15/1] w-full object-cover" />
            </div>
            <div className="absolute -bottom-5 left-4 flex items-center gap-3 border border-border/60 bg-background/95 px-4 py-3 shadow-lg sm:left-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UsersRound className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">A shared civic space</p>
                <p className="text-xs text-muted-foreground">Residents · officials · workers</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase text-primary">What guides us</p>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">Technology should make civic action feel human.</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">We focus on practical tools that help communities communicate clearly and make progress visible.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Card className="h-full overflow-hidden border-border/70 bg-card transition-transform duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br ${value.color} text-primary-foreground`}>
                      <value.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{value.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-muted/30 py-14">
        <div className="container mx-auto grid gap-8 px-4 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase text-primary">Civiscope in numbers</p>
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">Progress starts with a report.</h2>
            <p className="mt-2 max-w-xl text-muted-foreground">Live totals from issues currently visible to the platform.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="min-w-32 border-l-2 border-primary bg-background px-4 py-3">
              <TrendingUp className="mb-2 h-5 w-5 text-primary" />
              <p className="text-3xl font-bold tabular-nums text-foreground">{stats.issues.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Issues reported</p>
            </div>
            <div className="min-w-32 border-l-2 border-emerald-500 bg-background px-4 py-3">
              <CheckCircle2 className="mb-2 h-5 w-5 text-emerald-600" />
              <p className="text-3xl font-bold tabular-nums text-foreground">{resolutionRate}%</p>
              <p className="text-sm text-muted-foreground">Marked resolved</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase text-primary">One connected journey</p>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">From the street to a clear update.</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">A straightforward path keeps each report organized from the first detail to the final outcome.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.09, duration: 0.4 }}
                className="relative border-t-2 border-primary/30 pt-5"
              >
                <span className="absolute -top-3 left-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{index + 1}</span>
                <step.icon className="mb-4 h-6 w-6 text-primary" />
                <h3 className="font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-primary/5 py-14 md:py-16">
        <div className="container mx-auto flex flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">Your neighborhood has a voice.</h2>
            <p className="mt-2 text-muted-foreground">Help turn a local concern into a report that can be followed through.</p>
          </div>
          <Button asChild size="lg" className="shrink-0">
            <Link to="/report">Start a report <ArrowRight aria-hidden="true" /></Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}