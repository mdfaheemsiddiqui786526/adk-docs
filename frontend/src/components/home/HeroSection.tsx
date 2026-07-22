'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Hero Section Component
 */
export default function HeroSection() {
  return (
    <section className="relative h-screen md:h-96 bg-gradient-to-r from-slate-900 to-slate-800 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <Image
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80"
          alt="Hero"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="container relative h-full flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl text-white"
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Premium Shoes for Every Moment
          </motion.h1>
          <motion.p
            className="text-xl mb-8 text-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Discover our curated collection of luxury footwear inspired by global fashion leaders.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link
              href="/products"
              className="inline-block bg-accent text-black px-8 py-3 rounded-md font-semibold hover:bg-yellow-400 transition"
            >
              Shop Now
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
