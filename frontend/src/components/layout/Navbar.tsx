'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart, Heart, Search, User } from 'lucide-react';
import { useTheme } from 'next-themes';

/**
 * Navigation Bar Component
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="text-2xl md:text-3xl font-bold tracking-tight">
          VEL<span className="text-accent">B</span>ERS
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/products" className="hover:text-accent transition">
            Shop
          </Link>
          <Link href="/categories" className="hover:text-accent transition">
            Categories
          </Link>
          <Link href="/about" className="hover:text-accent transition">
            About
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition">
            <Heart className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition">
            <ShoppingCart className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition">
            <User className="w-5 h-5" />
          </button>
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          )}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 p-4 space-y-4">
          <Link href="/products" className="block hover:text-accent transition">
            Shop
          </Link>
          <Link href="/categories" className="block hover:text-accent transition">
            Categories
          </Link>
          <Link href="/about" className="block hover:text-accent transition">
            About
          </Link>
        </div>
      )}
    </nav>
  );
}
