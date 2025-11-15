import React from 'react';
import { Mountain, Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Mountain className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl">Karya Desa</span>
            </div>
            <p className="text-sm text-muted-foreground">{t('footerTagline')}</p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm mb-4">{t('product')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#features" className="hover:text-foreground transition-colors">
                  {t('features')}
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-foreground transition-colors">
                  {t('howItWorks')}
                </a>
              </li>
              <li>
                <a href="#showcase" className="hover:text-foreground transition-colors">
                  {t('showcase')}
                </a>
              </li>
              <li>
                <Link to="/register" className="hover:text-foreground transition-colors">
                  {t('getStarted')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm mb-4">{t('company')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  {t('aboutUs')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  {t('contact')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  {t('privacyPolicy')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  {t('termsOfService')}
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm mb-4">{t('connect')}</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="h-9 w-9 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"
              >
                <Facebook className="h-4 w-4 text-muted-foreground" />
              </a>
              <a
                href="#"
                className="h-9 w-9 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"
              >
                <Twitter className="h-4 w-4 text-muted-foreground" />
              </a>
              <a
                href="#"
                className="h-9 w-9 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"
              >
                <Instagram className="h-4 w-4 text-muted-foreground" />
              </a>
              <a
                href="#"
                className="h-9 w-9 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"
              >
                <Mail className="h-4 w-4 text-muted-foreground" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
