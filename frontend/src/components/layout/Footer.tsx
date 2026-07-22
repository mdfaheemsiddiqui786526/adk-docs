'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

/**
 * Footer Component
 */
export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-black text-white mt-24">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              VEL<span className="text-accent">B</span>ERS
            </h3>
            <p className="text-gray-400 mb-6">
              Premium shoes crafted for perfection. Experience luxury, comfort, and style.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-accent transition">Facebook</a>
              <a href="#" className="hover:text-accent transition">Instagram</a>
              <a href="#" className="hover:text-accent transition">Twitter</a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/products" className="hover:text-accent transition">All Products</Link></li>
              <li><Link href="/products?type=new" className="hover:text-accent transition">New Arrivals</Link></li>
              <li><Link href="/products?type=bestsellers" className="hover:text-accent transition">Bestsellers</Link></li>
              <li><Link href="/products?type=sale" className="hover:text-accent transition">Sale</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-accent transition">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-accent transition">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-accent transition">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+918800000000" className="hover:text-accent transition">+91 8800000000</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:support@velbers.com" className="hover:text-accent transition">support@velbers.com</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Mumbai, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 VELBERS. All rights reserved.
            </p>
            <div className="flex gap-6 text-gray-400 text-sm">
              <Link href="/privacy" className="hover:text-accent transition">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-accent transition">Terms of Service</Link>
              <Link href="/returns" className="hover:text-accent transition">Returns</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
