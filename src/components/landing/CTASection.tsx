import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useI18n } from '../../i18n';

export default function CTASection() {
  const { t } = useI18n();
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-primary to-accent rounded-3xl p-12 text-center space-y-6 shadow-xl"
        >
          <h2 className="text-3xl sm:text-4xl text-white">{t('ctaTitle')}</h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">{t('ctaDesc')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="gap-2">
                {t('getStartedFree')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                {t('signIn')}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
