"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="w-full bg-slate-200 px-6 py-20 md:px-20" id="download">
      <motion.div
        className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        {/* Text Content */}
        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Ready to simplify your business?
          </h2>

          <p className="text-gray-600 text-lg">
            Download the TangaBiz mobile app to manage sales, customers, and stock – wherever you are. Built with Zimbabwean businesses in mind.
          </p>

          <Button
            asChild
            className="bg-green-600 hover:bg-green-700 w-fit flex items-center gap-2"
          >
            <Link
              href="https://expo.dev/artifacts/eas/goiKqtKVWn8xQWbhUcZ8qE.apk"
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              <Image
                src="/icons/android.png"
                alt="Android"
                width={18}
                height={18}
              />
              Download for Android
            </Link>
          </Button>
        </motion.div>

        {/* Screenshot or Mockup */}
        <motion.div
          className="w-full flex justify-center md:justify-end"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="rounded-xl overflow-hidden shadow-xl border border-gray-200">
            <Image
              src="/screenshots/app-screenshot.png"
              alt="TangaBiz App Screenshot"
              width={1200}
              height={1200}
              className="w-full h-auto object-cover"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}