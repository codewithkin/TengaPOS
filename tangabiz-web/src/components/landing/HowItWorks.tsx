"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  PackageCheck,
  ShoppingCart,
  RefreshCcw,
  BarChartBig,
} from "lucide-react";

const steps = [
  {
    title: "Add Your Products",
    description:
      "List every product you sell once — add names, prices, and current stock. No paperwork, no stress.",
    icon: PackageCheck,
  },
  {
    title: "Record Each Sale",
    description:
      "Each time you sell something, just tap to record. It takes seconds and updates everything instantly.",
    icon: ShoppingCart,
  },
  {
    title: "Inventory Updates Automatically",
    description:
      "Your stock count adjusts every time you sell, so you always know exactly what’s available.",
    icon: RefreshCcw,
  },
  {
    title: "View Daily & Weekly Reports",
    description:
      "See totals for the day or week, what’s sold best, and how much you made — all without doing the math.",
    icon: BarChartBig,
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold"
        >
          How It Works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-gray-600 mt-4 max-w-xl mx-auto"
        >
          TangaBiz is built to be simple — just follow these quick steps and you’ll be running a smarter business from day one.
        </motion.p>
      </div>

      {/* Timeline container */}
      <div className="relative grid grid-cols-9 gap-4 max-w-5xl mx-auto">
        {/* Vertical line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 bg-blue-500 h-full z-0 rounded" />

        {steps.map((step, i) => {
          const isLeft = i % 2 === 0;
          const Icon = step.icon;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                "col-span-9 md:col-span-4 p-6 border border-gray-200 rounded-xl shadow-md relative z-10 group transition-all duration-300",
                isLeft ? "md:col-start-1 text-right" : "md:col-start-6 text-left",
                i % 2 !== 0 && "bg-blue-50"
              )}
            >
              {/* Step number badge */}
              <div
                className={cn(
                  "absolute top-0 w-10 h-10 text-white font-bold text-lg flex items-center justify-center rounded-full shadow-md bg-blue-500 z-20",
                  isLeft
                    ? "right-[-25px] md:right-[-32px]"
                    : "left-[-25px] md:left-[-32px]"
                )}
              >
                {i + 1}
              </div>

              <Icon className="w-6 h-6 mb-3 mx-auto md:mx-0 text-blue-600" />

              <h3 className="text-lg font-semibold text-blue-600">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{step.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}