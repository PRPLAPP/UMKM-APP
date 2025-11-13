import React from 'react';
import { Users, Store, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { motion } from 'motion/react';

const features = [
  {
    icon: Users,
    title: 'For Villagers',
    description: 'Connect with your community, discover local businesses, stay updated with village news and events, and participate in community discussions.',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    icon: Store,
    title: 'For MSMEs',
    description: 'Showcase your products and services, reach local customers, manage orders efficiently, and grow your business with data-driven insights.',
    color: 'bg-green-500/10 text-green-600 dark:text-green-400',
  },
  {
    icon: ShieldCheck,
    title: 'For Admins',
    description: 'Monitor village activities, verify businesses, manage community data, track economic growth, and make informed decisions.',
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl mb-4">Built for Everyone in the Village</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three powerful dashboards designed for different roles in your community
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow border-border/50">
                <CardContent className="p-8 space-y-4">
                  <div className={`inline-flex p-3 rounded-2xl ${feature.color}`}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
