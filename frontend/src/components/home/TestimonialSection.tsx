'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Arjun Kumar',
    role: 'Product Designer',
    content: 'VELBERS shoes are absolutely premium. The quality and comfort are unmatched.',
    rating: 5,
    avatar: '👨‍💼',
  },
  {
    name: 'Priya Singh',
    role: 'Entrepreneur',
    content: 'Finally found shoes that are both stylish and comfortable for my daily wear.',
    rating: 5,
    avatar: '👩‍💼',
  },
  {
    name: 'Rohan Patel',
    role: 'Athlete',
    content: 'The running shoes from VELBERS are perfect for my workouts. Highly recommend!',
    rating: 5,
    avatar: '🏃',
  },
];

/**
 * Testimonial Section Component
 */
export default function TestimonialSection() {
  return (
    <section className="container py-24 bg-slate-50 dark:bg-slate-900/50 -mx-4 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold mb-12 text-center">What Our Customers Say</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="card p-6"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">"{testimonial.content}"</p>
              <div className="flex items-center gap-4">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
