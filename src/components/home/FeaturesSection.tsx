import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Send, 
  Search, 
  BarChart3, 
  Bell, 
  Shield, 
  Zap,
  MessageSquare,
  MapPin,
  Clock,
  ArrowRight
} from 'lucide-react';

const features = [
  {
    icon: Send,
    title: 'Easy Reporting',
    description: 'Report civic issues in under 2 minutes without any registration or login',
    gradient: 'from-blue-500 to-cyan-500',
    delay: 0,
    link: '/report',
  },
  {
    icon: Search,
    title: 'Track in Real-Time',
    description: 'Monitor your issue status from reported to resolved with live updates',
    gradient: 'from-violet-500 to-purple-500',
    delay: 0.1,
    link: '/track',
  },
  {
    icon: BarChart3,
    title: 'Data-Driven',
    description: 'Powerful analytics help officials prioritize and resolve issues faster',
    gradient: 'from-emerald-500 to-green-500',
    delay: 0.2,
    link: '/admin-login',
  },
  {
    icon: Bell,
    title: 'Instant Alerts',
    description: 'Get notified when your issue status changes via email or SMS',
    gradient: 'from-orange-500 to-amber-500',
    delay: 0.3,
    link: '/auth',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is protected with enterprise-grade security measures',
    gradient: 'from-rose-500 to-pink-500',
    delay: 0.4,
    link: '/auth',
  },
  {
    icon: Zap,
    title: 'AI-Powered',
    description: 'Smart categorization and routing ensures issues reach the right department',
    gradient: 'from-yellow-500 to-orange-500',
    delay: 0.5,
    link: '/report',
  },
];

const workflow = [
  { step: 1, title: 'Report', icon: MessageSquare, description: 'Submit your civic issue' },
  { step: 2, title: 'Assign', icon: MapPin, description: 'Routed to the right team' },
  { step: 3, title: 'Resolve', icon: Clock, description: 'Issue gets fixed on time' },
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden bg-muted/30">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Floating gradient orbs */}
      <motion.div
        animate={{ 
          x: [0, 50, 0], 
          y: [0, -30, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/10 blur-3xl"
      />
      <motion.div
        animate={{ 
          x: [0, -40, 0], 
          y: [0, 40, 0],
          scale: [1, 1.3, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-20 right-[15%] w-72 h-72 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/10 blur-3xl"
      />
      <motion.div
        animate={{ 
          x: [0, 30, -30, 0], 
          y: [0, -20, 20, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 blur-3xl"
      />

      {/* Animated shapes */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute top-32 right-[20%] w-24 h-24 border-2 border-primary/20 rounded-xl"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-32 left-[15%] w-16 h-16 border-2 border-accent/20 rounded-full"
      />

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Why Choose <span className="text-gradient">Civiscope</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A powerful platform designed to bridge the gap between citizens and city officials
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {features.map((feature, i) => (
            <Link key={feature.title} to={feature.link}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay, type: 'spring' }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group cursor-pointer h-full"
              >
                <div className="glass-card rounded-2xl p-6 h-full relative overflow-hidden">
                  {/* Hover gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {feature.description}
                  </p>

                  {/* Learn more link */}
                  <div className="flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>

                  {/* Decorative corner */}
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-bl-full`} />
                  
                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Workflow Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="font-display text-3xl font-bold mb-4">
            How It <span className="text-gradient-rainbow">Works</span>
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Simple, transparent, and effective — from complaint to closure
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4">
          {workflow.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="flex items-center gap-4"
            >
              <div className="flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-3 shadow-xl"
                >
                  <item.icon className="w-10 h-10 text-white" />
                </motion.div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Step {item.step}</p>
                  <p className="font-bold text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
              
              {/* Arrow connector */}
              {i < workflow.length - 1 && (
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="hidden md:block text-primary text-2xl font-bold"
                >
                  →
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
