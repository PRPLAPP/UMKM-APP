import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion } from 'motion/react';

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 rounded-full border border-accent">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary">Empowering Communities</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-tight">
                Empowering Villages Through Digital Connection
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                A community platform for villagers, MSMEs, and admins to collaborate, 
                promote, and grow the local economy.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="gap-2">
                  Join Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </a>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl">500+</div>
                <div className="text-sm text-muted-foreground">Villages Connected</div>
              </div>
              <div>
                <div className="text-3xl">2,000+</div>
                <div className="text-sm text-muted-foreground">Local Businesses</div>
              </div>
              <div>
                <div className="text-3xl">10K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden border border-border shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1760292424045-6c3669699efd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWxsYWdlJTIwY29tbXVuaXR5JTIwZGlnaXRhbHxlbnwxfHx8fDE3NjMwMjMxNzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Village community connecting digitally"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating Cards */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -left-4 top-1/4 bg-card border border-border rounded-2xl p-4 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm">Community Growth</div>
                  <div className="text-lg text-primary">+45%</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -right-4 bottom-1/4 bg-card border border-border rounded-2xl p-4 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-accent/20 rounded-xl flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm">Economic Impact</div>
                  <div className="text-lg text-primary">$2.5M+</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
