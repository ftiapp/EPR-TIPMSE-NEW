'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  const { t, language } = useLanguage();

  const privacyContent = {
    th: {
      title: 'นโยบายความเป็นส่วนตัว',
      lastUpdated: 'อัปเดตล่าสุด: 4 กันยายน 2568',
      sections: [
        {
          title: '1. ข้อมูลทั่วไป',
          content: `เว็บไซต์นี้จัดทำโดยสถาบันการจัดการบรรจุภัณฑ์และรีไซเคิลเพื่อสิ่งแวดล้อม (TIPMSE) ภายใต้สภาอุตสาหกรรมแห่งประเทศไทย เพื่อให้ข้อมูลเกี่ยวกับ EPR (Extended Producer Responsibility) และกิจกรรมที่เกี่ยวข้อง

เราให้ความสำคัญกับความเป็นส่วนตัวของผู้ใช้งานเว็บไซต์ และมุ่งมั่นที่จะปกป้องข้อมูลส่วนบุคคลของท่านตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562`
        },
        {
          title: '2. ข้อมูลที่เราเก็บรวบรวม',
          content: `• ข้อมูลการลงทะเบียนเข้าร่วมกิจกรรม (ชื่อ-นามสกุล, อีเมล, เบอร์โทรศัพท์, องค์กร)
• ข้อมูลการใช้งานเว็บไซต์ (IP Address, Browser, เวลาเข้าใช้งาน)
• Cookies และเทคโนโลยีที่คล้ายคลึงกัน
• ข้อมูลที่ท่านให้ไว้ผ่านแบบฟอร์มติดต่อหรือสอบถาม`
        },
        {
          title: '3. วัตถุประสงค์ในการใช้ข้อมูล',
          content: `• เพื่อจัดกิจกรรมและติดต่อสื่อสารเกี่ยวกับงาน EPR
• เพื่อส่งข้อมูลข่าวสารและกิจกรรมที่เกี่ยวข้อง
• เพื่อปรับปรุงและพัฒนาเว็บไซต์ให้ดีขึ้น
• เพื่อปฏิบัติตามกฎหมายและข้อบังคับที่เกี่ยวข้อง
• เพื่อวิเคราะห์การใช้งานเว็บไซต์และสถิติต่างๆ`
        },
        {
          title: '4. การเปิดเผยข้อมูล',
          content: `เราจะไม่เปิดเผยข้อมูลส่วนบุคคลของท่านให้กับบุคคลที่สาม ยกเว้นในกรณีดังต่อไปนี้:
• เมื่อได้รับความยินยอมจากท่าน
• เพื่อปฏิบัติตามกฎหมายหรือคำสั่งของศาล
• เพื่อปกป้องสิทธิและความปลอดภัยของเราและผู้อื่น
• กับหน่วยงานพันธมิตรที่จำเป็นสำหรับการจัดกิจกรรม`
        },
        {
          title: '5. ความปลอดภัยของข้อมูล',
          content: `เรามีมาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อป้องกันการเข้าถึง การใช้ การเปิดเผย การแก้ไข หรือการทำลายข้อมูลส่วนบุคคลโดยไม่ได้รับอนุญาต

ข้อมูลของท่านจะถูกเก็บไว้เป็นระยะเวลาที่จำเป็นตามวัตถุประสงค์ที่ระบุไว้ หรือตามที่กฎหมายกำหนด`
        },
        {
          title: '6. สิทธิของเจ้าของข้อมูล',
          content: `ท่านมีสิทธิในการ:
• เข้าถึงและขอสำเนาข้อมูลส่วนบุคคล
• ขอแก้ไขข้อมูลที่ไม่ถูกต้องหรือไม่สมบูรณ์
• ขอลบหรือทำลายข้อมูลส่วนบุคคล
• ขอระงับการใช้ข้อมูลส่วนบุคคล
• ขอโอนย้ายข้อมูลส่วนบุคคล
• ถอนความยินยอมในการประมวลผลข้อมูล`
        },
        {
          title: '7. การติดต่อ',
          content: `หากท่านมีคำถามหรือข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัวนี้ กรุณาติดต่อเราที่:

สถาบันการจัดการบรรจุภัณฑ์และรีไซเคิลเพื่อสิ่งแวดล้อม (TIPMSE)
สภาอุตสาหกรรมแห่งประเทศไทย
เว็บไซต์: https://tipmse.fti.or.th
โทรศัพท์: 02 345 1289`
        }
      ]
    },
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last Updated: September 4, 2025',
      sections: [
        {
          title: '1. General Information',
          content: `This website is operated by the Thailand Institute of Packaging and Recycling Management for Sustainable Environment (TIPMSE) under the Federation of Thai Industries to provide information about EPR (Extended Producer Responsibility) and related activities.

We value the privacy of our website users and are committed to protecting your personal data in accordance with the Personal Data Protection Act B.E. 2562 (2019).`
        },
        {
          title: '2. Information We Collect',
          content: `• Event registration information (name, email, phone number, organization)
• Website usage data (IP address, browser, access time)
• Cookies and similar technologies
• Information provided through contact or inquiry forms`
        },
        {
          title: '3. Purpose of Data Use',
          content: `• To organize events and communicate about EPR activities
• To send news and information about related activities
• To improve and develop our website
• To comply with applicable laws and regulations
• To analyze website usage and statistics`
        },
        {
          title: '4. Data Disclosure',
          content: `We will not disclose your personal data to third parties except in the following cases:
• With your consent
• To comply with laws or court orders
• To protect our rights and safety and those of others
• With partner organizations necessary for event organization`
        },
        {
          title: '5. Data Security',
          content: `We have appropriate security measures to prevent unauthorized access, use, disclosure, modification, or destruction of personal data.

Your data will be retained for the period necessary for the stated purposes or as required by law.`
        },
        {
          title: '6. Data Subject Rights',
          content: `You have the right to:
• Access and request copies of personal data
• Request correction of inaccurate or incomplete data
• Request deletion or destruction of personal data
• Request suspension of personal data use
• Request data portability
• Withdraw consent for data processing`
        },
        {
          title: '7. Contact',
          content: `If you have questions or concerns about this privacy policy, please contact us at:

Thailand Institute of Packaging and Recycling Management for Sustainable Environment (TIPMSE)
Federation of Thai Industries
Website: https://tipmse.fti.or.th
Phone: 02 345 1289`
        }
      ]
    }
  };

  const content = privacyContent[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 font-sans">
      <Header />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {content.title}
              </span>
            </h1>
            <p className="text-gray-600">{content.lastUpdated}</p>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-emerald-200/50"
          >
            <div className="space-y-8">
              {content.sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="border-b border-gray-200 pb-6 last:border-b-0"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 text-emerald-700">
                    {section.title}
                  </h2>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-12"
          >
            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>{language === 'th' ? 'กลับหน้าหลัก' : 'Back to Home'}</span>
            </motion.a>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
