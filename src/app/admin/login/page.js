'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const nextPath = sp.get('next') || '/admin';

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.ok) {
        router.push(nextPath);
      } else {
        setError(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
      }
    } catch (e) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 font-sans p-4">
      {/* Force light color scheme to avoid Chrome dark mode inverting input text */}
      <style>{`
        :root { color-scheme: light only; }
        input, button, select, textarea { color: #111827; background-color: #ffffff; }
        input::placeholder { color: #6b7280; }
        /* Handle Chrome autocomplete on dark-mode */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-text-fill-color: #111827 !important;
          -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
          box-shadow: 0 0 0px 1000px #ffffff inset !important;
          caret-color: #111827 !important;
        }
      `}</style>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-emerald-100 p-8">
        <h1 className="text-2xl font-bold text-emerald-700 mb-6 text-center">Admin Login</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Username</label>
            <input
              className="w-full rounded-xl border-2 border-emerald-200 p-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-emerald-200 bg-white"
              value={username}
              onChange={e=>setUsername(e.target.value)}
              placeholder="Username"
              autoFocus
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full pr-12 rounded-xl border-2 border-emerald-200 p-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-emerald-200 bg-white"
                value={password}
                onChange={e=>setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onMouseDown={()=>setShowPassword(true)}
                onMouseUp={()=>setShowPassword(false)}
                onMouseLeave={()=>setShowPassword(false)}
                onTouchStart={()=>setShowPassword(true)}
                onTouchEnd={()=>setShowPassword(false)}
                aria-label="กดค้างเพื่อดูรหัสผ่าน"
                title="กดค้างเพื่อดูรหัสผ่าน"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  // Eye-off icon
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l1.747 1.747C2.843 6.393 1.898 7.79 1.41 8.57a1.872 1.872 0 0 0 0 1.86C3.226 13.207 6.89 17.25 12 17.25c1.77 0 3.33-.414 4.67-1.087l3.8 3.807a.75.75 0 1 0 1.06-1.06L3.53 2.47Zm10.678 12.799-1.21-1.21a3.75 3.75 0 0 1-4.557-4.557L6.97 7.031A9.878 9.878 0 0 0 3.18 9.44a.372.372 0 0 0 0 .36C4.773 11.96 7.89 15.75 12 15.75c.77 0 1.496-.106 2.208-.31Zm-2.86-2.86-2.255-2.255a2.25 2.25 0 0 0 2.255 2.255Zm5.284.028a3.73 3.73 0 0 0 .031-.437 3.75 3.75 0 0 0-3.75-3.75c-.148 0-.293.01-.437.03l-1.21-1.21c.53-.12 1.086-.17 1.647-.17 4.11 0 7.227 3.79 8.819 5.95.108.15.108.35 0 .51-.64.906-1.652 2.176-2.98 3.344l-2.12-2.12Z" />
                  </svg>
                ) : (
                  // Eye icon
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M12 5.25c-5.11 0-8.774 3.79-10.59 6.93a1.872 1.872 0 0 0 0 1.86C3.226 17.207 6.89 21 12 21s8.774-3.79 10.59-6.93a1.872 1.872 0 0 0 0-1.86C20.774 9.293 17.11 5.5 12 5.5Zm0 12.25c-4.11 0-7.227-3.79-8.819-5.95a.372.372 0 0 1 0-.36C4.773 8.04 7.89 4.25 12 4.25s7.227 3.79 8.819 5.95a.372.372 0 0 1 0 .36C19.227 13.71 16.11 17.5 12 17.5Zm0-8a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 0 0 0-6.5Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 font-semibold shadow-lg hover:shadow-xl disabled:opacity-60">
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-600">กำลังโหลด...</div>}>
      <LoginContent />
    </Suspense>
  );
}
