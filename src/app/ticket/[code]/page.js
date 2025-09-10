'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import QRCode from 'qrcode';

export default function TicketPage() {
  const params = useParams();
  const { t, language } = useLanguage();
  const [registrant, setRegistrant] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [emailResent, setEmailResent] = useState(false);

  // Initialize emailResent from localStorage when registrant loads
  useEffect(() => {
    if (registrant && registrant.uuid && typeof window !== 'undefined') {
      const key = `resend_email_${registrant.uuid}`;
      const alreadyResent = localStorage.getItem(key) === '1';
      if (alreadyResent) setEmailResent(true);
    }
  }, [registrant]);

  // Function to download QR code
  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `EPR-Event-QR-${registrant.uuid}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to resend email
  const resendEmail = async () => {
    if (!registrant || resendingEmail || emailResent) return;
    
    setResendingEmail(true);
    try {
      const res = await fetch('/api/resend-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          uuid: registrant.uuid,
          toEmail: registrant.email,
          toName: `${registrant.title}${registrant.first_name} ${registrant.last_name}`,
        })
      });
      
      const data = await res.json();
      if (data.ok) {
        setEmailResent(true);
        try {
          if (typeof window !== 'undefined') {
            const key = `resend_email_${registrant.uuid}`;
            localStorage.setItem(key, '1');
          }
        } catch {}
        alert(t ? (language === 'th' ? 'ส่งอีเมลสำเร็จแล้ว' : 'Email sent successfully') : 'ส่งอีเมลสำเร็จแล้ว');
      } else {
        alert(data.message || (t ? (language === 'th' ? 'เกิดข้อผิดพลาด' : 'Error occurred') : 'เกิดข้อผิดพลาด'));
      }
    } catch (err) {
      alert(t ? (language === 'th' ? 'เกิดข้อผิดพลาดในการส่งอีเมล' : 'Failed to send email') : 'เกิดข้อผิดพลาดในการส่งอีเมล');
    } finally {
      setResendingEmail(false);
    }
  };

  useEffect(() => {
    if (params.code) {
      fetchRegistrant(params.code);
    }
  }, [params.code]);

  async function fetchRegistrant(code) {
    try {
      const res = await fetch(`/api/ticket/${code}`);
      if (!res.ok) {
        throw new Error('Ticket not found');
      }
      const data = await res.json();
      setRegistrant(data.registrant);
      
      // Generate QR code with UUID only
      const qrData = data.registrant.uuid;
      
      const qrUrl = await QRCode.toDataURL(qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: '#059669',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 font-sans">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !registrant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 font-sans">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-24 text-center">
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              {t ? (language === 'th' ? 'ไม่พบข้อมูลการลงทะเบียน' : 'Registration Not Found') : 'ไม่พบข้อมูลการลงทะเบียน'}
            </h1>
            <p className="text-gray-600">
              {t ? (language === 'th' ? 'กรุณาตรวจสอบรหัสการลงทะเบียนของคุณ' : 'Please check your registration code') : 'กรุณาตรวจสอบรหัสการลงทะเบียนของคุณ'}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 font-sans">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pt-20 sm:pt-24">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            {t ? (language === 'th' ? 'บัตรเข้าร่วมงาน' : 'Event Ticket') : 'บัตรเข้าร่วมงาน'}
          </h1>
          <p className="text-gray-600">
            {t ? (language === 'th' ? 'กรุณานำบัตรนี้มาแสดงในวันงาน' : 'Please present this ticket on event day') : 'กรุณานำบัตรนี้มาแสดงในวันงาน'}
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl overflow-hidden">
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="text-center sm:text-left mb-4 sm:mb-0">
                <h2 className="text-xl sm:text-2xl font-bold">EPR Event by TIPMSE & FTI</h2>
                <p className="text-emerald-100 mt-1">
                  {t ? (language === 'th' ? 'วันอังคารที่ 30 กันยายน 2568' : 'Tuesday, September 30, 2025') : 'วันอังคารที่ 30 กันยายน 2568'}
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <p className="text-sm text-emerald-100">
                    {t ? (language === 'th' ? 'รหัสผู้เข้าร่วม' : 'Registration Code') : 'รหัสผู้เข้าร่วม'}
                  </p>
                  <p className="text-xl font-bold">{registrant.uuid}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Content */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Participant Info */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2">
                  {t ? (language === 'th' ? 'ข้อมูลผู้เข้าร่วม' : 'Participant Information') : 'ข้อมูลผู้เข้าร่วม'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      {t ? (language === 'th' ? 'ชื่อ-นามสกุล' : 'Full Name') : 'ชื่อ-นามสกุล'}
                    </label>
                    <p className="text-lg font-semibold text-gray-800">
                      {registrant.title}{registrant.first_name} {registrant.last_name}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      {t ? (language === 'th' ? 'อีเมล' : 'Email') : 'อีเมล'}
                    </label>
                    <p className="text-gray-800">{registrant.email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      {t ? (language === 'th' ? 'โทรศัพท์' : 'Phone') : 'โทรศัพท์'}
                    </label>
                    <p className="text-gray-800">{registrant.phone_number}</p>
                  </div>
                  
                  {registrant.organization && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        {t ? (language === 'th' ? 'องค์กร' : 'Organization') : 'องค์กร'}
                      </label>
                      <p className="text-gray-800">{registrant.organization}</p>
                    </div>
                  )}
                  
                  {registrant.department && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        {t ? (language === 'th' ? 'แผนก' : 'Department') : 'แผนก'}
                      </label>
                      <p className="text-gray-800">{registrant.department}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      {t ? (language === 'th' ? 'ประเภทผู้เข้าร่วม' : 'Participant Type') : 'ประเภทผู้เข้าร่วม'}
                    </label>
                    <p className="text-gray-800 capitalize">
                      {t ? t(`participantTypes.${registrant.participant_type}`) : registrant.participant_type}
                    </p>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {t ? (language === 'th' ? 'QR Code สำหรับเช็คอิน' : 'QR Code for Check-in') : 'QR Code สำหรับเช็คอิน'}
                </h3>
                
                {qrCodeUrl && (
                  <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-emerald-200">
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code" 
                      className="w-48 h-48 sm:w-56 sm:h-56"
                    />
                  </div>
                )}
                
                <p className="text-sm text-gray-600 text-center max-w-xs">
                  {t ? (language === 'th' ? 'แสดง QR Code นี้ที่จุดลงทะเบียนในวันงาน' : 'Show this QR Code at registration on event day') : 'แสดง QR Code นี้ที่จุดลงทะเบียนในวันงาน'}
                </p>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-gray-50 p-6 sm:p-8 border-t">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {t ? (language === 'th' ? 'รายละเอียดงาน' : 'Event Details') : 'รายละเอียดงาน'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-600">
                  {t ? (language === 'th' ? 'วันที่' : 'Date') : 'วันที่'}
                </p>
                <p className="text-gray-800">
                  {t ? (language === 'th' ? 'วันอังคารที่ 30 กันยายน 2568' : 'Tuesday, September 30, 2025') : 'วันอังคารที่ 30 กันยายน 2568'}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-600">
                  {t ? (language === 'th' ? 'เวลา' : 'Time') : 'เวลา'}
                </p>
                <p className="text-gray-800">09:00 – 12:00</p>
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <p className="font-medium text-gray-600">
                  {t ? (language === 'th' ? 'สถานที่' : 'Venue') : 'สถานที่'}
                </p>
                <p className="text-gray-800">
                  {t ? (language === 'th' ? 'ห้องเพลนารีฮอล์ ชั้น 1 ศูนย์การประชุมแห่งชาติสิริกิติ์' : 'Plenary Hall, 1st Floor, Queen Sirikit National Convention Center') : 'ห้องเพลนารีฮอล์ ชั้น 1 ศูนย์การประชุมแห่งชาติสิริกิติ์'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={downloadQRCode}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium shadow-lg hover:shadow-xl transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t ? (language === 'th' ? 'ดาวน์โหลด QR Code' : 'Download QR Code') : 'ดาวน์โหลด QR Code'}
          </button>
          
          <button
            onClick={() => {
              if (navigator.share && qrCodeUrl) {
                navigator.share({
                  title: 'EPR Event Ticket',
                  text: `Registration code: ${registrant.uuid}`,
                  url: window.location.href
                });
              }
            }}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white border-2 border-emerald-500 text-emerald-600 font-medium shadow-lg hover:shadow-xl hover:bg-emerald-50 transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            {t ? (language === 'th' ? 'แชร์' : 'Share') : 'แชร์'}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
