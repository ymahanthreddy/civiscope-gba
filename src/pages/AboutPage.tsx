import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Users, Target, Heart, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import member1Image from '@/assets/member1.jpg';
import member2Image from '@/assets/member2.jpg';
import member3Image from '@/assets/member3.jpg';

const teamMembers = [
  {
    id: 1,
    name: 'Naman Gupta',
    role: 'Grade 11',
    image: member1Image,
  },
  {
    id: 2,
    name: 'Mahanth Reddy',
    role: 'Grade 8',
    image: member2Image,
  },
  {
    id: 3,
    name: 'Dhruva Mandavilli',
    role: 'Grade 10',
    image: member3Image,
  },
];

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

export default function AboutPage() {
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

      {/* Values Section */}
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

      {/* Meet the Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Meet the Team</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The passionate individuals behind Civiscope working to make your city better
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Card className="overflow-hidden bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                  <CardContent className="p-0">
                    {/* Photo Container */}
                    <div className="aspect-square bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center relative overflow-hidden">
                      {member.image ? (
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                            <Users className="w-12 h-12 text-muted-foreground/50" />
                          </div>
                          <p className="text-sm text-muted-foreground">Photo coming soon</p>
                        </div>
                      )}
                      {/* Decorative gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    {/* Info */}
                    <div className="p-6 text-center">
                      <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-muted-foreground">{member.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Join Us in Building a Better City
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Together, we can create more responsive, transparent, and efficient urban communities.
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
