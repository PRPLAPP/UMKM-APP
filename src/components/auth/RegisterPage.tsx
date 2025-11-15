import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Mountain, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ThemeToggle from '../ThemeToggle';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useAuth } from '@/hooks/useAuth';
import { useI18n } from '../../i18n';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'villager' as 'villager' | 'msme' | 'admin',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { register, authLoading } = useAuth();
  const { t } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error(t('pleaseFillAllFields'));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    try {
      const user = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      toast.success(`Account created successfully! Welcome, ${user.name}.`);
      navigate(`/dashboard/${user.role}`);
    } catch (error) {
      toast.error('Unable to create account', {
        description: error instanceof Error ? error.message : 'Please try again.'
      });
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
                <Mountain className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl">Karya Desa</span>
            </Link>
            <ThemeToggle />
          </div>

          <Card>
              <CardHeader>
                <CardTitle>{t('createAccount')}</CardTitle>
                <CardDescription>{t('createAccountDesc')}</CardDescription>
              </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>I am a</Label>
                  <RadioGroup
                    value={formData.role}
                    onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                    className="grid grid-cols-3 gap-3"
                  >
                    <div>
                      <RadioGroupItem value="villager" id="villager" className="peer sr-only" />
                      <Label
                        htmlFor="villager"
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        {t('featureVillagersTitle')}
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="msme" id="msme" className="peer sr-only" />
                      <Label
                        htmlFor="msme"
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        MSME
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="admin" id="admin" className="peer sr-only" />
                      <Label
                        htmlFor="admin"
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        Admin
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={authLoading}>
                  {authLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('creatingAccount')}
                    </>
                  ) : (
                    t('createAccount')
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  {t('alreadyHaveAccount')}{' '}
                  <Link to="/login" className="text-primary hover:underline">
                    {t('signIn')}
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex items-center justify-center bg-muted/30 p-8">
        <div className="max-w-lg space-y-6">
          <div className="aspect-square rounded-3xl overflow-hidden border border-border shadow-2xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1760292424045-6c3669699efd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWxsYWdlJTIwY29tbXVuaXR5JTIwZGlnaXRhbHxlbnwxfHx8fDE3NjMwMjMxNzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Register illustration"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl">Start Your Journey</h3>
            <p className="text-muted-foreground">
              Become part of a thriving digital village ecosystem
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
