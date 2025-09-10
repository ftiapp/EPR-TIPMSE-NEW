'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="home" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 scroll-mt-24 md:scroll-mt-28">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Main Title */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
                {t('heroTitle')}
              </span>
              <br />
              <span className="text-gray-700 text-3xl md:text-5xl">
                {t('heroSubtitle')}
              </span>
            </h1>
          </motion.div>

          {/* Event Details */}
          <motion.div variants={itemVariants} className="mb-12">
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-200/50"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('date')}</h3>
                <p className="text-gray-600">{t('eventDate')}</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-200/50"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('time')}</h3>
                <p className="text-gray-600">{t('eventTime')}</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-200/50"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('location')}</h3>
                <p className="text-gray-600 text-sm whitespace-pre-line">{t('eventLocation')}</p>
              </motion.div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.a
              href="/register"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 inline-block"
            >
              {t('register')}
            </motion.a>
            <motion.a
              href="#schedule"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-emerald-500 text-emerald-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-emerald-50 transition-all duration-300"
            >
{t('viewSchedule')}
            </motion.a>
          </motion.div>

          {/* Floating Elements - Optimized for mobile */}
          <div className="absolute top-40 md:top-36 left-4 md:left-10 opacity-10 md:opacity-15">
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 4, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-8 h-10 md:w-12 md:h-16 transform scale-[2]"
            >
              {/* Bottle Shape */}
              <svg viewBox="0 0 64 80" className="w-full h-full">
                <defs>
                  <linearGradient id="bottleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
                {/* Bottle neck */}
                <rect x="26" y="0" width="12" height="15" fill="url(#bottleGradient)" rx="2" />
                {/* Bottle body */}
                <path d="M18 15 Q18 12 20 12 L44 12 Q46 12 46 15 L46 70 Q46 75 41 75 L23 75 Q18 75 18 70 Z" fill="url(#bottleGradient)" />
              </svg>
            </motion.div>
          </div>
          
          <div className="absolute top-24 right-4 md:right-16 opacity-10 md:opacity-15">
            <motion.div
              animate={{
                y: [0, 15, 0],
                rotate: [0, -4, 0]
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="w-6 h-8 md:w-10 md:h-14 transform scale-[2]"
            >
              {/* Can Shape */}
              <svg viewBox="0 0 48 64" className="w-full h-full">
                <defs>
                  <linearGradient id="canGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
                {/* Can body */}
                <rect x="8" y="4" width="32" height="56" fill="url(#canGradient)" rx="16" />
                {/* Can top */}
                <ellipse cx="24" cy="4" rx="16" ry="4" fill="url(#canGradient)" />
                {/* Can bottom */}
                <ellipse cx="24" cy="60" rx="16" ry="4" fill="url(#canGradient)" />
              </svg>
            </motion.div>
          </div>
          
          <div className="absolute bottom-32 left-6 md:left-1/4 opacity-10 md:opacity-15">
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotate: [0, 3, 0]
              }}
              transition={{
                duration: 4.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="w-8 h-8 md:w-12 md:h-12 transform scale-[2]"
            >
              {/* Box Shape */}
              <svg viewBox="0 0 56 56" className="w-full h-full">
                <defs>
                  <linearGradient id="boxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                </defs>
                {/* Box body */}
                <rect x="4" y="8" width="48" height="44" fill="url(#boxGradient)" rx="4" />
                {/* Box top flaps */}
                <path d="M4 8 L28 4 L52 8 L52 16 L4 16 Z" fill="url(#boxGradient)" />
                <path d="M20 4 L20 0 L36 0 L36 4" fill="url(#boxGradient)" />
              </svg>
            </motion.div>
          </div>
          
          <div className="absolute bottom-20 right-6 md:right-20 opacity-10 md:opacity-15">
            <motion.div
              animate={{
                y: [0, -18, 0],
                rotate: [0, -5, 0]
              }}
              transition={{
                duration: 3.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5
              }}
              className="w-7 h-9 md:w-11 md:h-15 transform scale-[2]"
            >
              {/* Glass Jar Shape */}
              <svg viewBox="0 0 44 60" className="w-full h-full">
                <defs>
                  <linearGradient id="jarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#16a34a" />
                  </linearGradient>
                </defs>
                {/* Jar body */}
                <path d="M8 12 Q8 8 12 8 L32 8 Q36 8 36 12 L36 50 Q36 56 30 56 L14 56 Q8 56 8 50 Z" fill="url(#jarGradient)" />
                {/* Jar lid */}
                <rect x="6" y="4" width="32" height="8" fill="url(#jarGradient)" rx="4" />
                {/* Jar rim */}
                <rect x="10" y="8" width="24" height="4" fill="url(#jarGradient)" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}