'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Schedule() {
  const [selectedTime, setSelectedTime] = useState(null);
  const [transportMode, setTransportMode] = useState('MRT');
  const { t, language } = useLanguage();

  const transportModes = [
    {
      id: 'MRT',
      name: 'MRT',
      icon: '🚇',
      color: 'from-blue-500 to-blue-600',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d15500.123456789!2d100.5417!3d13.7234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e3!4m5!1s0x30e29f1234567890%3A0x1234567890abcdef!2sLumpini%20MRT%20Station!3m2!1d13.7234!2d100.5417!4m5!1s0x30e29f1234567890%3A0x1234567890abcdef!2sQueen%20Sirikit%20National%20Convention%20Center%20MRT%20Station!3m2!1d13.7234!2d100.5617!5e0!3m2!1sen!2sth!4v1234567890123',
      routes: [
        { 
          name: 'สีน้ำเงิน', 
          stations: ['ลุมพินี', 'คลองเตย', 'ศูนย์การประชุมแห่งชาติสิริกิติ์'],
          path: 'M100,200 L300,200 L500,180 L700,160',
          color: '#0066cc'
        },
        { 
          name: 'สีเหลือง', 
          stations: ['ลาดพร้าว', 'ห้วยขวาง', 'สุทธิสาร', 'รัชดาภิเษก'],
          path: 'M150,100 L350,120 L550,140 L750,160',
          color: '#ffcc00'
        }
      ]
    },
    {
      id: 'BTS',
      name: 'BTS',
      icon: '🚝',
      color: 'from-green-500 to-green-600',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d15500.123456789!2d100.5317!3d13.7434!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e3!4m5!1s0x30e29f1234567890%3A0x1234567890abcdef!2sAsok%20BTS%20Station!3m2!1d13.7434!2d100.5317!4m5!1s0x30e29f1234567890%3A0x1234567890abcdef!2sQueen%20Sirikit%20National%20Convention%20Center!3m2!1d13.7234!2d100.5617!5e0!3m2!1sen!2sth!4v1234567890123',
      routes: [
        { 
          name: 'สุขุมวิท', 
          stations: ['อโศก', 'นานา', 'พลอยเจิต', 'ชิดลม'],
          path: 'M80,150 L280,170 L480,190 L680,200',
          color: '#00cc66'
        },
        { 
          name: 'สีลม', 
          stations: ['สยาม', 'ราชดำริ', 'ศาลาแดง', 'ช่องนนทรี'],
          path: 'M120,250 L320,230 L520,210 L720,200',
          color: '#66cc00'
        }
      ]
    },
    {
      id: 'BUS',
      name: 'BUS',
      icon: '🚌',
      color: 'from-orange-500 to-orange-600',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d31000.123456789!2d100.5217!3d13.7534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e3!4m5!1s0x30e29f1234567890%3A0x1234567890abcdef!2sSiam%20Square!3m2!1d13.7534!2d100.5217!4m5!1s0x30e29f1234567890%3A0x1234567890abcdef!2sQueen%20Sirikit%20National%20Convention%20Center!3m2!1d13.7234!2d100.5617!5e0!3m2!1sen!2sth!4v1234567890123',
      routes: [
        { 
          name: 'สาย 4', 
          stations: ['สยาม', 'ราชประสงค์', 'ชิดลม', 'เพลินจิต'],
          path: 'M60,180 Q200,120 400,140 T700,200',
          color: '#ff6600'
        },
        { 
          name: 'สาย 15', 
          stations: ['สนามหลวง', 'ราชดำเนิน', 'สยาม', 'ราชประสงค์'],
          path: 'M90,280 Q250,220 450,200 T720,180',
          color: '#ff9900'
        }
      ]
    },
    {
      id: 'CAR',
      name: 'CAR',
      icon: '🚗',
      color: 'from-purple-500 to-purple-600',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d31000.123456789!2d100.5117!3d13.7634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x30e29f1234567890%3A0x1234567890abcdef!2sHuai%20Khwang%20District%2C%20Bangkok!3m2!1d13.7634!2d100.5117!4m5!1s0x30e29f1234567890%3A0x1234567890abcdef!2sQueen%20Sirikit%20National%20Convention%20Center!3m2!1d13.7234!2d100.5617!5e0!3m2!1sen!2sth!4v1234567890123',
      routes: [
        { 
          name: 'ถนนรัชดาภิเษก', 
          stations: ['ห้วยขวาง', 'สุทธิสาร', 'รัชดาภิเษก', 'ศูนย์การประชุม'],
          path: 'M70,80 Q300,100 500,120 T750,200',
          color: '#9966cc'
        },
        { 
          name: 'ถนนพระราม 4', 
          stations: ['สีลม', 'สาทร', 'คลองเตย', 'ศูนย์การประชุม'],
          path: 'M100,300 Q350,250 550,220 T750,200',
          color: '#cc66ff'
        }
      ]
    }
  ];

  const scheduleItemsTH = [
    { time: '09.00-09.30 น.', title: 'ลงทะเบียนและรับประทานอาหารว่าง', description: 'ต้อนรับผู้เข้าร่วมและเตรียมความพร้อม', icon: '🎫' },
    { time: '09.30-09.55 น.', title: 'ชมวีดิทัศน์ “20 ปี TIPMSE เส้นทางการเปลี่ยนบรรจุภัณฑ์ให้เป็นวัตถุดิบ”', description: 'กล่าวเปิด\nโดย  คุณโฆษิต สุขสิงห์\nรองประธานสภาอุตสาหกรรมแห่งประเทศไทยและประธาน TIPMSE', icon: '🎬' },
    { time: '09.50-10.20 น.', title: 'ปาฐกถา เรื่อง\nทิศทางการขับเคลื่อนนโยบายภาครัฐเพื่อบรรจุภัณฑ์ที่ยั่งยืน', description: 'โดย  ปลัดกระทรวงทรัพยากรธรรมชาติและสิ่งแวดล้อม', icon: '🎯' },
    { time: '10.20-10.40 น.', title: 'FTI นำภาคอุตสาหกรรมมุ่งสู่การจัดการบรรจุภัณฑ์ที่ยั่งยืน', description: 'โดย  ประธานสภาอุตสาหกรรมแห่งประเทศไทย', icon: '🏭' },
    { time: '10.40-11.00 น.', title: 'กิจกรรมแถลงความร่วมมือของต้นน้ำ กลางน้ำ และปลายน้ำในวงจรบรรจุภัณฑ์', description: 'โดย  ภาครัฐ ภาคผู้ผลิต ภาคการค้าบริการ ผู้รวบรวม หน่วยงานท้องถิ่น นักวิชาการ', icon: '🤝' },
    { time: '11.00-11.10 น.', title: 'ก้าวต่อไปของภาคเอกชนในการขับเคลื่อนเศรษฐกิจหมุนเวียนภาคสมัครใจ', description: 'โดย   รองประธาน TIPMSE', icon: '🔄' },
    { time: '11.10-12.00 น.', title: 'Recycle Talk: โอกาส ความท้าทายของอุตสาหกรรมรีไซเคิลกับการขับเคลื่อนเศรษฐกิจหมุนเวียน', description: 'โดย   ผู้แทนอุตสาหกรรมรีไซเคิลบรรจุภัณฑ์แก้ว\nผู้แทนอุตสาหกรรมรีไซเคิลบรรจุภัณฑ์กระดาษ\nผู้แทนอุตสาหกรรมรีไซเคิลบรรจุภัณฑ์พลาสติก\nผู้แทนอุตสาหกรรมรีไซเคิลบรรจุภัณฑ์กระป๋อง\nผู้แทนอุตสาหกรรมรีไซเคิลบรรจุภัณฑ์กล่องเครื่องดื่ม\nดำเนินการเสวนา โดย คุณกิติยา แสนทวีสุข เลขานุการและกรรมการ TIPMSE\nปิดกิจกรรม', icon: '💬' }
  ];

  const scheduleItemsEN = [
    { time: '09:00-09:30', title: 'Registration and Refreshments', description: 'Welcome participants and preparation', icon: '🎫' },
    { time: '09:30-09:55', title: 'Video Presentation: “20 Years of TIPMSE – Transforming Packaging into Raw Materials”', description: 'Opening remarks\nby Mr. Kosit Suksingha\nVice Chairman of the Federation of Thai Industries and Chairman of TIPMSE', icon: '🎬' },
    { time: '09:50-10:20', title: 'Keynote:\nGovernment Policy Directions for Sustainable Packaging', description: 'By the Permanent Secretary of the Ministry of Natural Resources and Environment', icon: '🎯' },
    { time: '10:20-10:40', title: 'FTI Leads Industry toward Sustainable Packaging Management', description: 'By the Chairman of the Federation of Thai Industries', icon: '🏭' },
    { time: '10:40-11:00', title: 'Cooperation Announcement across the Packaging Value Chain', description: 'Public sector, producers, trade and services, collectors, local authorities, and academics', icon: '🤝' },
    { time: '11:00-11:10', title: 'Next Steps for the Private Sector in Advancing the Voluntary Circular Economy', description: 'By the Vice Chairman of TIPMSE', icon: '🔄' },
    { time: '11:10-12:00', title: 'Recycle Talk: Opportunities and Challenges in the Recycling Industry driving the Circular Economy', description: 'Representatives from glass, paper, plastic, can, and beverage carton recycling industries\nModerated by Ms. Kitiya Saentaweesuk, TIPMSE Secretary and Board Member\nClosing', icon: '💬' }
  ];

  const scheduleItems = language === 'th' ? scheduleItemsTH : scheduleItemsEN;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="schedule" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 scroll-mt-24 md:scroll-mt-28">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {t('scheduleTitle')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto whitespace-pre-line">
            {t('scheduleSubtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-6"
        >
          {scheduleItems.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 10 }}
              onClick={() => setSelectedTime(selectedTime === index ? null : index)}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-200/50 cursor-pointer transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-start space-x-4">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-2xl"
                >
                  {item.icon}
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="inline-block bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold mb-2 md:mb-0"
                    >
                      {item.time}
                    </motion.span>
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 leading-tight">
                    {item.title}
                  </h3>
                  
                  <motion.div
                    initial={false}
                    animate={{ 
                      height: selectedTime === index ? 'auto' : '0',
                      opacity: selectedTime === index ? 1 : 0 
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-gray-600 leading-relaxed pt-2 whitespace-pre-line">
                      {item.description}
                    </p>
                  </motion.div>
                  
                  {selectedTime !== index && (
                    <p className="text-gray-600 text-sm line-clamp-2 whitespace-pre-line">
                      {item.description}
                    </p>
                  )}
                </div>

                <motion.div
                  animate={{ rotate: selectedTime === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Map Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20 scroll-mt-24 md:scroll-mt-28"
          id="map"
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {t('mapTitle')}
            </span>
          </h3>
          
          {/* Transportation Mode Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-emerald-200/50">
              <div className="flex space-x-2">
                {transportModes.map((mode) => (
                  <motion.button
                    key={mode.id}
                    onClick={() => setTransportMode(mode.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      transportMode === mode.id
                        ? `bg-gradient-to-r ${mode.color} text-white shadow-lg`
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{mode.icon}</span>
                    <span>{mode.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-emerald-200/50">
            {/* Current Transport Mode Info */}
            <div className="text-center mb-6">
              <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-gradient-to-r ${transportModes.find(m => m.id === transportMode)?.color} text-white font-semibold`}>
                <span className="text-2xl">{transportModes.find(m => m.id === transportMode)?.icon}</span>
                <span>{t('routePrefix')} {transportMode} {t('routeToVenue')}</span>
              </div>
            </div>

            {/* Real Google Maps with Route Overlay */}
            <div className="aspect-video rounded-xl relative overflow-hidden shadow-lg">
              {/* Google Maps Embed */}
              <iframe
                src={transportModes.find(m => m.id === transportMode)?.mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-xl"
              ></iframe>
              
              {/* Route Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full">
                  {transportModes.find(m => m.id === transportMode)?.routes.map((route, routeIndex) => (
                    <g key={`${transportMode}-${routeIndex}`}>
                      {/* Route Path removed as per request */}

                      {/* Station markers removed as per request */}
                    </g>
                  ))}
                  
                  {/* Destination marker removed as per request */}
                </svg>
              </div>

              {/* Route Information Panel */}
              <div className="absolute bottom-4 left-4 right-4">
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-white/20"
                >
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="text-xl mr-2">{transportModes.find(m => m.id === transportMode)?.icon}</span>
                    {t('routePrefix')} {transportMode} {t('routeToVenue')}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {transportModes.find(m => m.id === transportMode)?.routes.map((route, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.2 + 0.7 }}
                        className="space-y-2"
                      >
                        <div 
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                          style={{ backgroundColor: route.color }}
                        >
                          <div 
                            className="w-3 h-3 rounded-full mr-2 border-2 border-white"
                            style={{ backgroundColor: route.color }}
                          ></div>
                          {route.name}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {route.stations.map((station, stationIndex) => (
                            <motion.span
                              key={stationIndex}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.3, delay: index * 0.2 + stationIndex * 0.1 + 1 }}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full border"
                            >
                              {station}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-full font-medium shadow-lg"
              >
                {t('viewMap')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-gray-700 border-2 border-gray-300 px-6 py-3 rounded-full font-medium hover:border-emerald-500 transition-colors"
              >
                {t('downloadMap')}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}