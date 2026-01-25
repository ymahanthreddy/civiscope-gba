import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { StatsSection } from '@/components/home/StatsSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { MapSection } from '@/components/home/MapSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { CTASection } from '@/components/home/CTASection';
import { LiveIssuesSection } from '@/components/home/LiveIssuesSection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <CategoriesSection />
      <LiveIssuesSection />
      <MapSection />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
