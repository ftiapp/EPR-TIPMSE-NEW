'use client';

import { useLanguage } from '../context/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AboutPage() {
  const { language, t } = useLanguage();

  const th = {
    history: [
      'สถาบันการจัดการบรรจุภัณฑ์และรีไซเคิลเพื่อสิ่งแวดล้อม (TIPMSE) จัดตั้งขึ้นเพื่อผลักดันการบริหารจัดการบรรจุภัณฑ์ใช้แล้วอย่างครบวงจร ตั้งแต่การออกแบบ การจัดเก็บ การคัดแยก ไปจนถึงการรีไซเคิลและนำกลับมาใช้ประโยชน์ใหม่',
      'ตลอดระยะเวลาที่ผ่านมา TIPMSE ร่วมมือกับหน่วยงานภาครัฐ เอกชน และประชาสังคม ในการพัฒนามาตรฐาน แนวทางปฏิบัติที่ดี และโครงการนำร่อง เพื่อสร้างระบบเศรษฐกิจหมุนเวียนด้านบรรจุภัณฑ์ให้เกิดขึ้นจริงในประเทศไทย',
    ],
    milestones: [
      'เปิดตัวโครงการความร่วมมือด้านคัดแยกและรีไซเคิลบรรจุภัณฑ์ในพื้นที่นำร่อง',
      'จัดทำแนวทางและมาตรฐานการคัดแยก สำหรับผู้ประกอบการและหน่วยงานท้องถิ่น',
      'สนับสนุนการสื่อสารสาธารณะเพื่อสร้างความตระหนักรู้ในการคัดแยกขยะบรรจุภัณฑ์',
    ],
  };

  const en = {
    history: [
      'The Thailand Institute of Packaging and Recycling Management for Sustainable Environment (TIPMSE) was established to advance end-to-end post-consumer packaging management—from design and collection to sorting, recycling, and circular use.',
      'Over the years, TIPMSE has collaborated with government, private sector, and civil society to develop standards, best practices, and pilot programs that bring the packaging circular economy to life in Thailand.',
    ],
    milestones: [
      'Launched pilot collaboration programs on packaging sorting and recycling',
      'Developed sorting guidelines and standards for businesses and local authorities',
      'Supported public communication campaigns to raise awareness on packaging waste sorting',
    ],
  };

  const L = language === 'th' ? th : en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 font-sans">
      <Header />

      {/* Hero / Page Header */}
      <section className="pt-24 pb-10 px-4 sm:px-6 lg:px-8 bg-white/70 backdrop-blur">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {t('aboutTitle')}
          </h1>
          <p className="mt-4 text-gray-700">
            {t('aboutSubtitle')}
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <main className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
            {/* History */}
            <section id="history" className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
              <h2 className="text-2xl font-bold text-emerald-700 mb-4">{t('historyTitle')}</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                {L.history.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>

            {/* Mission & Vision */}
            <section id="mission-vision" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
                <h3 className="text-xl font-semibold text-emerald-700 mb-2">{t('missionTitle')}</h3>
                <p className="text-gray-700 leading-relaxed">{t('missionText')}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
                <h3 className="text-xl font-semibold text-emerald-700 mb-2">{t('visionTitle')}</h3>
                <p className="text-gray-700 leading-relaxed">{t('visionText')}</p>
              </div>
            </section>

            {/* Milestones */}
            <section id="milestones" className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
              <h2 className="text-2xl font-bold text-emerald-700 mb-4">{t('milestonesTitle')}</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {L.milestones.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </section>

            {/* EPR Section Anchor */}
            <section id="epr" className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-lg p-6 border border-emerald-100">
              <h2 className="text-2xl font-bold text-emerald-700 mb-2">{t('eprIntroTitle')}</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {t('eprFullText')}
              </p>
            </section>
          </div>

          {/* Side Nav */}
          <aside className="lg:col-span-1">
            <nav className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100 sticky top-24">
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#history" className="block px-3 py-2 rounded-lg hover:bg-emerald-50 text-gray-700">{t('historyTitle')}</a>
                </li>
                <li>
                  <a href="#mission-vision" className="block px-3 py-2 rounded-lg hover:bg-emerald-50 text-gray-700">{t('missionTitle')} & {t('visionTitle')}</a>
                </li>
                <li>
                  <a href="#milestones" className="block px-3 py-2 rounded-lg hover:bg-emerald-50 text-gray-700">{t('milestonesTitle')}</a>
                </li>
                <li>
                  <a href="#epr" className="block px-3 py-2 rounded-lg hover:bg-emerald-50 text-gray-700">EPR</a>
                </li>
              </ul>
            </nav>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
