import React from 'react';
import { UserPlus, Search, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useI18n } from '../../i18n';

const steps = (t: (k: string) => string) => [
  {
    icon: UserPlus,
    title: t('step1Title'),
    description: t('step1Desc'),
    step: '01',
  },
  {
    icon: Search,
    title: t('step2Title'),
    description: t('step2Desc'),
    step: '02',
  },
  {
    icon: TrendingUp,
    title: t('step3Title'),
    description: t('step3Desc'),
    step: '03',
  },
];

export default function HowItWorksSection() {
  const { t } = useI18n();
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl mb-4">{t('howHeading')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('howSub')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-20 left-1/4 right-1/4 h-0.5 bg-border" />

          {steps(t).map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              <div className="text-center space-y-4">
                {/* Step Number */}
                <div className="inline-flex items-center justify-center">
                  <div className="relative">
                    <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center border-2 border-primary/20 relative z-10 bg-background">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm z-20">
                      {step.step}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
