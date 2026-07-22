'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { Providers } from './providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CategoriesSection from '@/components/home/CategoriesSection';
import TrendingProducts from '@/components/home/TrendingProducts';
import TestimonialSection from '@/components/home/TestimonialSection';

export default function Home() {
  return (
    <Providers>
      <main className="min-h-screen bg-white dark:bg-slate-950">
        <Navbar />
        <HeroSection />
        <FeaturedProducts />
        <CategoriesSection />
        <TrendingProducts />
        <TestimonialSection />
        <Footer />
      </main>
    </Providers>
  );
}
