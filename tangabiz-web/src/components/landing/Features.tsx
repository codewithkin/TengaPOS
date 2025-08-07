"use client";

import { motion } from "framer-motion";
import img from "next/image";

export default function Features() {
  return (
    <section className="w-full py-20 px-4 sm:px-8 md:px-20 bg-gray-50">
      <motion.div
        className="max-w-6xl mx-auto flex flex-col items-center gap-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        {/* Heading */}
        <motion.div
          className="flex flex-col items-center text-center gap-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold">
            Built for everyday businesses in Zimbabwe
          </h2>
          <p className="text-gray-500 max-w-2xl text-sm sm:text-base">
            These aren’t just features—they’re the exact tools you need to run your shop smoothly, securely, and without stress.
          </p>
        </motion.div>

        {/* Feature Bentos */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 w-full"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.2 },
            },
          }}
        >
          {/* 1. Smart Inventory Management */}
          <motion.div
            className="col-span-1 sm:col-span-2 lg:col-span-3 bg-slate-100 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <img src="/features/dash.jpg" alt="Smart Inventory" className="rounded-md justify-self-center self-center h-100 w-100 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Keep track of all your stock</h3>
            <p className="text-sm text-gray-600">
              Know exactly what’s in your shop, what’s low, and what needs restocking—so you never disappoint a customer.
            </p>
          </motion.div>

          {/* 2. Customer Tracking */}
          <motion.div
            className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-3 bg-slate-100 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <img src="/features/customers.jpg" alt="Customer Tracking" className="rounded-md justify-self-center self-center h-100 w-100mb-4" />
            <h3 className="text-xl font-semibold mb-2">Know your customers</h3>
            <p className="text-sm text-gray-600">
              See who buys from you, how often, and how much they owe you. Build trust and know who your loyal buyers are.
            </p>
          </motion.div>

          {/* 3. Sales Tracking */}
          <motion.div
            className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-2 bg-slate-100 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <img src="/features/sales.jpg" alt="Sales Tracking" className="rounded-md justify-self-center self-center h-100 w-100 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Track every sale</h3>
            <p className="text-sm text-gray-600">
              Every sale is recorded and saved. No more guessing what you sold yesterday—just check.
            </p>
          </motion.div>

          {/* 4. Automatic Inventory Updates */}
          <motion.div
            className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-4 bg-slate-100 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <img src="/features/shopping_items.jpg" alt="Auto Inventory Update" className="rounded-md justify-self-center self-center h-100 w-100 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Stock updates itself</h3>
            <p className="text-sm text-gray-600">
              Every time you make a sale, your stock is updated automatically. Less work for you, less room for error.
            </p>
          </motion.div>

          {/* 5. Real-Time Reporting */}
          <motion.div
            className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-4 bg-slate-100 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <img src="/features/dash.jpg" alt="Business Reports" className="rounded-md justify-self-center self-center h-100 w-100 mb-4" />
            <h3 className="text-xl font-semibold mb-2">See how your business is doing</h3>
            <p className="text-sm text-gray-600">
              Get clear summaries of your profit, sales, and expenses. Know what’s working and what’s not—at a glance.
            </p>
          </motion.div>

          {/* 6. Digital Data Storage */}
          <motion.div
            className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2 bg-slate-100 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <img src="/features/receipt_details.jpg" alt="Secure Cloud Storage" className="rounded-md justify-self-center self-center h-100 w-100 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your records are always safe</h3>
            <p className="text-sm text-gray-600">
              Even if your phone is stolen or damaged, your data stays safe in the cloud. You can’t lose it, break it, or erase it by mistake.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
