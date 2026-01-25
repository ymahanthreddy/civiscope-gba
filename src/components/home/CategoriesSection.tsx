import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { CATEGORY_CONFIG } from '@/lib/constants';

const categories = Object.entries(CATEGORY_CONFIG).map(([key, config]) => ({
  key,
  ...config,
}));

export function CategoriesSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/30" />
      <div className="absolute top-1/3 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Report <span className="text-gradient">Any Issue</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From overflowing garbage to broken streetlights — we handle it all
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-12">
          {categories.map((category, i) => (
            <motion.div
              key={category.key}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring' }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="group cursor-pointer"
            >
              <Link to="/report">
                <div className="glass-card rounded-2xl p-6 text-center relative overflow-hidden h-full">
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 category-${category.key} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                  
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    className="text-5xl mb-4 inline-block"
                  >
                    {category.icon}
                  </motion.div>

                  {/* Label */}
                  <h3 className="font-bold text-foreground text-sm md:text-base">
                    {category.label}
                  </h3>

                  {/* Shimmer effect */}
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/report">
            <Button size="lg" className="primary-gradient text-lg px-8 py-6 group">
              Report an Issue Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
