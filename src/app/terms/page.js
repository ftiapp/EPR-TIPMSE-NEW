'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TermsOfService() {
  const { t, language } = useLanguage();

  const termsContent = {
    th: {
      title: 'เงื่อนไขการใช้งาน',
      lastUpdated: 'อัปเดตล่าสุด: 4 กันยายน 2568',
      sections: [
        {
          title: '1. ข้อมูลทั่วไป',
          content: `เว็บไซต์นี้จัดทำและดำเนินการโดยสถาบันการจัดการบรรจุภัณฑ์และรีไซเคิลเพื่อสิ่งแวดล้อม (TIPMSE) ภายใต้สภาอุตสาหกรรมแห่งประเทศไทย 

EPR (Extended Producer Responsibility) เป็นเครื่องมือทางเศรษฐศาสตร์ที่ภาครัฐพยายามนำมาแก้ปัญหาขยะ โดยมุ่งเป้ามาที่บรรจุภัณฑ์ที่ดูเหมือนจะเป็นสิ่งที่มีเจ้าภาพหรือมีผู้รับผิดชอบที่มีตัวตน

การใช้งานเว็บไซต์นี้ถือว่าท่านยอมรับและตกลงปฏิบัติตามเงื่อนไขการใช้งานทั้งหมด`
        },
        {
          title: '2. วัตถุประสงค์ของเว็บไซต์',
          content: `• เผยแพร่ข้อมูลและความรู้เกี่ยวกับ EPR และการจัดการบรรจุภัณฑ์อย่างยั่งยืน
• จัดกิจกรรมและสัมมนาเพื่อส่งเสริมความเข้าใจเรื่อง EPR
• เป็นศูนย์กลางข้อมูลสำหรับผู้ที่สนใจเรื่องการจัดการขยะและบรรจุภัณฑ์
• สร้างเครือข่ายความร่วมมือระหว่างภาคส่วนต่างๆ ในการขับเคลื่อน EPR
• สนับสนุนการดำเนินงานตามนโยบาย EPR ของประเทศไทย`
        },
        {
          title: '3. การใช้งานที่อนุญาต',
          content: `ท่านสามารถใช้งานเว็บไซต์นี้เพื่อ:
• ศึกษาข้อมูลเกี่ยวกับ EPR และกิจกรรมที่เกี่ยวข้อง
• ลงทะเบียนเข้าร่วมกิจกรรมและสัมมนา
• ติดต่อสอบถามข้อมูลผ่านช่องทางที่กำหนด
• แบ่งปันข้อมูลเพื่อการศึกษาและไม่แสวงหาผลกำไร
• เข้าถึงทรัพยากรและเอกสารที่เปิดให้สาธารณะ`
        },
        {
          title: '4. ข้อจำกัดการใช้งาน',
          content: `ท่านไม่สามารถ:
• ใช้เว็บไซต์เพื่อวัตถุประสงค์ที่ผิดกฎหมายหรือไม่เหมาะสม
• คัดลอก, แจกจ่าย, หรือดัดแปลงเนื้อหาโดยไม่ได้รับอนุญาต
• ส่งข้อมูลที่เป็นอันตรายต่อระบบหรือผู้ใช้อื่น
• แอบอ้างหรือปลอมแปลงตัวตนในการใช้งาน
• ใช้เว็บไซต์เพื่อส่งสแปมหรือข้อความรบกวน`
        },
        {
          title: '5. ลิขสิทธิ์และทรัพย์สินทางปัญญา',
          content: `เนื้อหาทั้งหมดในเว็บไซต์นี้ รวมถึงข้อความ รูปภาพ กราฟิก โลโก้ และซอฟต์แวร์ เป็นทรัพย์สินของ TIPMSE และสภาอุตสาหกรรมแห่งประเทศไทย หรือผู้ให้อนุญาต

การใช้งานเนื้อหาเพื่อการศึกษาและไม่แสวงหาผลกำไรสามารถทำได้ โดยต้องระบุแหล่งที่มาอย่างชัดเจน`
        },
        {
          title: '6. ความรับผิดชอบ',
          content: `TIPMSE และสภาอุตสาหกรรมแห่งประเทศไทย:
• พยายามให้ข้อมูลที่ถูกต้องและทันสมัย แต่ไม่รับประกันความสมบูรณ์
• ไม่รับผิดชอบต่อความเสียหายที่เกิดจากการใช้งานเว็บไซต์
• ขอสงวนสิทธิ์ในการปรับปรุงหรือยกเลิกบริการโดยไม่ต้องแจ้งล่วงหน้า
• ไม่รับผิดชอบต่อเนื้อหาในเว็บไซต์ภายนอกที่มีการเชื่อมโยง`
        },
        {
          title: '7. การปรับปรุงเงื่อนไข',
          content: `เราขอสงวนสิทธิ์ในการปรับปรุงเงื่อนไขการใช้งานนี้เป็นครั้งคราว การปรับปรุงจะมีผลทันทีเมื่อประกาศในเว็บไซต์

การใช้งานเว็บไซต์ต่อไปหลังจากการปรับปรุงถือว่าท่านยอมรับเงื่อนไขใหม่`
        },
        {
          title: '8. กฎหมายที่ใช้บังคับ',
          content: `เงื่อนไขการใช้งานนี้อยู่ภายใต้กฎหมายไทย ข้อพิพาทใดๆ จะอยู่ในเขตอำนาจของศาลไทย

หากมีข้อสงสัยหรือต้องการติดต่อ กรุณาติดต่อ:

สถาบันการจัดการบรรจุภัณฑ์และรีไซเคิลเพื่อสิ่งแวดล้อม (TIPMSE)
สภาอุตสาหกรรมแห่งประเทศไทย
เว็บไซต์: https://tipmse.fti.or.th
อีเมล: info@tipmse.fti.or.th
โทรศัพท์: 02 345 1289`
        }
      ]
    },
    en: {
      title: 'Terms of Service',
      lastUpdated: 'Last Updated: September 4, 2025',
      sections: [
        {
          title: '1. General Information',
          content: `This website is created and operated by the Thailand Institute of Packaging and Recycling Management for Sustainable Environment (TIPMSE) under the Federation of Thai Industries.

EPR (Extended Producer Responsibility) is an economic tool that the government is trying to use to solve waste problems, focusing on packaging that appears to have identifiable owners or responsible parties.

By using this website, you agree to accept and comply with all terms of service.`
        },
        {
          title: '2. Website Objectives',
          content: `• Disseminate information and knowledge about EPR and sustainable packaging management
• Organize activities and seminars to promote understanding of EPR
• Serve as an information hub for those interested in waste and packaging management
• Build cooperation networks between different sectors in driving EPR
• Support operations according to Thailand's EPR policy`
        },
        {
          title: '3. Permitted Use',
          content: `You may use this website to:
• Study information about EPR and related activities
• Register for activities and seminars
• Contact for inquiries through designated channels
• Share information for educational and non-profit purposes
• Access publicly available resources and documents`
        },
        {
          title: '4. Usage Restrictions',
          content: `You may not:
• Use the website for illegal or inappropriate purposes
• Copy, distribute, or modify content without permission
• Send data that is harmful to the system or other users
• Impersonate or falsify identity when using the service
• Use the website to send spam or disturbing messages`
        },
        {
          title: '5. Copyright and Intellectual Property',
          content: `All content on this website, including text, images, graphics, logos, and software, is the property of TIPMSE and the Federation of Thai Industries or licensors.

Use of content for educational and non-profit purposes is permitted, provided that sources are clearly cited.`
        },
        {
          title: '6. Liability',
          content: `TIPMSE and the Federation of Thai Industries:
• Strive to provide accurate and up-to-date information but do not guarantee completeness
• Are not responsible for damages arising from website use
• Reserve the right to improve or discontinue services without prior notice
• Are not responsible for content on external linked websites`
        },
        {
          title: '7. Terms Updates',
          content: `We reserve the right to update these terms of service from time to time. Updates will take effect immediately upon posting on the website.

Continued use of the website after updates constitutes acceptance of the new terms.`
        },
        {
          title: '8. Applicable Law',
          content: `These terms of service are governed by Thai law. Any disputes will be under the jurisdiction of Thai courts.

For questions or contact, please reach out to:

Thailand Institute of Packaging and Recycling Management for Sustainable Environment (TIPMSE)
Federation of Thai Industries
Website: https://tipmse.fti.or.th
Email: info@tipmse.fti.or.th
Phone: 02 345 1289`
        }
      ]
    }
  };

  const content = termsContent[language];

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
