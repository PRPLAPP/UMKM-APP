import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Mountain } from 'lucide-react';
import { Button } from '../ui/button';
import ThemeToggle from '../ThemeToggle';
import { useI18n } from '../../i18n';

export default function NavigationBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { t, lang, setLang } = useI18n();

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <Mountain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl">Karya Desa</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              {t('features')}
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              {t('howItWorks')}
            </a>
            <a href="#showcase" className="text-muted-foreground hover:text-foreground transition-colors">
              {t('showcase')}
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              {t('testimonials')}
            </a>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <select
              aria-label="Language"
              value={lang}
              onChange={(e) => setLang(e.target.value as 'en' | 'id')}
              className="bg-transparent border border-border rounded px-2 py-1 text-sm"
            >
              <option value="en">EN</option>
              <option value="id">ID</option>
            </select>
            <Link to="/login">
              <Button variant="ghost">{t('signIn')}</Button>
            </Link>
            <Link to="/register">
              <Button>{t('getStarted')}</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-3">
            <a
              href="#features"
              className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('features')}
            </a>
            <a
              href="#how-it-works"
              className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('howItWorks')}
            </a>
            <a
              href="#showcase"
              className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('showcase')}
            </a>
            <a
              href="#testimonials"
              className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('testimonials')}
            </a>
            <div className="pt-3 space-y-2">
              <div className="px-2">
                <select
                  aria-label="Language"
                  value={lang}
                  onChange={(e) => setLang(e.target.value as 'en' | 'id')}
                  className="w-full bg-transparent border border-border rounded px-2 py-1 text-sm"
                >
                  <option value="en">English</option>
                  <option value="id">Bahasa</option>
                </select>
              </div>
              <Link to="/login" className="block">
                <Button variant="outline" className="w-full">{t('signIn')}</Button>
              </Link>
              <Link to="/register" className="block">
                <Button className="w-full">{t('getStarted')}</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
