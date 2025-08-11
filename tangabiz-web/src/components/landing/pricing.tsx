"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: "Starter",
      monthly: 9.99,
      yearly: 9.99 * 12 * 0.75, // 25% off
      receipts: "1,000 receipts/month",
      customers: "Up to 500 customers",
      features: [
        "Basic sales tracking",
        "Basic inventory management",
        "Real-time updates",
        "Email support",
      ],
      advanced: false,
    },
    {
      name: "Business",
      monthly: 14.99,
      yearly: 14.99 * 12 * 0.8, // 20% off
      receipts: "5,000 receipts/month",
      customers: "Up to 1,000 customers",
      features: [
        "AI chat support",
        "AI report generation",
        "CSV file downloads",
        "Priority email support",
      ],
      advanced: true,
    },
    {
      name: "Pro",
      monthly: 29.99,
      yearly: 29.99 * 12 * 0.75, // 25% off
      receipts: "Unlimited receipts",
      customers: "Unlimited customers",
      features: [
        "AI chat support",
        "AI report generation",
        "CSV file downloads",
        "Priority phone + email support",
      ],
      advanced: true,
    },
  ];

  return (
    <section className="py-20 px-6 bg-gray-50" id="pricing">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-4"
        >
          Affordable Pricing for Every Business
        </motion.h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose a plan that fits your needs. Save more with yearly billing.
        </p>

        {/* Billing Toggle */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <span className={billingCycle === "monthly" ? "font-semibold" : "text-gray-500"}>
            Monthly
          </span>
          <button
            onClick={() =>
              setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")
            }
            className="relative w-14 h-8 bg-blue-200 rounded-full p-1 flex items-center"
          >
            <motion.div
              layout
              className="w-6 h-6 bg-blue-500 rounded-full"
              animate={{ x: billingCycle === "yearly" ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
          <span className={billingCycle === "yearly" ? "font-semibold" : "text-gray-500"}>
            Yearly <span className="text-sm text-green-600">(Save more)</span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, idx) => {
          const price =
            billingCycle === "monthly" ? plan.monthly : plan.yearly.toFixed(2);
          const isYearly = billingCycle === "yearly";

          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.5 }}
              className={`rounded-2xl shadow-lg p-6 flex flex-col ${
                idx === 1 ? "bg-blue-50 border-2 border-blue-400" : "bg-white"
              }`}
            >
              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
              <p className="text-4xl font-bold mb-2">
                ${price}
                <span className="text-lg font-normal text-gray-500">
                  /{billingCycle === "monthly" ? "mo" : "yr"}
                </span>
              </p>
              {isYearly && (
                <p className="text-sm text-green-600 mb-4">Billed yearly</p>
              )}

              <div className="mb-6 space-y-1">
                <p className="text-gray-700">{plan.receipts}</p>
                <p className="text-gray-700">{plan.customers}</p>
              </div>
              
              <Button disabled={true} size="lg" className="text-white w-full">
                Coming soon
              </Button>

              <ul className="flex-1 space-y-3 mt-6">
                {plan.advanced
                  ? plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="text-green-500 w-5 h-5" />
                        <span>{feature}</span>
                      </li>
                    ))
                  : [
                      "Basic sales tracking",
                      "Basic inventory management",
                      "Real-time updates",
                      "Email support",
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="text-green-500 w-5 h-5" />
                        <span>{feature}</span>
                      </li>
                    ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}