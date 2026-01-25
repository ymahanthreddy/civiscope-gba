import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Koramangala Resident',
    content: 'Reported a pothole issue and it was fixed within 48 hours! The tracking feature kept me updated throughout.',
    rating: 5,
    avatar: '👩‍💼',
  },
  {
    name: 'Rajesh Kumar',
    role: 'HSR Layout',
    content: 'Finally a platform that actually works. The garbage collection issue I reported was resolved the very next day.',
    rating: 5,
    avatar: '👨‍💻',
  },
  {
    name: 'Anita Menon',
    role: 'Indiranagar',
    content: 'The streetlight in our lane was fixed within a week of reporting. Great transparency in the process!',
    rating: 5,
    avatar: '👩‍🏫',
  },
  {
    name: 'Mohammed Ali',
    role: 'Whitefield',
    content: 'As a community leader, I appreciate how Civiscope helps us track multiple issues across our neighborhood.',
    rating: 5,
    avatar: '👨‍⚖️',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-b from-muted/50 to-background">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full opacity-30">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-primary/20 rounded-full" />
        <div className="absolute top-40 right-20 w-12 h-12 border-2 border-accent/20 rounded-lg rotate-45" />
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border-2 border-info/20 rounded-full" />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
            <Quote className="w-4 h-4" />
            <span className="text-sm font-medium">What Citizens Say</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Trusted by <span className="text-gradient">Thousands</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real stories from citizens who experienced the transformation
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="glass-card rounded-2xl p-6 h-full relative">
                {/* Quote icon */}
                <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
