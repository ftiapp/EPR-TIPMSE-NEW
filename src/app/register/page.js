'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

const initialState = {
  title: '',
  first_name: '',
  last_name: '',
  phone_number: '',
  email: '',
  organization: '',
  department: '',
  participant_type: 'participant',
  consent_given: false,
};

export default function RegisterPage() {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [checkingDup, setCheckingDup] = useState(false);
  const [dupCheckTimeout, setDupCheckTimeout] = useState(null);
  const [nameStatus, setNameStatus] = useState(null); // null, 'checking', 'available', 'duplicate'
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const router = useRouter();
  const { t, language } = useLanguage();

  function update(k, v) {
    setForm(prev => ({ ...prev, [k]: v }));
    
    // Real-time duplicate check for name fields
    if (k === 'first_name' || k === 'last_name') {
      if (dupCheckTimeout) clearTimeout(dupCheckTimeout);
      setNameStatus('checking');
      
      const timeout = setTimeout(() => {
        const firstName = k === 'first_name' ? v : form.first_name;
        const lastName = k === 'last_name' ? v : form.last_name;
        
        if (firstName && lastName) {
          checkDuplicateNameRealtime(firstName, lastName);
        } else {
          setNameStatus(null);
        }
      }, 800);
      
      setDupCheckTimeout(timeout);
    }
  }

  function pushToast(message, type = 'error', id = undefined) {
    const toast = { id: id || Date.now() + Math.random(), message, type };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id));
    }, 4000);
  }

  async function checkDuplicateNameRealtime(firstName, lastName) {
    try {
      const params = new URLSearchParams({ first_name: firstName.trim(), last_name: lastName.trim() });
      const res = await fetch(`/api/register/check-name?${params.toString()}`);
      if (res.status === 409) {
        setNameStatus('duplicate');
        pushToast(t ? t('duplicateName') : 'ชื่อ-นามสกุลนี้ได้ลงทะเบียนแล้ว', 'error');
      } else {
        setNameStatus('available');
      }
    } catch (e) {
      setNameStatus(null);
    }
  }

  async function checkDuplicateName() {
    if (!form.first_name || !form.last_name) return false;
    setCheckingDup(true);
    try {
      const params = new URLSearchParams({ first_name: form.first_name.trim(), last_name: form.last_name.trim() });
      const res = await fetch(`/api/register/check-name?${params.toString()}`);
      if (res.status === 409) return true;
      return false;
    } catch (e) {
      return false;
    } finally {
      setCheckingDup(false);
    }
  }

  function validateForm() {
    const missing = [];
    if (!form.title) missing.push('title');
    if (!form.first_name) missing.push('first_name');
    if (!form.last_name) missing.push('last_name');
    if (!form.phone_number) missing.push('phone_number');
    if (!form.email) missing.push('email');
    if (!form.participant_type) missing.push('participant_type');
    if (!form.consent_given) missing.push('consent_given');
    if (missing.length) {
      missing.forEach(f => pushToast((t ? t('fieldRequired') : 'Required') + `: ${f}`));
      return false;
    }
    // Basic email pattern
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      pushToast(t ? t('invalidEmail') : 'Invalid email');
      return false;
    }
    return true;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      if (!validateForm()) return;
      
      // Show loading overlay during submission
      setShowLoadingOverlay(true);
      
      // Pre-check duplicate first_name + last_name
      const isDup = await checkDuplicateName();
      if (isDup) {
        pushToast(t ? t('duplicateName') : 'Duplicate name');
        return;
      }
      
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        if (res.status === 409) {
          pushToast(t ? t('duplicateName') : 'Duplicate name');
          return;
        }
        throw new Error(data?.message || (t ? t('registrationError') : 'Registration failed'));
      }
      
      // Navigate to ticket page with UUID
      router.push(`/ticket/${data.code}`);
    } catch (err) {
      const msg = err.message || (t ? t('registrationError') : 'Error');
      setError(msg);
      pushToast(msg);
    } finally {
      setSubmitting(false);
      setShowLoadingOverlay(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 font-sans text-gray-900 dark:text-gray-100">
      <Header />

      {/* Loading Overlay */}
      {showLoadingOverlay && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            <p className="text-gray-700 font-medium">
              {t ? (language === 'th' ? 'กำลังส่งอีเมลยืนยัน...' : 'Sending confirmation email...') : 'กำลังส่งอีเมลยืนยัน...'}
            </p>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed top-4 right-4 z-[60] space-y-2">
        {toasts.map(tst => (
          <div key={tst.id} className={`min-w-[260px] max-w-sm px-4 py-3 rounded-lg shadow-lg border ${tst.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}>
            {tst.message}
          </div>
        ))}
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pt-20 sm:pt-24">{/* Responsive padding */}
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
          {t ? t('registerTitle') : 'ลงทะเบียนเข้าร่วมงาน'}
        </h1>

        <form onSubmit={onSubmit} className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t ? t('regTitleLabel') : 'คำนำหน้า'}</label>
              <select
                className="w-full rounded-md border border-emerald-200 p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={form.title}
                onChange={e => update('title', e.target.value)}
                required
              >
                <option value="">{t ? t('regTitlePlaceholder') : 'เลือกคำนำหน้า'}</option>
                <option value="คุณ">{language === 'th' ? 'คุณ' : 'Mr./Ms.'}</option>
                <option value="นาย">{language === 'th' ? 'นาย' : 'Mr.'}</option>
                <option value="นาง">{language === 'th' ? 'นาง' : 'Mrs.'}</option>
                <option value="นางสาว">{language === 'th' ? 'นางสาว' : 'Ms.'}</option>
                <option value="ดร.">{language === 'th' ? 'ดร.' : 'Dr.'}</option>
              </select>
            </div>
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium mb-1">{t ? t('firstName') : 'ชื่อ'}</label>
              <div className="relative">
                <input
                  type="text"
                  className={`w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                    nameStatus === 'duplicate' ? 'border-red-300 bg-red-50' : 
                    nameStatus === 'available' ? 'border-emerald-300 bg-emerald-50' : 
                    'border-emerald-200'
                  }`}
                  value={form.first_name}
                  onChange={e => update('first_name', e.target.value)}
                  required
                />
                {nameStatus === 'checking' && (
                  <div className="absolute right-2 top-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500"></div>
                  </div>
                )}
              </div>
            </div>
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium mb-1">{t ? t('lastName') : 'นามสกุล'}</label>
              <div className="relative">
                <input
                  type="text"
                  className={`w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                    nameStatus === 'duplicate' ? 'border-red-300 bg-red-50' : 
                    nameStatus === 'available' ? 'border-emerald-300 bg-emerald-50' : 
                    'border-emerald-200'
                  }`}
                  value={form.last_name}
                  onChange={e => update('last_name', e.target.value)}
                  required
                />
                {nameStatus === 'checking' && (
                  <div className="absolute right-2 top-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t ? t('phoneNumber') : 'โทรศัพท์'}</label>
              <input
                type="tel"
                className="w-full rounded-md border border-emerald-200 p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={form.phone_number}
                onChange={e => update('phone_number', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t ? t('email') : 'อีเมล'}</label>
              <input
                type="email"
                className="w-full rounded-md border border-emerald-200 p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t ? t('organization') : 'หน่วยงาน/องค์กร'}</label>
              <input
                type="text"
                className="w-full rounded-md border border-emerald-200 p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={form.organization}
                onChange={e => update('organization', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t ? t('department') : 'แผนก'}</label>
              <input
                type="text"
                className="w-full rounded-md border border-emerald-200 p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={form.department}
                onChange={e => update('department', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t ? t('participantType') : 'ประเภทผู้เข้าร่วม'}</label>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {[
                { label: t ? t('participantTypes.participant') : 'ผู้เข้าร่วมงาน', value: 'participant' },
                { label: t ? t('participantTypes.speaker') : 'วิทยากร', value: 'speaker' },
                { label: t ? t('participantTypes.executive') : 'ผู้บริหาร', value: 'executive' },
              ].map(opt => (
                <label key={opt.value} className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-2 sm:px-3 py-2 rounded-md text-sm sm:text-base">
                  <input
                    type="radio"
                    name="participant_type"
                    checked={form.participant_type === opt.value}
                    onChange={() => update('participant_type', opt.value)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input
              id="consent"
              type="checkbox"
              className="mt-1"
              checked={form.consent_given}
              onChange={e => update('consent_given', e.target.checked)}
              required
            />
            <label htmlFor="consent" className="text-sm">
              {t ? t('consentText') : 'ข้าพเจ้ายินยอมให้เก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลตามนโยบายความเป็นส่วนตัวของผู้จัดงาน'}
            </label>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-50 text-red-700 border border-red-200">
              {String(error)}
            </div>
          )}
          {success && (
            <div className="p-3 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              {(t ? t('registrationSuccess') : 'ลงทะเบียนสำเร็จ!')} {t ? '' : ''} รหัสผู้ลงทะเบียนของคุณ: <strong>{success.code}</strong>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || nameStatus === 'duplicate'}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (t ? 'Submitting...' : 'กำลังส่ง...') : (t ? t('submitRegistration') : 'ส่งข้อมูลลงทะเบียน')}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
