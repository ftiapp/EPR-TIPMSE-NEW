'use client';

import { useEffect, useRef, useState } from 'react';
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
  const [, setCheckingDup] = useState(false);
  const [dupCheckTimeout, setDupCheckTimeout] = useState(null);
  const [nameStatus, setNameStatus] = useState(null); // null, 'checking', 'available', 'duplicate'
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  // Refs for scrolling to fields on error
  const titleRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const orgRef = useRef(null);
  const deptRef = useRef(null);
  const router = useRouter();
  const { t, language } = useLanguage();

  // Removed countdown logic to keep registration always open

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
    } catch {
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
    } catch {
      return false;
    } finally {
      setCheckingDup(false);
    }
  }

  function validateForm() {
    const errs = {};
    if (!form.title) errs.title = language === 'th' ? 'โปรดเลือกคำนำหน้า' : 'Title is required';
    if (!form.first_name) errs.first_name = language === 'th' ? 'โปรดกรอกชื่อ' : 'First name is required';
    if (!form.last_name) errs.last_name = language === 'th' ? 'โปรดกรอกนามสกุล' : 'Last name is required';
    if (!form.phone_number) errs.phone_number = language === 'th' ? 'โปรดกรอกเบอร์โทรศัพท์' : 'Phone number is required';
    if (!form.email) errs.email = language === 'th' ? 'โปรดกรอกอีเมล' : 'Email is required';
    if (!form.organization) errs.organization = language === 'th' ? 'โปรดกรอกหน่วยงาน/องค์กร' : 'Organization is required';
    if (!form.department) errs.department = language === 'th' ? 'โปรดกรอกหน่วยงาน/แผนก' : 'Department is required';
    if (!form.participant_type) errs.participant_type = language === 'th' ? 'โปรดเลือกประเภทผู้เข้าร่วม' : 'Participant type is required';
    if (!form.consent_given) errs.consent_given = language === 'th' ? 'ต้องยอมรับข้อตกลงก่อน' : 'You must accept the consent';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = language === 'th' ? 'อีเมลไม่ถูกต้อง' : 'Invalid email address';
    }
    setFieldErrors(errs);
    if (Object.keys(errs).length) {
      // Scroll to the first error (prioritize title as requested)
      if (errs.title && titleRef.current) {
        titleRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (errs.first_name && firstNameRef.current) {
        firstNameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (errs.last_name && lastNameRef.current) {
        lastNameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (errs.phone_number && phoneRef.current) {
        phoneRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (errs.email && emailRef.current) {
        emailRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (errs.organization && orgRef.current) {
        orgRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (errs.department && deptRef.current) {
        deptRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
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
        setFieldErrors(prev => ({
          ...prev,
          first_name: language === 'th' ? 'ชื่อ-นามสกุลนี้ได้ลงทะเบียนแล้ว' : 'This name is already registered',
          last_name: language === 'th' ? 'ชื่อ-นามสกุลนี้ได้ลงทะเบียนแล้ว' : 'This name is already registered',
        }));
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-teal-50 relative overflow-hidden font-prompt">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-200/15 rounded-full blur-2xl"></div>
      </div>

      <Header />

      {/* Loading Overlay */}
      {showLoadingOverlay && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[70] flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-green-100 flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 absolute top-0 left-0"></div>
            </div>
            <div className="text-center">
              <p className="text-gray-700 font-semibold text-lg">
                {t ? (language === 'th' ? 'กำลังส่งอีเมลยืนยัน...' : 'Sending confirmation email...') : 'กำลังส่งอีเมลยืนยัน...'}
              </p>
              <p className="text-green-600 text-sm mt-2">กรุณารอสักครู่</p>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed top-4 right-4 z-[60] space-y-3">
        {toasts.map(tst => (
          <div key={tst.id} className={`min-w-[280px] max-w-sm px-5 py-4 rounded-2xl shadow-lg backdrop-blur-sm border-2 transform transition-all duration-300 ${
            tst.type === 'error' 
              ? 'bg-red-50/90 text-red-800 border-red-200 shadow-red-100/50' 
              : 'bg-green-50/90 text-green-800 border-green-200 shadow-green-100/50'
          }`}>
            <div className="flex items-center space-x-2">
              {tst.type === 'error' ? (
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              <span className="font-medium">{tst.message}</span>
            </div>
          </div>
        ))}
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-24 sm:pt-28">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {t ? t('registerTitle') : 'ลงทะเบียนเข้าร่วมงาน'}
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            {language === 'th' 
              ? 'กรุณากรอกข้อมูลให้ครบถ้วนเพื่อลงทะเบียนเข้าร่วมงานของเรา' 
              : 'Please fill in all required information to register for our event'
            }
          </p>

        </div>

        <form onSubmit={onSubmit} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-green-100/50 p-6 sm:p-8 lg:p-10 space-y-8">
          {/* Personal Information Section */}
          <div className="border-b border-green-100 pb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              {language === 'th' ? 'ข้อมูลส่วนตัว' : 'Personal Information'}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <label className="block text-sm font-semibold mb-3 text-gray-700">{t ? t('regTitleLabel') : 'คำนำหน้า'}</label>
                <div className="relative">
                  <select
                    ref={titleRef}
                    className={`w-full rounded-2xl border-2 bg-white/90 text-gray-900 p-4 focus:outline-none focus:ring-4 transition-all duration-200 appearance-none ${fieldErrors.title ? 'border-red-300 bg-red-50/50 focus:ring-red-200/50' : 'border-green-200 focus:ring-green-300/30 focus:border-green-400'}`}
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
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {fieldErrors.title && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.title}</p>
                )}
              </div>
              
              <div className="lg:col-span-1">
                <label className="block text-sm font-semibold mb-3 text-gray-700">{t ? t('firstName') : 'ชื่อ'}</label>
                <div className="relative">
                  <input
                    ref={firstNameRef}
                    type="text"
                    className={`w-full rounded-2xl border-2 p-4 focus:outline-none focus:ring-4 transition-all duration-200 ${
                      nameStatus === 'duplicate' 
                        ? 'border-red-300 bg-red-50/50 focus:ring-red-200/50' 
                        : nameStatus === 'available' 
                        ? 'border-green-400 bg-green-50/50 focus:ring-green-300/30' 
                        : fieldErrors.first_name 
                        ? 'border-red-300 bg-red-50/50 focus:ring-red-200/50' 
                        : 'border-green-200 bg-white/90 focus:ring-green-300/30 focus:border-green-400'
                    }`}
                    value={form.first_name}
                    onChange={e => update('first_name', e.target.value)}
                    placeholder={language === 'th' ? 'กรอกชื่อ' : 'Enter first name'}
                    required
                  />
                  {nameStatus === 'checking' && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-300 border-t-green-600"></div>
                    </div>
                  )}
                  {nameStatus === 'available' && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {fieldErrors.first_name && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.first_name}</p>
                )}
              </div>

              <div className="lg:col-span-1">
                <label className="block text-sm font-semibold mb-3 text-gray-700">{t ? t('lastName') : 'นามสกุล'}</label>
                <div className="relative">
                  <input
                    ref={lastNameRef}
                    type="text"
                    className={`w-full rounded-2xl border-2 p-4 focus:outline-none focus:ring-4 transition-all duration-200 ${
                      nameStatus === 'duplicate' 
                        ? 'border-red-300 bg-red-50/50 focus:ring-red-200/50' 
                        : nameStatus === 'available' 
                        ? 'border-green-400 bg-green-50/50 focus:ring-green-300/30' 
                        : fieldErrors.last_name 
                        ? 'border-red-300 bg-red-50/50 focus:ring-red-200/50' 
                        : 'border-green-200 bg-white/90 focus:ring-green-300/30 focus:border-green-400'
                    }`}
                    value={form.last_name}
                    onChange={e => update('last_name', e.target.value)}
                    placeholder={language === 'th' ? 'กรอกนามสกุล' : 'Enter last name'}
                    required
                  />
                  {nameStatus === 'checking' && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-300 border-t-green-600"></div>
                    </div>
                  )}
                </div>
                {fieldErrors.last_name && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.last_name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="border-b border-green-100 pb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              {language === 'th' ? 'ข้อมูลการติดต่อ' : 'Contact Information'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-700">{t ? t('phoneNumber') : 'เบอร์โทรศัพท์'}</label>
                <div className="relative">
                  <input
                    ref={phoneRef}
                    type="tel"
                    className={`w-full rounded-2xl border-2 bg-white/90 text-gray-900 p-4 pl-12 focus:outline-none focus:ring-4 transition-all duration-200 ${fieldErrors.phone_number ? 'border-red-300 bg-red-50/50 focus:ring-red-200/50' : 'border-green-200 focus:ring-green-300/30 focus:border-green-400'}`}
                    value={form.phone_number}
                    onChange={e => update('phone_number', e.target.value)}
                    placeholder={language === 'th' ? 'กรอกเบอร์โทรศัพท์' : 'Enter phone number'}
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
                {fieldErrors.phone_number && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.phone_number}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-700">{t ? t('email') : 'อีเมล'}</label>
                <div className="relative">
                  <input
                    ref={emailRef}
                    type="email"
                    className={`w-full rounded-2xl border-2 bg-white/90 text-gray-900 p-4 pl-12 focus:outline-none focus:ring-4 transition-all duration-200 ${fieldErrors.email ? 'border-red-300 bg-red-50/50 focus:ring-red-200/50' : 'border-green-200 focus:ring-green-300/30 focus:border-green-400'}`}
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    placeholder={language === 'th' ? 'กรอกที่อยู่อีเมล' : 'Enter email address'}
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>
                {fieldErrors.email && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Organization Information Section */}
          <div className="border-b border-green-100 pb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 8a1 1 0 011-1h1a1 1 0 011 1v2a1 1 0 01-1 1H8a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                </svg>
              </div>
              {language === 'th' ? 'ข้อมูลองค์กร' : 'Organization Information'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-700">{t ? t('organization') : 'หน่วยงาน/องค์กร'} <span className="text-red-500">*</span></label>
                <input
                  ref={orgRef}
                  type="text"
                  className={`w-full rounded-2xl border-2 bg-white/90 p-4 focus:outline-none focus:ring-4 transition-all duration-200 ${fieldErrors.organization ? 'border-red-300 bg-red-50/50 focus:ring-red-200/50' : 'border-green-200 focus:ring-green-300/30 focus:border-green-400'}`}
                  value={form.organization}
                  onChange={e => update('organization', e.target.value)}
                  placeholder={language === 'th' ? 'ชื่อหน่วยงานหรือบริษัท' : 'Organization or company name'}
                  required
                />
                {fieldErrors.organization && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.organization}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-700">{t ? t('department') : 'แผนก'} <span className="text-red-500">*</span></label>
                <input
                  ref={deptRef}
                  type="text"
                  className={`w-full rounded-2xl border-2 bg-white/90 p-4 focus:outline-none focus:ring-4 transition-all duration-200 ${fieldErrors.department ? 'border-red-300 bg-red-50/50 focus:ring-red-200/50' : 'border-green-200 focus:ring-green-300/30 focus:border-green-400'}`}
                  value={form.department}
                  onChange={e => update('department', e.target.value)}
                  placeholder={language === 'th' ? 'แผนกที่สังกัด' : 'Department'}
                  required
                />
                {fieldErrors.department && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.department}</p>
                )}
              </div>
            </div>
          </div>

          {/* Participant Type Section */}
          <div className="pb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              {t ? t('participantType') : 'ประเภทผู้เข้าร่วม'}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { 
                  label: t ? t('participantTypes.participant') : 'ผู้เข้าร่วมงาน', 
                  value: 'participant',
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  )
                },
                { 
                  label: t ? t('participantTypes.speaker') : 'วิทยากร', 
                  value: 'speaker',
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  )
                },
                { 
                  label: t ? t('participantTypes.executive') : 'ผู้บริหาร', 
                  value: 'executive',
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.734.99A.996.996 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.577V12a1 1 0 11-2 0v-1.423l-1.246-.709a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.423l1.246.709a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.423V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clipRule="evenodd" />
                    </svg>
                  )
                },
              ].map(opt => (
                <label key={opt.value} className={`group relative cursor-pointer rounded-2xl border-2 p-6 transition-all duration-200 ${
                  form.participant_type === opt.value
                    ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg shadow-green-100/50'
                    : 'border-green-200 bg-white/70 hover:border-green-300 hover:bg-green-50/50'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                      form.participant_type === opt.value
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                        : 'bg-green-100 text-green-600 group-hover:bg-green-200'
                    }`}>
                      {opt.icon}
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-gray-800">{opt.label}</span>
                    </div>
                    <input
                      type="radio"
                      name="participant_type"
                      value={opt.value}
                      checked={form.participant_type === opt.value}
                      onChange={() => update('participant_type', opt.value)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                      form.participant_type === opt.value
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300 bg-white'
                    }`}>
                      {form.participant_type === opt.value && (
                        <div className="w-full h-full rounded-full bg-white transform scale-[0.4]"></div>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {fieldErrors.participant_type && (
              <p className="mt-2 text-sm text-red-600">{fieldErrors.participant_type}</p>
            )}
          </div>

          {/* Consent Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
            <div className="flex items-start space-x-4">
              <div className="relative mt-1">
                <input
                  id="consent"
                  type="checkbox"
                  className="sr-only"
                  checked={form.consent_given}
                  onChange={e => update('consent_given', e.target.checked)}
                  required
                />
                <label
                  htmlFor="consent"
                  className={`flex items-center justify-center w-6 h-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    form.consent_given
                      ? 'bg-green-500 border-green-500'
                      : 'bg-white border-gray-300 hover:border-green-400'
                  }`}
                >
                  {form.consent_given && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </label>
              </div>
              <label htmlFor="consent" className="text-sm leading-relaxed text-gray-700 cursor-pointer">
                <span className="font-semibold text-green-700">
                  {language === 'th' ? 'การให้ความยินยอม: ' : 'Consent Agreement: '}
                </span>
                {t ? t('consentText') : 'ข้าพเจ้ายินยอมให้เก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลตามนโยบายความเป็นส่วนตัวของผู้จัดงาน'}
              </label>
            </div>
            {fieldErrors.consent_given && (
              <p className="mt-2 text-sm text-red-600">{fieldErrors.consent_given}</p>
            )}
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="p-5 rounded-2xl bg-red-50 text-red-700 border-2 border-red-200 flex items-center space-x-3">
              <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{String(error)}</span>
            </div>
          )}
          
          {success && (
            <div className="p-5 rounded-2xl bg-green-50 text-green-700 border-2 border-green-200 flex items-center space-x-3">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <span className="font-medium">
                  {(t ? t('registrationSuccess') : 'ลงทะเบียนสำเร็จ!')} 
                </span>
                <br />
                <span className="text-sm">
                  รหัสผู้ลงทะเบียนของคุณ: <strong className="font-bold text-green-800">{success.code}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={submitting || nameStatus === 'duplicate'}
              className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 px-8 py-4 text-white font-semibold text-lg shadow-xl hover:shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center space-x-3">
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                    <span>{t ? 'Submitting...' : 'กำลังส่ง...'}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{t ? t('submitRegistration') : 'ส่งข้อมูลลงทะเบียน'}</span>
                  </>
                )}
              </div>
            </button>
            
            <p className="text-center text-sm text-gray-500 mt-4">
              {language === 'th' 
                ? 'เมื่อกดส่งข้อมูล คุณจะได้รับอีเมลยืนยันการลงทะเบียน'
                : 'You will receive a confirmation email after submitting'
              }
            </p>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}