'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function AdminCheckinPage() {
  const videoRef = useRef(null);
  const [scannerReady, setScannerReady] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [cameraPermission, setCameraPermission] = useState('prompt'); // 'granted' | 'denied' | 'prompt'
  const [manualCode, setManualCode] = useState('');
  const [nameQuery, setNameQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const searchTimer = useRef(null);
  const [currentUuid, setCurrentUuid] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [result, setResult] = useState(null); // { registrant, already }
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Start camera and scanner using BarcodeDetector if available
  useEffect(() => {
    let stream;
    let rafId;
    let track;
    let detector;

    function stopAll() {
      if (rafId) cancelAnimationFrame(rafId);
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(t => t.stop());
      }
      if (track) track.stop();
    }

    async function initScanner(s) {
      try {
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          await videoRef.current.play();
        }
        if ('BarcodeDetector' in window) {
          detector = new window.BarcodeDetector({ formats: ['qr_code'] });
          const scan = async () => {
            if (!videoRef.current) return;
            try {
              const barcodes = await detector.detect(videoRef.current);
              if (barcodes && barcodes.length) {
                const raw = (barcodes[0].rawValue || '').trim();
                if (raw && raw !== currentUuid) {
                  onCodeDetected(raw);
                }
              }
            } catch {}
            rafId = requestAnimationFrame(scan);
          };
          rafId = requestAnimationFrame(scan);
          setScannerReady(true);
        } else {
          setScannerReady(false);
        }
      } catch (e) {
        console.error(e);
        setCameraError('ไม่สามารถเริ่มสแกนเนอร์ได้');
      }
    }

    async function checkPermission() {
      try {
        if (navigator.permissions && navigator.permissions.query) {
          const status = await navigator.permissions.query({ name: 'camera' });
          setCameraPermission(status.state);
          status.onchange = () => setCameraPermission(status.state);
        }
      } catch {}
    }

    checkPermission();

    return () => {
      stopAll();
    };
  }, []);

  async function requestCamera() {
    try {
      setCameraError('');
      const constraints = { video: { facingMode: 'environment' } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraPermission('granted');
      await new Promise(r => setTimeout(r, 0));
      // Initialize scanner with the obtained stream
      if (videoRef.current) {
        // Call a lightweight init in place
      }
      // Re-run the init logic locally (duplicated small part to avoid refactor complexity)
      try {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        if ('BarcodeDetector' in window) {
          const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
          const scan = async () => {
            if (!videoRef.current) return;
            try {
              const barcodes = await detector.detect(videoRef.current);
              if (barcodes && barcodes.length) {
                const raw = (barcodes[0].rawValue || '').trim();
                if (raw && raw !== currentUuid) onCodeDetected(raw);
              }
            } catch {}
            requestAnimationFrame(scan);
          };
          requestAnimationFrame(scan);
          setScannerReady(true);
        } else {
          setScannerReady(false);
        }
      } catch (e) {
        console.error(e);
        setCameraError('ไม่สามารถเริ่มสแกนเนอร์ได้');
      }
    } catch (e) {
      console.error(e);
      setCameraPermission('denied');
      const isSecure = typeof window !== 'undefined' && (location.protocol === 'https:' || location.hostname === 'localhost');
      setCameraError(isSecure ? 'ไม่ได้รับอนุญาตให้ใช้กล้อง กรุณาอนุญาตการใช้งานกล้องในเบราว์เซอร์' : 'การใช้กล้องต้องเข้าผ่าน HTTPS หรือ localhost');
    }
  }

  async function onCodeDetected(code) {
    const uuid = String(code).trim();
    if (!uuid) return;
    setCurrentUuid(uuid);
    await doLookup(uuid);
  }

  // Search by name/email/phone/org
  async function onSearch(q) {
    const term = q.trim();
    if (!term) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const res = await fetch(`/api/admin/checkin/search?q=${encodeURIComponent(term)}&limit=20`);
      const data = await res.json();
      if (data.ok) setSearchResults(data.items || []); else setSearchResults([]);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }

  function onChangeSearch(v) {
    setNameQuery(v);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(()=> onSearch(v), 400);
  }

  function selectPerson(item) {
    if (!item?.uuid) return;
    setCurrentUuid(item.uuid);
    doLookup(item.uuid);
  }

  async function doLookup(uuid) {
    setLookupLoading(true);
    setResult(null);
    setMessage('');
    try {
      const res = await fetch(`/api/admin/checkin/lookup?uuid=${encodeURIComponent(uuid)}`);
      const data = await res.json();
      if (data.ok) {
        setResult({ registrant: data.registrant });
        setShowModal(true);
      } else {
        setMessage(data.message || 'ไม่พบผู้ลงทะเบียน');
      }
    } catch (e) {
      setMessage('เกิดข้อผิดพลาดในการค้นหา');
    } finally {
      setLookupLoading(false);
    }
  }

  async function confirmCheckin() {
    if (!currentUuid) return;
    setConfirmLoading(true);
    try {
      const res = await fetch('/api/admin/checkin/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid: currentUuid })
      });
      const data = await res.json();
      if (data.ok) {
        const already = data.already || data.registrant?.check_in_participant === 1 || data.registrant?.check_in_status === 'checked_in';
        setResult({ registrant: data.registrant, already });
        setMessage(already ? 'เช็คอินแล้ว' : 'เช็คอินสำเร็จ');
        // Keep modal open; allow user to acknowledge, then reset for next scan
      } else {
        setMessage(data.message || 'เช็คอินไม่สำเร็จ');
      }
    } catch {
      setMessage('เกิดข้อผิดพลาดในการเช็คอิน');
    } finally {
      setConfirmLoading(false);
    }
  }

  const alreadyChecked = result && (result.already || result.registrant?.check_in_participant === 1 || result.registrant?.check_in_status === 'checked_in');

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-emerald-700">หน้าเช็คอิน</h1>
          <Link href="/admin" className="px-4 py-2 rounded-xl bg-white border-2 border-emerald-500 text-emerald-700">กลับ Dashboard</Link>
        </div>

        {/* Camera / Scanner */}
        <div className="bg-white/90 border border-emerald-100 rounded-2xl p-4 shadow mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="relative aspect-video bg-black/80 rounded-xl overflow-hidden">
                <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
                {!scannerReady && (
                  <div className="absolute inset-0 flex items-center justify-center text-white text-sm bg-black/30">กำลังเตรียมสแกนเนอร์...</div>
                )}
              </div>
              {/* Permission helper */}
              {cameraPermission !== 'granted' && (
                <div className="mt-3 p-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-sm">
                  <div className="font-semibold mb-2">ต้องขออนุญาตใช้กล้องก่อน</div>
                  <div className="mb-2">โปรดกดปุ่มด้านล่างเพื่อขออนุญาต หรือใช้การค้นหาชื่อ/กรอกโค้ดแทน</div>
                  <button onClick={requestCamera} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">ขออนุญาตใช้กล้อง</button>
                </div>
              )}
              {cameraError && <div className="text-red-600 text-sm mt-2">{cameraError}</div>}
            </div>
            <div className="space-y-3">
              <div className="text-gray-700 font-semibold">ค้นหาด้วยชื่อ/อีเมล/โทร/องค์กร</div>
              <div>
                <input value={nameQuery} onChange={e=>onChangeSearch(e.target.value)} placeholder="พิมพ์อย่างน้อย 2 ตัวอักษร..."
                  className="w-full rounded-xl border-2 border-emerald-200 p-3" />
                <div className="mt-2 max-h-56 overflow-auto rounded-xl border border-emerald-100 bg-white">
                  {searching ? (
                    <div className="p-3 text-sm text-gray-500">กำลังค้นหา...</div>
                  ) : (searchResults.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500">ไม่มีผลลัพธ์</div>
                  ) : searchResults.map(item => (
                    <button key={item.id} onClick={()=>selectPerson(item)} className="w-full text-left p-3 hover:bg-emerald-50 border-b last:border-b-0">
                      <div className="font-medium text-gray-800">{item.title}{item.first_name} {item.last_name}</div>
                      <div className="text-xs text-gray-500">องค์กร: {item.organization || '-'} • ประเภท: {item.participant_type}</div>
                      <div className="text-xs text-gray-500">อีเมล: {item.email} • โทร: {item.phone_number}</div>
                    </button>
                  )))}
                </div>
              </div>

              <div className="text-gray-700 font-semibold">หรือ กรอกโค้ดด้วยมือ</div>
              <div className="flex gap-2">
                <input value={manualCode} onChange={e=>setManualCode(e.target.value)} placeholder="ระบุ UUID / โค้ดลงทะเบียน"
                  className="flex-1 rounded-xl border-2 border-emerald-200 p-3" />
                <button onClick={()=>{ if (manualCode.trim()) { setCurrentUuid(manualCode.trim()); doLookup(manualCode.trim()); } }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white">ค้นหา</button>
              </div>
              {currentUuid && <div className="text-sm text-gray-600">โค้ดปัจจุบัน: <span className="font-mono">{currentUuid}</span></div>}
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="bg-white/90 border border-emerald-100 rounded-2xl p-4 shadow">
          {lookupLoading ? (
            <div>กำลังค้นหา...</div>
          ) : result?.registrant ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-emerald-700">{result.registrant.title}{result.registrant.first_name} {result.registrant.last_name}</div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${alreadyChecked ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                  {alreadyChecked ? 'เช็คอินแล้ว' : 'ยังไม่เช็คอิน'}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                <div>ประเภทผู้เข้าร่วม: <span className="font-semibold">{result.registrant.participant_type}</span></div>
                <div>องค์กร: <span className="font-semibold">{result.registrant.organization || '-'}</span></div>
                <div>อีเมล: <span className="font-semibold">{result.registrant.email}</span></div>
                <div>โทรศัพท์: <span className="font-semibold">{result.registrant.phone_number}</span></div>
                <div>UUID: <span className="font-mono">{result.registrant.uuid}</span></div>
                <div>เวลาเช็คอิน: <span className="font-semibold">{result.registrant.checked_in_at ? new Date(result.registrant.checked_in_at).toLocaleString() : '-'}</span></div>
              </div>

              {alreadyChecked ? (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700">รายการนี้เช็คอินแล้ว</div>
              ) : (
                <div className="flex gap-3">
                  <button disabled={confirmLoading} onClick={confirmCheckin} className="px-4 py-2 rounded-xl bg-emerald-600 text-white disabled:opacity-60">
                    {confirmLoading ? 'กำลังเช็คอิน...' : 'เช็คอิน'}
                  </button>
                  <button onClick={()=>{ setCurrentUuid(''); setResult(null); setMessage(''); }} className="px-4 py-2 rounded-xl bg-white border">ยกเลิก</button>
                </div>
              )}

              {message && <div className="text-emerald-700">{message}</div>}
            </div>
          ) : (
            <div className="text-gray-600">สแกน QR หรือกรอกโค้ดเพื่อค้นหา</div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && result?.registrant && (
        <div className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="text-lg font-semibold text-gray-800">ยืนยันการเช็คอิน</div>
              <button onClick={()=>{ setShowModal(false); setCurrentUuid(''); setResult(null); setMessage(''); }} className="text-gray-500 hover:text-gray-700">✖️</button>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-emerald-700">{result.registrant.title}{result.registrant.first_name} {result.registrant.last_name}</div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${alreadyChecked ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                  {alreadyChecked ? 'เช็คอินแล้ว' : 'ยังไม่เช็คอิน'}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                <div>ประเภท: <span className="font-semibold">{result.registrant.participant_type}</span></div>
                <div>องค์กร: <span className="font-semibold">{result.registrant.organization || '-'}</span></div>
                <div>อีเมล: <span className="font-semibold">{result.registrant.email}</span></div>
                <div>โทร: <span className="font-semibold">{result.registrant.phone_number}</span></div>
                <div>UUID: <span className="font-mono">{result.registrant.uuid}</span></div>
                <div>เวลาเช็คอิน: <span className="font-semibold">{result.registrant.checked_in_at ? new Date(result.registrant.checked_in_at).toLocaleString() : '-'}</span></div>
              </div>
              {message && <div className={`text-sm ${alreadyChecked ? 'text-blue-700' : 'text-emerald-700'}`}>{message}</div>}
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              {alreadyChecked ? (
                <button onClick={()=>{ setShowModal(false); setCurrentUuid(''); setResult(null); setMessage(''); }} className="px-4 py-2 rounded-lg bg-blue-600 text-white">รับทราบ</button>
              ) : (
                <>
                  <button onClick={()=>{ setShowModal(false); }} className="px-4 py-2 rounded-lg bg-white border">ยกเลิก</button>
                  <button disabled={confirmLoading} onClick={confirmCheckin} className="px-4 py-2 rounded-lg bg-emerald-600 text-white disabled:opacity-60">{confirmLoading ? 'กำลังเช็คอิน...' : 'เช็คอิน'}</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
