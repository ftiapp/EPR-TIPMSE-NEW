'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 to-teal-50 scroll-mt-24 md:scroll-mt-28">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {t('contactTitle')}
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            {t('contactSubtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex justify-center"
        >
          {/* Contact Person */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-emerald-200/50 max-w-md"
          >
            <div className="text-center">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </motion.div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('contactPerson')}</h3>
              <div className="space-y-3">
                <p className="text-lg font-semibold text-emerald-700">
                  พรพิมล นวลพลกรัง
                </p>
                
                <div className="space-y-2">
                  <motion.a
                    href="tel:023451289"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>02 345 1289</span>
                  </motion.a>
                  
                  <motion.a
                    href="tel:0854962156"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>085 496 2156</span>
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-emerald-200/50">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {t('importantInfo')}
              </span>
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-3xl mb-2">🆓</div>
                <p className="font-semibold text-gray-900">{t('free')}</p>
                <p className="text-sm text-gray-600">{t('freeDesc')}</p>
              </div>
              <div>
                <div className="text-3xl mb-2">🍽️</div>
                <p className="font-semibold text-gray-900">{t('snacks')}</p>
                <p className="text-sm text-gray-600">{t('snacksDesc')}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
