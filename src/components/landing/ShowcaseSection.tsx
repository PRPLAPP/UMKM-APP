import React from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion } from 'motion/react';
import { useI18n } from '../../i18n';

const screenshots = [
  {
    title: 'Villager Dashboard',
    description: 'Easy access to community updates and local businesses',
    image: 'https://images.unsplash.com/photo-1748609160056-7b95f30041f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXNoYm9hcmQlMjBhbmFseXRpY3MlMjBtb2Rlcm58ZW58MXx8fHwxNzYyOTc3NjA2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    title: 'MSME Store Management',
    description: 'Powerful tools to manage products and track sales',
    image: 'https://images.unsplash.com/photo-1737913785137-c2a957ae7565?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJrZXRwbGFjZSUyMGxvY2FsJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzYzMDIzMTc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    title: 'Admin Analytics',
    description: 'Comprehensive insights into village economy and growth',
    image: 'https://images.unsplash.com/photo-1576267423048-15c0040fec78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMGhhcHB5fGVufDF8fHx8MTc2Mjk4OTA3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

export default function ShowcaseSection() {
  const { t } = useI18n();
  return (
    <section id="showcase" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl mb-4">{t('showcaseHeading')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('showcaseSub')}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {screenshots.map((screenshot, index) => (
            <motion.div
              key={screenshot.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="space-y-4">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-border shadow-md group-hover:shadow-xl transition-shadow">
                  <ImageWithFallback
                    src={screenshot.image}
                    alt={screenshot.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h3 className="text-lg mb-1">{screenshot.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {screenshot.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
