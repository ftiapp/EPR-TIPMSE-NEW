'use client';

import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('th');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'th' ? 'en' : 'th');
  };

  const translations = {
    th: {
      // Header
      home: 'หน้าหลัก',
      schedule: 'กำหนดการ',
      map: 'แผนที่',
      contact: 'ติดต่อ',
      about: 'เกี่ยวกับเรา',
      
      // Hero
      heroTitle: 'รวมพลังขับเคลื่อน EPR',
      heroSubtitle: 'เปลี่ยนบรรจุภัณฑ์ให้เป็นวัตถุดิบ',
      // Back-compat (do not use for new code)
      title: 'รวมพลังขับเคลื่อน EPR',
      subtitle: 'เปลี่ยนบรรจุภัณฑ์ให้เป็นวัตถุดิบ',
      date: 'วันที่',
      time: 'เวลา',
      location: 'สถานที่',
      eventDate: 'วันอังคารที่ 30 กันยายน 2568',
      eventTime: '09.00 – 12.00 น.',
      eventLocation: 'ห้องเพลนารีฮอล์ (Plenary Hall) ชั้น 1\nศูนย์การประชุมแห่งชาติสิริกิติ์',
      register: 'ลงทะเบียนเข้าร่วม',
      viewSchedule: 'ดูกำหนดการ',

      // Sections
      personalInfo: 'ข้อมูลส่วนตัว',
      contactInfo: 'ข้อมูลติดต่อ',
      orgInfo: 'ข้อมูลองค์กร',
      
      // Schedule
      scheduleTitle: 'กำหนดการกิจกรรม',
      scheduleSubtitle: 'วันอังคารที่ 30 กันยายน 2568 เวลา 09.00 – 12.00 น.\nณ ห้องเพลนารีฮอล์ (Plenary Hall) ชั้น 1 ศูนย์การประชุมแห่งชาติสิริกิติ์',
      mapTitle: 'แผนที่สถานที่จัดงาน',
      mapLocation: 'ศูนย์การประชุมแห่งชาติสิริกิติ์',
      mapRoom: 'ห้องเพลนารีฮอล์ (Plenary Hall) ชั้น 1',
      viewMap: 'ดูแผนที่ใน Google Maps',
      downloadMap: 'ดาวน์โหลดแผนที่',
      routePrefix: 'เส้นทาง',
      routeToVenue: 'มาศูนย์การประชุมแห่งชาติสิริกิติ์',
      venueShort: 'ศูนย์การประชุมแห่งชาติสิริกิติ์',
      
      // Contact
      contactTitle: 'ติดต่อสอบถาม',
      contactSubtitle: 'สำหรับข้อมูลเพิ่มเติมและการลงทะเบียน',
      contactPerson: 'ผู้ติดต่อ',
      registerOnline: 'ลงทะเบียนออนไลน์',
      registerNote: 'หรือติดต่อผ่านเบอร์โทรศัพท์ด้านบน',
      importantInfo: 'ข้อมูลสำคัญ',
      free: 'เข้าร่วมฟรี',
      freeDesc: 'ไม่มีค่าใช้จ่าย',
      snacks: 'อาหารว่าง',
      snacksDesc: 'เสิร์ฟในงาน',
      certificate: 'ใบประกาศนียบัตร',
      certificateDesc: 'สำหรับผู้เข้าร่วม',
      
      // Footer
      quickLinks: 'เมนูหลัก',
      contact: 'ติดต่อ',
      contactUs: 'ติดต่อเรา',
      privacy: 'นโยบายความเป็นส่วนตัว',
      terms: 'เงื่อนไขการใช้งาน',
      copyright: '© 2024 TIPMSE. สงวนลิขสิทธิ์',
      address_th: 'สถาบันการจัดการบรรจุภัณฑ์และรีไซเคิลเพื่อสิ่งแวดล้อม สภาอุตสาหกรรมแห่งประเทศไทยชั้น 7 อาคารปฏิบัติการเทคโนโลยีเชิงสร้างสรรค์\nเลขที่ 2 ถนนนางลิ้นจี่ แขวงทุ่งมหาเมฆ\nเขตสาทร กรุงเทพมหานคร 10120',

      // About Page
      aboutTitle: 'เกี่ยวกับ TIPMSE',
      aboutSubtitle: 'ประวัติ ความเป็นมา และบทบาทของสถาบันการจัดการบรรจุภัณฑ์และรีไซเคิลเพื่อสิ่งแวดล้อม',
      historyTitle: 'ประวัติและพัฒนาการ',
      missionTitle: 'พันธกิจ',
      visionTitle: 'วิสัยทัศน์',
      missionText: 'ผลักดันระบบการจัดการบรรจุภัณฑ์และรีไซเคิลของประเทศ ให้เกิดการใช้ทรัพยากรอย่างคุ้มค่า สร้างเศรษฐกิจหมุนเวียน และลดผลกระทบต่อสิ่งแวดล้อม',
      visionText: 'เป็นสถาบันชั้นนำด้านการบริหารจัดการบรรจุภัณฑ์และรีไซเคิล เพื่อสิ่งแวดล้อมที่ยั่งยืนของประเทศไทย',
      milestonesTitle: 'เหตุการณ์สำคัญ',

      // EPR Intro (Homepage)
      eprIntroTitle: 'รวมพลังขับเคลื่อน EPR',
      // สรุปย่อสำหรับหน้าแรก (ถอดความจากข้อความยาว)
      eprIntroSubtitle: 'EPR เป็นเครื่องมือทางเศรษฐศาสตร์ที่ภาครัฐนำมาใช้แก้ปัญหาขยะ โดยมุ่งไปที่บรรจุภัณฑ์ซึ่งมีผู้รับผิดชอบชัดเจน แม้จะเน้นบทบาทผู้ผลิต แต่ความสำเร็จต้องอาศัยความร่วมมือจากทุกภาคส่วน ตั้งแต่ผู้กระจายสินค้า ผู้บริโภค ผู้รวบรวม ไปจนถึงองค์กรปกครองส่วนท้องถิ่น',
      eprLearnMore: 'เรียนรู้เพิ่มเติม',
      // ข้อความฉบับเต็มสำหรับหน้า About > EPR
      eprFullText: 'EPR เป็นเครื่องมือทางเศรษฐศาสตร์ที่ภาครัฐพยายามนำมาแก้ปัญหาขยะ โดยมุ่งเป้ามาที่บรรจุภัณฑ์ที่ดูเหมือนจะเป็นสิ่งที่มีเจ้าภาพหรือมีผู้รับผิดชอบที่มีตัวตน ที่ผ่านมา EPR ถูกนำมาพูดถึงอย่างต่อเนื่องกว่า 10 ปี แต่เนื่องจาก EPR เป็นความท้าทายที่ต้องดึงภาคส่วนต่างๆ เข้ามาร่วมขับเคลื่อน เพราะถึงแม้ชื่อของ EPR จะเป็นความรับผิดชอบหลักของผู้ผลิต แต่เพื่อให้กลไกเกิดการขับเคลื่อนได้ภาคส่วนอื่นๆ อย่างผู้กระจายสินค้า ผู้บริโภค ผู้รวบรวม หรือองค์การบริหารส่วนท้องถิ่นอย่างเทศบาล หรือ อบต.ก็ปฏิเสธที่จะร่วมขับเคลื่อนไม่ได้ เพราะการเดินทางของผู้ผลิตแต่เพียงฝ่ายเดียว ย่อมไม่ประสบความสำเร็จได้อย่างแน่นอน',

      // Registration Form
      registerTitle: 'ลงทะเบียนเข้าร่วมงาน',
      registerSubtitle: 'กรุณากรอกข้อมูลให้ครบถ้วนเพื่อลงทะเบียนเข้าร่วมงาน',
      contactNote: 'หมายเหตุ: อีเมลและเบอร์โทรศัพท์จะใช้สำหรับส่ง QR Code สำหรับเข้าร่วมงาน',
      // Use registration-specific keys to avoid conflict with hero title
      regTitleLabel: 'คำนำหน้า',
      regTitlePlaceholder: 'เลือกคำนำหน้า',
      regCustomTitle: 'คำนำหน้าอื่นๆ',
      regCustomTitlePlaceholder: 'กรุณาระบุคำนำหน้า',
      // Deprecated: kept for backward-compat but should not be used for registration labels
      title: 'รวมพลังขับเคลื่อน EPR',
      titlePlaceholder: 'เลือกคำนำหน้า',
      customTitle: 'คำนำหน้าอื่นๆ',
      customTitlePlaceholder: 'กรุณาระบุคำนำหน้า',
      firstName: 'ชื่อ',
      firstNamePlaceholder: 'กรุณากรอกชื่อ',
      lastName: 'นามสกุล',
      lastNamePlaceholder: 'กรุณากรอกนามสกุล',
      phoneNumber: 'เบอร์โทรศัพท์',
      phoneNumberPlaceholder: 'กรุณากรอกเบอร์โทรศัพท์',
      email: 'อีเมล',
      emailPlaceholder: 'กรุณากรอกอีเมล',
      organization: 'องค์กร/บริษัท',
      organizationPlaceholder: 'กรุณากรอกชื่อองค์กร/บริษัท',
      department: 'หน่วยงาน/แผนก',
      departmentPlaceholder: 'กรุณากรอกหน่วยงาน/แผนก (ไม่บังคับ)',
      participantType: 'ประเภทผู้เข้าร่วม',
      participantTypePlaceholder: 'เลือกประเภทผู้เข้าร่วม',
      participantTypes: {
        participant: 'เข้าร่วมงาน',
        speaker: 'วิทยากร',
        executive: 'ผู้บริหารขึ้นถ่ายภาพ/ร่วมงาน'
      },
      consentText: 'ข้าพเจ้ายินยอมให้ TIPMSE เก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้าเพื่อวัตถุประสงค์ในการจัดงานและติดต่อสื่อสาร',
      consentRequired: 'กรุณายินยอมเงื่อนไขการใช้ข้อมูลส่วนบุคคล',
      submitRegistration: 'ลงทะเบียน',
      registrationSuccess: 'ลงทะเบียนสำเร็จ!',
      registrationError: 'เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง',
      
      // Validation Messages
      fieldRequired: 'กรุณากรอกข้อมูลในช่องนี้',
      invalidEmail: 'รูปแบบอีเมลไม่ถูกต้อง',
      invalidPhone: 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง',
      duplicateName: 'ชื่อ-นามสกุลนี้ได้ลงทะเบียนแล้ว กรุณาตรวจสอบข้อมูล',
      checkingDuplicateName: 'กำลังตรวจสอบชื่อ-นามสกุล...',
      nameAvailable: 'ชื่อนี้ยังไม่ซ้ำ สามารถลงทะเบียนได้',
      
      // Cookie Consent
      cookieTitle: 'การใช้คุกกี้',
      cookieMessage: 'เว็บไซต์นี้ใช้คุกกี้เพื่อปรับปรุงประสบการณ์การใช้งานของคุณ การใช้งานเว็บไซต์ต่อไปถือว่าคุณยอมรับการใช้คุกกี้',
      cookieAccept: 'ยอมรับ',
      cookieDecline: 'ปฏิเสธ',
      cookieLearnMore: 'เรียนรู้เพิ่มเติม'
    },
    en: {
      // Header
      home: 'Home',
      schedule: 'Schedule',
      map: 'Map',
      contact: 'Contact',
      about: 'About Us',
      
      // Hero
      heroTitle: 'Unite to Drive EPR',
      heroSubtitle: 'Transform Packaging into Raw Materials',
      // Back-compat (do not use for new code)
      title: 'Title',
      subtitle: 'Subtitle',
      date: 'Date',
      time: 'Time',
      location: 'Location',
      eventDate: 'Tuesday, September 30, 2025',
      eventTime: '09:00 – 12:00',
      eventLocation: 'Plenary Hall, 1st Floor\nQueen Sirikit National Convention Center',
      register: 'Register Now',
      viewSchedule: 'View Schedule',

      // Sections
      personalInfo: 'Personal Information',
      contactInfo: 'Contact Information',
      orgInfo: 'Organization Information',
      
      // Schedule
      scheduleTitle: 'Event Schedule',
      scheduleSubtitle: 'Tuesday, September 30, 2025, 09:00 – 12:00\nat Plenary Hall, 1st Floor, Queen Sirikit National Convention Center',
      mapTitle: 'Event Location Map',
      mapLocation: 'Queen Sirikit National Convention Center',
      mapRoom: 'Plenary Hall, 1st Floor',
      viewMap: 'View on Google Maps',
      downloadMap: 'Download Map',
      routePrefix: 'Route by',
      routeToVenue: 'to Queen Sirikit National Convention Center',
      venueShort: 'Queen Sirikit National Convention Center',
      
      // Contact
      contactTitle: 'Contact Information',
      contactSubtitle: 'For more information and registration',
      contactPerson: 'Contact Person',
      registerOnline: 'Register Online',
      registerNote: 'Or contact via phone numbers above',
      importantInfo: 'Important Information',
      free: 'Free Entry',
      freeDesc: 'No charges',
      snacks: 'Refreshments',
      snacksDesc: 'Served at event',
      certificate: 'Certificate',
      certificateDesc: 'For participants',
      
      // Footer
      quickLinks: 'Quick Links',
      contactUs: 'Contact Us',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      copyright: '© 2024 TIPMSE. All rights reserved',
      address_en: 'Thailand Institute of Packaging and Recycling Management for Sustainable Environment (TIPMSE)\n7th Flr, Creative Technology Bldg. 2 Nang Linchi Rd.,\nThung Maha Mek, Sathon, Bangkok 10120 Thailand',

      // About Page
      aboutTitle: 'About TIPMSE',
      aboutSubtitle: 'History, background, and the role of the Thailand Institute of Packaging and Recycling Management for Sustainable Environment',
      historyTitle: 'History and Development',
      missionTitle: 'Mission',
      visionTitle: 'Vision',
      missionText: 'Drive Thailand’s packaging and recycling management to enable resource efficiency, circular economy, and reduced environmental impact.',
      visionText: 'Be the leading institute in packaging and recycling management for Thailand’s sustainable environment.',
      milestonesTitle: 'Key Milestones',

      // EPR Intro (Homepage)
      eprIntroTitle: 'What is EPR?',
      // Concise summary for homepage (paraphrased from full text)
      eprIntroSubtitle: 'EPR is an economic policy tool used by governments to tackle waste by focusing on packaging with clearly identifiable responsibility. Although it emphasizes producers, success depends on collaboration across the chain—distributors, consumers, collectors, and local authorities—since producers alone cannot achieve the goal.',
      eprLearnMore: 'Learn more',
      // Full text for About > EPR
      eprFullText: 'EPR is an economic instrument that the government seeks to employ to address the waste problem, focusing on packaging that appears to have a clear owner or responsible party. EPR has been discussed for over ten years, but it remains a challenge that requires the participation of multiple sectors. Although EPR places primary responsibility on producers, effective implementation demands cooperation from other stakeholders as well—distributors, consumers, waste collectors, and local administrative organizations such as municipalities or subdistrict administrative organizations. Progress cannot be achieved by producers alone.',

      // Registration Form
      registerTitle: 'Event Registration',
      registerSubtitle: 'Please fill in all required information to register for the event',
      contactNote: 'Note: Email and phone number will be used to send QR Code for event entry',
      // Registration-specific keys (used in Register page UI)
      regTitleLabel: 'Title',
      regTitlePlaceholder: 'Select title',
      regCustomTitle: 'Other title',
      regCustomTitlePlaceholder: 'Please specify title',
      // Back-compat keys (avoid using in new code)
      title: 'Title',
      titlePlaceholder: 'Select title',
      customTitle: 'Other Title',
      customTitlePlaceholder: 'Please specify title',
      firstName: 'First Name',
      firstNamePlaceholder: 'Please enter your first name',
      lastName: 'Last Name',
      lastNamePlaceholder: 'Please enter your last name',
      phoneNumber: 'Phone Number',
      phoneNumberPlaceholder: 'Please enter your phone number',
      email: 'Email',
      emailPlaceholder: 'Please enter your email address',
      organization: 'Organization/Company',
      organizationPlaceholder: 'Please enter your organization/company name',
      department: 'Department/Division',
      departmentPlaceholder: 'Please enter your department/division (optional)',
      participantType: 'Participant Type',
      participantTypePlaceholder: 'Select participant type',
      participantTypes: {
        participant: 'Participant',
        speaker: 'Speaker',
        executive: 'Executive/Photo Session'
      },
      consentText: 'I consent to TIPMSE collecting, using, and disclosing my personal data for event management and communication purposes',
      consentRequired: 'Please consent to the personal data usage terms',
      submitRegistration: 'Register',
      registrationSuccess: 'Registration successful!',
      registrationError: 'Registration failed. Please try again.',
      
      // Validation Messages
      fieldRequired: 'This field is required',
      invalidEmail: 'Invalid email format',
      invalidPhone: 'Invalid phone number format',
      duplicateName: 'This name combination is already registered. Please check your information.',
      checkingDuplicateName: 'Checking name for duplicates...',
      nameAvailable: 'Name is available',
      
      // Cookie Consent
      cookieTitle: 'Cookie Usage',
      cookieMessage: 'This website uses cookies to improve your browsing experience. Continued use of this website implies your acceptance of cookies',
      cookieAccept: 'Accept',
      cookieDecline: 'Decline',
      cookieLearnMore: 'Learn more'
    }
  };

  const t = (key) => {
    if (!key) return '';
    const parts = String(key).split('.');
    let current = translations[language];
    for (const part of parts) {
      if (current && Object.prototype.hasOwnProperty.call(current, part)) {
        current = current[part];
      } else {
        return key; // fallback to the key if missing
      }
    }
    return typeof current === 'string' ? current : key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
