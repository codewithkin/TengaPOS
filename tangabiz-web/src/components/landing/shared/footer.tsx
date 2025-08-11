import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-200 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Tangabiz</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            Your all in one business management platform built for Zimbabwean SMEs.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:transition hover:text-slate-600 hover:font-medium transition duration-300">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:transition hover:text-slate-600 hover:font-medium transition duration-300">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:transition hover:text-slate-600 hover:font-medium transition duration-300">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <Link href="https://x.com/codewithkin" className="hover:transition">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="www.linkedin.com/in/kinzinzombe-183022239" className="hover:transition">
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        {currentYear} Tangabiz
      </div>
    </footer>
  );
}