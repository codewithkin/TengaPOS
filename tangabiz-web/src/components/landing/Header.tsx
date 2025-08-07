"use client";

import Image from "next/image";
import Navbar from "./shared/Navbar";
import { Button } from "../ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Header() {
  return (
    <header className="flex min-h-screen w-full bg-white relative flex-col gap-12 justify-center items-center overflow-hidden">
      <Navbar />

      {/* Dual Gradient Overlay Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(229,231,235,0.8) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(229,231,235,0.8) 1px, transparent 1px),
            radial-gradient(circle 500px at 20% 80%, rgba(139,92,246,0.3), transparent),
            radial-gradient(circle 500px at 80% 20%, rgba(59,130,246,0.3), transparent)
          `,
          backgroundSize: "48px 48px, 48px 48px, 100% 100%, 100% 100%",
        }}
      />

      {/* Text content */}
      <motion.article
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex px-4 sm:px-8 md:px-20 py-24 md:py-30 flex-col gap-4 items-center justify-center z-10"
      >
        <motion.article
          variants={fadeInUp}
          className="flex justify-center items-center flex-col gap-2"
        >
          <h2 className="text-center text-5xl md:text-7xl font-bold mb-2">
            Smart tools for modern{" "}
            <span className="text-yellow-500">Zimbabwean</span> businesses
          </h2>
        </motion.article>

        <motion.p
          variants={fadeInUp}
          className="text-center max-w-4xl text-gray-400 font-normal text-sm"
        >
          From tracking inventory to managing customers and recording sales,
          TangaBiz gives you everything you need to run and grow your
          business—all in one place.
        </motion.p>

        <motion.article
          variants={fadeInUp}
          className="flex flex-col w-full md:flex-row items-center justify-center gap-4"
        >
          <Button className="bg-green-600 hover:bg-green-700" asChild>
            <Link
              href="https://expo.dev/artifacts/eas/goiKqtKVWn8xQWbhUcZ8qE.apk"
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              <Image
                src="/icons/android.png"
                alt=" logo"
                width={18}
                height={18}
              />
              Download Android App
            </Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/features">View features</Link>
          </Button>
        </motion.article>
      </motion.article>

      {/* Product image (mobile app preview) */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1.5 }}
        className="z-10"
      >
        <Image
          width={300}
          height={300}
          src="/images/showcases/main.png"
          alt="Main app showcase"
        />
      </motion.div>
    </header>
  );
}