import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Mountain, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import ThemeToggle from '../ThemeToggle';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    // Demo password reset
    toast.success('Password reset link sent to your email!');
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-muted/30">
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
            <CardTitle>Forgot Password?</CardTitle>
            <CardDescription>
              {isSubmitted
                ? "Check your email for reset instructions"
                : "We'll send you a reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Send Reset Link
                </Button>

                <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-primary hover:underline">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </Link>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg bg-accent/20 border border-accent p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    We've sent a password reset link to <strong>{email}</strong>.
                    Please check your inbox and follow the instructions.
                  </p>
                </div>

                <Link to="/login" className="block">
                  <Button className="w-full">
                    Return to Sign In
                  </Button>
                </Link>

                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    toast.success('Reset link sent again!');
                  }}
                  className="w-full text-sm text-primary hover:underline"
                >
                  Didn't receive the email? Resend
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
