'use client';

import Link from 'next/link';
import { signOut } from '@/lib/actions/auth';
import { User } from '@supabase/supabase-js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AuthButton({ user }: { user?: User | null }) {
  if (user) {
    const initials = user.email ? user.email.substring(0, 2).toUpperCase() : 'MW';
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-10 h-10 rounded-full bg-secondary/50 hover:bg-secondary border border-border/50 flex items-center justify-center text-xs tracking-wider text-secondary-foreground font-mono transition-all duration-300 outline-none focus-visible:ring-1 focus-visible:ring-primary/50 cursor-pointer">
            {initials}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-card/80 backdrop-blur-xl border-border/50 rounded-xl shadow-2xl mt-2">
          <DropdownMenuLabel className="font-mono text-xs tracking-wider text-muted-foreground">My Account</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border/50" />
          <DropdownMenuItem asChild className="text-xs tracking-widest uppercase cursor-pointer hover:bg-white/5 focus:bg-white/5 transition-colors focus:text-foreground">
            <Link href="/profile">View Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="text-xs tracking-widest uppercase cursor-pointer hover:bg-white/5 focus:bg-white/5 transition-colors focus:text-foreground">
            <Link href="/profile#settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border/50" />
          <DropdownMenuItem 
            className="text-xs tracking-widest uppercase cursor-pointer hover:bg-destructive/10 focus:bg-destructive/10 text-destructive focus:text-destructive transition-colors" 
            onClick={() => signOut()}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Link
      href="/login"
      className="text-xs tracking-[0.1em] uppercase text-foreground hover:text-primary transition-colors duration-300"
    >
      Sign In
    </Link>
  );
}
