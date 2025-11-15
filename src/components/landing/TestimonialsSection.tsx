import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Star } from 'lucide-react';
import { motion } from 'motion/react';
import { useI18n } from '../../i18n';

const testimonials = [
  {
    name: 'Budi Santoso',
    role: 'Local Business Owner',
    content: 'Karya Desa has transformed how I connect with customers in my village. My sales have increased by 60% since joining!',
    rating: 5,
    initials: 'BS',
  },
  {
    name: 'Siti Nurhaliza',
    role: 'Village Admin',
    content: 'The admin dashboard makes it so easy to track village activities and economic growth. A game-changer for community management.',
    rating: 5,
    initials: 'SN',
  },
  {
    name: 'Ahmad Rizki',
    role: 'Community Member',
    content: 'I love how easy it is to stay updated with village news and discover local businesses. The platform is intuitive and helpful.',
    rating: 5,
    initials: 'AR',
  },
];

export default function TestimonialsSection() {
  const { t } = useI18n();
  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl mb-4">{t('testimonialsHeading')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('testimonialsSub')}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full border-border/50 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  {/* Rating */}
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-muted-foreground leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-2">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
