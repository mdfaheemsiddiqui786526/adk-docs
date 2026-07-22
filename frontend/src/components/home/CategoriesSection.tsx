'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const categories = [
  { name: 'Running Shoes', slug: 'running-shoes', icon: '🏃' },
  { name: 'Casual Shoes', slug: 'casual-shoes', icon: '👟' },
  { name: 'Sports Shoes', slug: 'sports-shoes', icon: '⚽' },
  { name: 'Formal Shoes', slug: 'formal-shoes', icon: '👞' },
  { name: 'Sneakers', slug: 'sneakers', icon: '✨' },
];

/**
 * Categories Section Component
 */
export default function CategoriesSection() {
  return (
    <section className="container py-24 bg-slate-50 dark:bg-slate-900/50 -mx-4 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold mb-12 text-center">Browse by Category</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {categories.map((category, i) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/products?category=${category.slug}`}>
                <div className="card p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="text-5xl mb-4">{category.icon}</div>
                  <h3 className="font-semibold">{category.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
