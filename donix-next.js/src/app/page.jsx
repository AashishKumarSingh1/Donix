"use client"
import React from 'react'
import { useTheme } from 'next-themes'
import Navbar from "../components/common/Navbar"
import Footer from '../components/common/Footer'
import Hero from '../components/landing/Hero'
import WhyChooseDonix from '../components/landing/WhyChoseDonix'
import HowItWorks from '../components/landing/HowItWorks'
import Numbers from '../components/landing/Numbers'
import FAQ from '../components/landing/Faq'
import ChatBot from '../components/common/ChatBot'
function Page() {
  const {resolvedTheme}=useTheme()
  const darkMode = resolvedTheme === "dark"
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode  ? "bg-gradient-to-b dark:from-black dark:to-gray-900 text-white" : "bg-white text-gray-900"
    }`}>
      <Navbar />
      {/* It'z Donix */}
      <Hero />
      <WhyChooseDonix />
      <HowItWorks darkMode={darkMode} />
      <Numbers darkMode={darkMode} />
      <FAQ isDarkMode={darkMode} />
      <Footer darkMode={darkMode} />
      <ChatBot />
    </div>
  )
}

export default Page
