'use client';

import { useState } from 'react';
import { logIn, signUp } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    const action = isSignUp ? signUp : logIn;
    const res = await action(formData);
    if (res?.error) {
      setError(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md p-8 bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif tracking-[0.1em] text-foreground mb-2">
            {isSignUp ? 'CREATE ACCOUNT' : 'WELCOME BACK'}
          </h1>
          <p className="text-sm text-muted-foreground tracking-widest uppercase">
            Media<span className="text-primary">World</span>
          </p>
        </div>

        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="bg-background/50 border-border/50 focus:border-primary/50 text-foreground h-12 transition-all duration-300"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="bg-background/50 border-border/50 focus:border-primary/50 text-foreground h-12 transition-all duration-300"
            />
          </div>

          {error && (
            <div className="text-sm text-destructive text-center p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 tracking-[0.1em] uppercase text-primary-foreground bg-primary hover:bg-primary/90 transition-all duration-300 mt-4"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors tracking-wide"
          >
            {isSignUp ? 'Already have an account? Sign in' : 'New to MediaWorld? Create an account'}
          </button>
        </div>
      </div>
    </div>
  );
}
