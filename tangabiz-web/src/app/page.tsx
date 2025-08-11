import CTA from "@/components/landing/CTA";
import Features from "@/components/landing/Features";
import Header from "@/components/landing/Header";
import HowItWorks from "@/components/landing/HowItWorks";
import PricingSection from "@/components/landing/pricing";
import Footer from "@/components/landing/shared/footer";
import WhoItsFor from "@/components/landing/WhoItsFor";

export default function LandingPage () {
  return (
    <>
      <Header />
      <HowItWorks />
      <Features />
      <WhoItsFor />
      <PricingSection />
      <CTA />
      <Footer />
    </>
  )
}