'use client';

import { useLanguage } from './context/LanguageContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Schedule from './components/Schedule';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function Home() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 font-sans">
      <Header />
      <Hero />
        {/* EPR Intro Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8" id="epr">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                {t('eprIntroTitle')}
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {t('eprIntroSubtitle')}
              </p>
              <div className="mt-6">
                <a
                  href="/about#epr"
                  className="inline-flex items-center px-5 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  {t('eprLearnMore')}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur opacity-20"></div>
              <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-emerald-100 bg-white">
                <img
                  src="/ART%20Register%20resize.jpg"
                  alt="EPR Illustration"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        <Schedule />
        <Contact />
        
        {/* Banner Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 to-teal-50">
          <div className="max-w-7xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img 
                src="/ART%20Register%20resize.jpg" 
                alt="EPR Banner" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
  );
}
