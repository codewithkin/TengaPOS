"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react"; // You can replace this icon
import { useState } from "react";

type link = {
  title: string;
  href: string;
};

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links: link[] = [
    { title: "Home", href: "/" },
    { title: "Features", href: "/features" },
    { title: "Pricing", href: "/pricing" },
    { title: "Contact", href: "/contact" },
    { title: "About", href: "/about" },
  ];

  const path = usePathname();

  return (
    <motion.nav
      className="flex z-10 justify-between items-center border-b border-gray-300 py-4 md:justify-center px-4 md:gap-18 lg:gap-28 w-full"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
    >
      {/* Brand */}
      <motion.h1
        className="font-bold text-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Tanga<span className="text-blue-500 font-bold">Biz</span>
      </motion.h1>

      {/* Desktop Links */}
      <motion.div
        className="hidden md:flex justify-center items-center gap-4 lg:gap-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {links.map((link, index) => (
          <motion.div
            key={link.title}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <Link
              className={
                path === link.href
                  ? "text-blue-500 font-semibold text-md"
                  : "text-gray-600 text-sm"
              }
              href={link.href}
            >
              {link.title}
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Button (always visible) */}
      <motion.div
        className="hidden md:block"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <Button className="bg-green-600 hover:bg-green-700" asChild>
          <Link
            href="https://expo.dev/artifacts/eas/goiKqtKVWn8xQWbhUcZ8qE.apk"
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            <Image src="/icons/android.png" alt=" logo" width={18} height={18} />
            Download App
          </Link>
        </Button>
      </motion.div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button className="bg-blue-500 hover:text-white text-white hover:bg-blue-700" variant="outline" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-4">
            <div className="flex flex-col gap-6 mt-8">
              <SheetTitle className="text-xl font-bold">Tanga<span className="text-blue-500">Biz</span></SheetTitle>
              {links.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className={`${
                    path === link.href
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700"
                  } text-base`}
                  onClick={() => setOpen(false)}
                >
                  {link.title}
                </Link>
              ))}
              <article className="w-full flex flex-col gap-2 items-center justify-center">
              <Button
                className="bg-green-600 hover:bg-green-700 mt-4 w-full"
                size="lg"
                asChild
              >
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
                  Download App
                </Link>
              </Button>
              <Button
                className="w-full"
                size="lg"
                variant="secondary"
                asChild
              >
                <Link
                  href="https://expo.dev/artifacts/eas/goiKqtKVWn8xQWbhUcZ8qE.apk"
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  View Features
                </Link>
              </Button>
              </article>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.nav>
  );
}