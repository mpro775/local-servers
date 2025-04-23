"use client";

import HeroSection from "@/components/homePage/HeroSection";
import CategoriesSection from "@/components/homePage/CategoriesSection";
import ServicesSection from "@/components/homePage/ServicesSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-gray-50">
      
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <ServicesSection />
      </main>

    </div>
  );
}