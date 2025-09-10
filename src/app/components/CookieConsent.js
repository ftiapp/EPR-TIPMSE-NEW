'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function CookieConsent() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setIsVisible(false);
    
    // Enable analytics or other tracking here
    console.log('Cookies accepted');
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setIsVisible(false);
    
    // Disable analytics or other tracking here
    console.log('Cookies declined');
  };

  const handleLearnMore = () => {
    window.open('/privacy', '_blank');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 z-50"
          style={{ fontFamily: 'var(--font-prompt)' }}
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-200/50 p-4">
            {/* Decorative Elements */}
            <div className="absolute -top-1 left-4 right-4 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 rounded-full"></div>
            
            {/* Horizontal Layout */}
            <div className="flex items-center justify-between gap-4">
              {/* Left: Icon and Message */}
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-2xl">🍃</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-gray-900 leading-tight mb-1">
                    เราใช้คุกกี้เพื่อประสบการณ์ที่ดีขึ้น
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    ช่วยให้เราปรับปรุงเว็บไซต์และให้บริการที่ดีที่สุดแก่คุณ
                  </p>
                </div>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex items-center space-x-3 flex-shrink-0">
                {/* Learn More Button */}
                <motion.button
                  onClick={handleLearnMore}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-2 text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all duration-200 border border-emerald-200"
                >
                  <span className="flex items-center space-x-1">
                    <span>📋</span>
                    <span>รายละเอียด</span>
                  </span>
                </motion.button>

                {/* Decline Button */}
                <motion.button
                  onClick={handleDecline}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200"
                >
                  <span className="flex items-center space-x-1">
                    <span>✕</span>
                    <span>ปฏิเสธ</span>
                  </span>
                </motion.button>

                {/* Accept Button */}
                <motion.button
                  onClick={handleAccept}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
                  <span className="relative flex items-center space-x-1">
                    <span>✓</span>
                    <span>ยอมรับ</span>
                  </span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
