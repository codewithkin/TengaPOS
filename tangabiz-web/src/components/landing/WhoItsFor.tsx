"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { Phone, ShoppingBag, Store, Pill, Hammer, Scissors, ArrowRight } from "lucide-react";

const businesses = [
  {
    icon: Phone,
    title: "Mobile Shop Owners",
    description:
      "Track every phone and accessory you sell — no paperwork needed. Know what’s in stock, what’s selling fast, and what to restock.",
    cta: "Run your phone shop smarter",
  },
  {
    icon: ShoppingBag,
    title: "Clothing Retailers",
    description:
      "Effortlessly log each sale and update your inventory. Save time daily and never lose track of what sizes or items are left.",
    cta: "Take control of your clothing stock",
  },
  {
    icon: Store,
    title: "Grocery Store Managers",
    description:
      "Track sales as they happen, even on your busiest days. Automatically update inventory and get totals without writing anything down.",
    cta: "Make grocery sales stress-free",
  },
  {
    icon: Pill,
    title: "Pharmacy Owners",
    description:
      "Log each medicine sale instantly and keep tabs on stock levels. Avoid overstocking or running out of critical meds.",
    cta: "Stay in control of your dispensary",
  },
  {
    icon: Hammer,
    title: "Hardware Store Operators",
    description:
      "Manage bolts to bricks with ease. Know what items move fast and never lose a sale to missing stock again.",
    cta: "Organize your hardware like a pro",
  },
  {
    icon: Scissors,
    title: "Salon & Beauty Parlours",
    description:
      "Track product sales like hair oils, shampoos, and styling items. Easily manage what's in stock and what's selling out.",
    cta: "Run your beauty business better",
  },
];

export default function WhoItsFor() {
  return (
    <section className="w-full py-20 bg-gray-50 px-6 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold">Who It’s For</h2>
        <p className="mt-4 text-gray-600 text-lg">
          TangaBiz was built for small business owners who want to sell faster,
          track better, and never lose a sale.
        </p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {businesses.map((biz, index) => {
          const Icon = biz.icon;
          return (
            <motion.div
              key={biz.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.10 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white shadow-md rounded-2xl p-6 flex flex-col justify-between border"
            >
              <div>
                  <div className="p-4 w-fit mb-4 bg-blue-100 rounded-full">
                    <Icon strokeWidth={1.5} className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl mb-2 font-semibold">{biz.title}</h3>
                <p className="text-gray-600 text-sm">{biz.description}</p>
              </div>
              
                <Link
                  href="https://expo.dev/artifacts/eas/goiKqtKVWn8xQWbhUcZ8qE.apk"
                  className="mt-6 w-full font-semibold text-green-600 hover:text-green-700 text-sm flex items-center gap-2 hover:gap-4 transition-all duration-500"
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  {biz.cta} <ArrowRight className="w-4 h-4" />
                </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}