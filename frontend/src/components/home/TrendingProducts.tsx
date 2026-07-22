'use client';

import { motion } from 'framer-motion';

/**
 * Trending Products Component
 */
export default function TrendingProducts() {
  return (
    <section className="container py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold mb-12">Trending Now</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Placeholder for trending products */}
          <p className="text-gray-500">Trending products will be displayed here</p>
        </div>
      </motion.div>
    </section>
  );
}
