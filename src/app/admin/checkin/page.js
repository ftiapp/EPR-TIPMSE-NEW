'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function AdminCheckinPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);
  
  const [scannerReady, setScannerReady] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [cameraPermission, setCameraPermission] = useState('prompt');
  const [manualCode, setManualCode] = useState('');
  const [nameQuery, setNameQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const searchTimer = useRef(null);
  const [currentUuid, setCurrentUuid] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  // เริ่มกล้องและสแกนเนอร์
  useEffect(() => {
    // Auto-request camera on component mount
    requestCamera();
    
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setScannerReady(false);
  };

  const requestCamera = async () => {
    if (isInitializing) return;
    
    setIsInitializing(true);
    setCameraError('');
    
    try {
      // ตรวจสอบว่าเบราว์เซอร์รองรับ getUserMedia หรือไม่
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('เบราว์เซอร์ไม่รองรับการใช้งานกล้อง');
      }

      // ขออนุญาตใช้กล้อง
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' }, // กล้องหลัง
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // รอให้วิดีโอโหลด
        await new Promise((resolve, reject) => {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play()
              .then(resolve)
              .catch(reject);
          };
          
          videoRef.current.onerror = reject;
        });
        
        setCameraPermission('granted');
        startScanning();
      }
    } catch (error) {
      console.error('Camera error:', error);
      setCameraPermission('denied');
      
      let errorMessage = 'ไม่สามารถเข้าถึงกล้องได้';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'ไม่ได้รับอนุญาตให้ใช้กล้อง กรุณาอนุญาตการใช้งานกล้องในเบราว์เซอร์';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'ไม่พบกล้องในอุปกรณ์';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'เบราว์เซอร์ไม่รองรับการใช้งานกล้อง';
      } else if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        errorMessage = 'การใช้กล้องต้องเข้าผ่าน HTTPS หรือ localhost';
      }
      
      setCameraError(errorMessage);
    } finally {
      setIsInitializing(false);
    }
  };

  const startScanning = () => {
    if (scanIntervalRef.current) return;
    
    setScannerReady(true);
    
    // ใช้ interval สำหรับสแกน QR code
    scanIntervalRef.current = setInterval(() => {
      scanForQRCode();
    }, 300); // สแกนทุก 300ms
  };

  const scanForQRCode = async () => {
    if (!videoRef.current || !canvasRef.current || videoRef.current.readyState !== 4) {
      return;
    }

    try {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // ตรวจสอบว่าเบราว์เซอร์รองรับ BarcodeDetector หรือไม่
      if ('BarcodeDetector' in window) {
        const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
        const barcodes = await detector.detect(canvas);
        
        if (barcodes && barcodes.length > 0) {
          const qrCode = barcodes[0].rawValue.trim();
          if (qrCode && qrCode !== currentUuid) {
            onCodeDetected(qrCode);
          }
        }
      }
    } catch (error) {
      console.error('QR scanning error:', error);
    }
  };

  const onCodeDetected = async (code) => {
    const uuid = String(code).trim();
    if (!uuid) return;
    
    // หยุดสแกนชั่วคราวเพื่อป้องกันการสแกนซ้ำ
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    setCurrentUuid(uuid);
    await doLookup(uuid);
    
    // เริ่มสแกนใหม่หลังจาก 3 วินาที
    setTimeout(() => {
      if (videoRef.current && streamRef.current) {
        startScanning();
      }
    }, 3000);
  };

  // Search by name/email/phone/org
  const onSearch = async (q) => {
    const term = q.trim();
    if (!term || term.length < 2) { 
      setSearchResults([]); 
      return; 
    }
    
    setSearching(true);
    try {
      // Mock API call - replace with actual endpoint
      const mockResults = [
        {
          id: 1,
          uuid: 'MOCK-UUID-001',
          title: 'นาย',
          first_name: 'สมชาย',
          last_name: 'ใจดี',
          organization: 'บริษัท ABC จำกัด',
          participant_type: 'participant',
          email: 'somchai@abc.com',
          phone_number: '0812345678'
        }
      ].filter(item => 
        item.first_name.includes(term) || 
        item.last_name.includes(term) || 
        item.email.includes(term) ||
        item.organization.includes(term)
      );
      
      setSearchResults(mockResults);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const onChangeSearch = (v) => {
    setNameQuery(v);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => onSearch(v), 400);
  };

  const selectPerson = (item) => {
    if (!item?.uuid) return;
    setCurrentUuid(item.uuid);
    doLookup(item.uuid);
  };

  const doLookup = async (uuid) => {
    setLookupLoading(true);
    setResult(null);
    setMessage('');
    
    try {
      // Mock API call - replace with actual endpoint
      const mockRegistrant = {
        id: 1,
        uuid: uuid,
        title: 'นาย',
        first_name: 'สมชาย',
        last_name: 'ใจดี',
        organization: 'บริษัท ABC จำกัด',
        participant_type: 'participant',
        email: 'somchai@abc.com',
        phone_number: '0812345678',
        check_in_participant: 0,
        check_in_status: 'registered',
        checked_in_at: null
      };
      
      setResult({ registrant: mockRegistrant });
      setShowModal(true);
    } catch (e) {
      setMessage('เกิดข้อผิดพลาดในการค้นหา');
    } finally {
      setLookupLoading(false);
    }
  };

  const confirmCheckin = async () => {
    if (!currentUuid) return;
    
    setConfirmLoading(true);
    try {
      // Mock API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedRegistrant = {
        ...result.registrant,
        check_in_participant: 1,
        check_in_status: 'checked_in',
        checked_in_at: new Date().toISOString()
      };
      
      setResult({ registrant: updatedRegistrant, already: false });
      setMessage('เช็คอินสำเร็จ');
    } catch {
      setMessage('เกิดข้อผิดพลาดในการเช็คอิน');
    } finally {
      setConfirmLoading(false);
    }
  };

  const resetScanner = () => {
    setCurrentUuid('');
    setResult(null);
    setMessage('');
    setShowModal(false);
    
    // เริ่มสแกนใหม่
    if (videoRef.current && streamRef.current && !scanIntervalRef.current) {
      startScanning();
    }
  };

  const alreadyChecked = result && (result.already || result.registrant?.check_in_participant === 1 || result.registrant?.check_in_status === 'checked_in');

  const typeTh = (val) => {
    const map = {
      participant: 'ผู้เข้าร่วมงาน',
      speaker: 'วิทยากร',
      executive: 'ผู้บริหาร',
    };
    return map[val] || val;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-emerald-700">หน้าเช็คอิน</h1>
          <Link href="/admin" className="px-4 py-2 rounded-xl bg-white border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-50">
            กลับ Dashboard
          </Link>
        </div>

        {/* QR Scanner Section */}
        <div className="bg-white/90 border border-emerald-100 rounded-2xl p-4 shadow mb-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Camera/Scanner */}
            <div>
              <h3 className="text-lg font-semibold text-emerald-700 mb-3">สแกน QR Code</h3>
              <div className="relative">
                {/* Video Container with QR Frame */}
                <div className="relative aspect-square bg-black rounded-xl overflow-hidden">
                  <video 
                    ref={videoRef} 
                    className="w-full h-full object-cover" 
                    muted 
                    playsInline 
                    autoPlay
                  />
                  
                  {/* QR Scanner Frame Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-64 h-64">
                      {/* Corner borders */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400"></div>
                      
                      {/* Center guide */}
                      <div className="absolute inset-0 border-2 border-emerald-400/30 rounded-lg">
                        <div className="absolute inset-0 flex items-center justify-center">
                          {scannerReady ? (
                            <div className="text-emerald-400 text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                              กำลังสแกน...
                            </div>
                          ) : (
                            <div className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                              {isInitializing ? 'กำลังเริ่มกล้อง...' : 'รอการเริ่มสแกน'}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Scanning animation line */}
                      {scannerReady && (
                        <div className="absolute inset-0 overflow-hidden rounded-lg">
                          <div className="absolute w-full h-0.5 bg-emerald-400 animate-pulse" 
                               style={{
                                 animation: 'scanLine 2s linear infinite',
                                 top: '50%'
                               }}>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Status overlay */}
                  {!scannerReady && !isInitializing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="text-center text-white">
                        <div className="text-lg font-semibold mb-2">สแกนเนอร์ไม่พร้อม</div>
                        <div className="text-sm opacity-80">กรุณาอนุญาตการใช้กล้อง</div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Hidden canvas for QR detection */}
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Camera Permission Section */}
                {cameraPermission !== 'granted' && (
                  <div className="mt-3 p-4 rounded-xl border border-amber-200 bg-amber-50">
                    <div className="text-amber-800">
                      <div className="font-semibold mb-2">ต้องขออนุญาตใช้กล้องก่อน</div>
                      <div className="text-sm mb-3">
                        เพื่อสแกน QR Code สำหรับเช็คอิน กรุณาอนุญาตการใช้งานกล้อง
                      </div>
                      <button 
                        onClick={requestCamera} 
                        disabled={isInitializing}
                        className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {isInitializing ? 'กำลังเริ่มกล้อง...' : 'เปิดกล้อง'}
                      </button>
                    </div>
                  </div>
                )}
                
                {cameraError && (
                  <div className="mt-3 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700">
                    <div className="font-semibold mb-1">เกิดข้อผิดพลาด</div>
                    <div className="text-sm">{cameraError}</div>
                    <button 
                      onClick={requestCamera} 
                      className="mt-2 px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700"
                    >
                      ลองอีกครั้ง
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Search and Manual Input */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-emerald-700 mb-3">ค้นหาด้วยชื่อ</h3>
                <input 
                  value={nameQuery} 
                  onChange={e => onChangeSearch(e.target.value)} 
                  placeholder="พิมพ์ชื่อ นามสกุล อีเมล หรือองค์กร (อย่างน้อย 2 ตัวอักษร)"
                  className="w-full rounded-xl border-2 border-emerald-200 p-3 focus:border-emerald-400 focus:outline-none"
                />
                
                {nameQuery.length >= 2 && (
                  <div className="mt-2 max-h-48 overflow-auto rounded-xl border border-emerald-100 bg-white shadow-lg">
                    {searching ? (
                      <div className="p-4 text-center text-gray-500">
                        <div className="animate-spin w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                        กำลังค้นหา...
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">ไม่พบผลลัพธ์</div>
                    ) : (
                      searchResults.map(item => (
                        <button 
                          key={item.id} 
                          onClick={() => selectPerson(item)} 
                          className="w-full text-left p-4 hover:bg-emerald-50 border-b last:border-b-0 transition-colors"
                        >
                          <div className="font-medium text-gray-800">
                            {item.title}{item.first_name} {item.last_name}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            องค์กร: {item.organization || '-'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {typeTh(item.participant_type)} • {item.email}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-emerald-700 mb-3">กรอกโค้ดด้วยมือ</h3>
                <div className="flex gap-2">
                  <input 
                    value={manualCode} 
                    onChange={e => setManualCode(e.target.value)} 
                    placeholder="ระบุ UUID หรือโค้ดลงทะเบียน"
                    className="flex-1 rounded-xl border-2 border-emerald-200 p-3 focus:border-emerald-400 focus:outline-none"
                  />
                  <button 
                    onClick={() => {
                      const code = manualCode.trim();
                      if (code) {
                        setCurrentUuid(code);
                        doLookup(code);
                      }
                    }}
                    disabled={!manualCode.trim()}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    ค้นหา
                  </button>
                </div>
              </div>

              {currentUuid && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="text-sm text-emerald-700">
                    <span className="font-semibold">โค้ดปัจจุบัน:</span>
                    <div className="font-mono text-emerald-800 mt-1">{currentUuid}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Result Section */}
        <div className="bg-white/90 border border-emerald-100 rounded-2xl p-6 shadow">
          <h3 className="text-lg font-semibold text-emerald-700 mb-4">ผลการค้นหา</h3>
          
          {lookupLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full mx-auto mb-3"></div>
              <div className="text-gray-600">กำลังค้นหาข้อมูล...</div>
            </div>
          ) : result?.registrant ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="text-xl font-bold text-emerald-700">
                    {result.registrant.title}{result.registrant.first_name} {result.registrant.last_name}
                  </div>
                  <div className="text-gray-600 mt-1">{result.registrant.organization}</div>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                  alreadyChecked 
                    ? 'bg-blue-100 text-blue-700 border-blue-200' 
                    : 'bg-gray-100 text-gray-700 border-gray-200'
                }`}>
                  {alreadyChecked ? '✅ เช็คอินแล้ว' : '⏳ ยังไม่เช็คอิน'}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div><span className="text-gray-600">ประเภท:</span> <span className="font-medium">{typeTh(result.registrant.participant_type)}</span></div>
                  <div><span className="text-gray-600">อีเมล:</span> <span className="font-medium">{result.registrant.email}</span></div>
                  <div><span className="text-gray-600">โทรศัพท์:</span> <span className="font-medium">{result.registrant.phone_number}</span></div>
                </div>
                <div className="space-y-2">
                  <div><span className="text-gray-600">UUID:</span> <span className="font-mono text-xs">{result.registrant.uuid}</span></div>
                  <div><span className="text-gray-600">เวลาเช็คอิน:</span> <span className="font-medium">{
                    result.registrant.checked_in_at 
                      ? new Date(result.registrant.checked_in_at).toLocaleString('th-TH')
                      : '-'
                  }</span></div>
                </div>
              </div>

              {message && (
                <div className={`p-3 rounded-xl ${
                  alreadyChecked 
                    ? 'bg-blue-50 border border-blue-200 text-blue-700' 
                    : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                }`}>
                  {message}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                {alreadyChecked ? (
                  <button 
                    onClick={resetScanner} 
                    className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  >
                    สแกนคนต่อไป
                  </button>
                ) : (
                  <>
                    <button 
                      disabled={confirmLoading} 
                      onClick={confirmCheckin} 
                      className="px-6 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {confirmLoading ? 'กำลังเช็คอิน...' : '✅ ยืนยันเช็คอิน'}
                    </button>
                    <button 
                      onClick={resetScanner} 
                      className="px-6 py-2 rounded-xl bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      ยกเลิก
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              <div className="text-4xl mb-3">📱</div>
              <div>สแกน QR Code หรือกรอกโค้ดเพื่อค้นหาผู้ลงทะเบียน</div>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {showModal && result?.registrant && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between bg-emerald-50">
                <div className="text-lg font-semibold text-emerald-800">ยืนยันการเช็คอิน</div>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✖️
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xl font-bold text-emerald-700">
                      {result.registrant.title}{result.registrant.first_name} {result.registrant.last_name}
                    </div>
                    <div className="text-gray-600 mt-1">{result.registrant.organization}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                    alreadyChecked 
                      ? 'bg-blue-100 text-blue-700 border-blue-200' 
                      : 'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {alreadyChecked ? 'เช็คอินแล้ว' : 'ยังไม่เช็คอิน'}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-600">ประเภท:</span> <span className="font-medium">{typeTh(result.registrant.participant_type)}</span></div>
                  <div><span className="text-gray-600">อีเมล:</span> <span className="font-medium text-xs">{result.registrant.email}</span></div>
                  <div><span className="text-gray-600">โทร:</span> <span className="font-medium">{result.registrant.phone_number}</span></div>
                  <div><span className="text-gray-600">เวลาเช็คอิน:</span> <span className="font-medium text-xs">{
                    result.registrant.checked_in_at 
                      ? new Date(result.registrant.checked_in_at).toLocaleString('th-TH')
                      : '-'
                  }</span></div>
                </div>
                
                {message && (
                  <div className={`p-3 rounded-xl text-sm ${
                    alreadyChecked 
                      ? 'bg-blue-50 border border-blue-200 text-blue-700' 
                      : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                  }`}>
                    {message}
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                {alreadyChecked ? (
                  <button 
                    onClick={() => {
                      setShowModal(false);
                      resetScanner();
                    }} 
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    รับทราบ
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => setShowModal(false)} 
                      className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      ยกเลิก
                    </button>
                    <button 
                      disabled={confirmLoading} 
                      onClick={confirmCheckin} 
                      className="px-6 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {confirmLoading ? 'กำลังเช็คอิน...' : 'ยืนยันเช็คอิน'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes scanLine {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}</style>
    </div>
  );
}