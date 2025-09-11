'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function Badge({ children, color = 'emerald' }) {
  const map = {
    emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
    red: 'bg-red-100 text-red-700 border-red-200',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${map[color]}`}>{children}</span>
  );
}

function IconButton({ title, ariaLabel, onClick, children, variant = 'default' }) {
  const base = 'w-9 h-9 inline-flex items-center justify-center rounded-xl border transition hover:shadow focus:outline-none';
  const styles = variant === 'primary'
    ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50';
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={ariaLabel || title}
      className={`${base} ${styles}`}
    >
      {children}
    </button>
  );
}

function Modal({ open, kind = 'loading', message = '', onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
        <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center rounded-full">
          {kind === 'loading' ? (
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-emerald-200 border-t-emerald-600"></div>
          ) : (
            <svg className="w-10 h-10 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="text-gray-800 font-semibold mb-2">
          {kind === 'loading' ? 'กำลังดำเนินการ...' : 'สำเร็จ'}
        </div>
        {message && <div className="text-gray-600 text-sm">{message}</div>}
        {kind !== 'loading' && (
          <div className="mt-4">
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">ปิด</button>
          </div>
        )}
      </div>
    </div>
  );
}

function EditModal({ open, draft, setDraft, onSave, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="text-lg font-semibold text-gray-800">แก้ไขข้อมูลผู้ลงทะเบียน</div>
          <IconButton title="ปิด" ariaLabel="ปิด" onClick={onClose}>✖️</IconButton>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">คำนำหน้า</label>
            <input className="w-full border rounded-xl p-2.5" value={draft.title || ''} onChange={e=>setDraft(d=>({...d,title:e.target.value}))} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">ชื่อ</label>
            <input className="w-full border rounded-xl p-2.5" value={draft.first_name || ''} onChange={e=>setDraft(d=>({...d,first_name:e.target.value}))} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">นามสกุล</label>
            <input className="w-full border rounded-xl p-2.5" value={draft.last_name || ''} onChange={e=>setDraft(d=>({...d,last_name:e.target.value}))} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">ประเภทผู้เข้าร่วม</label>
            <select className="w-full border rounded-xl p-2.5" value={draft.participant_type || 'participant'} onChange={e=>setDraft(d=>({...d,participant_type:e.target.value}))}>
              <option value="participant">ผู้เข้าร่วมงาน</option>
              <option value="speaker">วิทยากร</option>
              <option value="executive">ผู้บริหาร</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">องค์กร</label>
            <input className="w-full border rounded-xl p-2.5" value={draft.organization || ''} onChange={e=>setDraft(d=>({...d,organization:e.target.value}))} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">อีเมล</label>
            <input className="w-full border rounded-xl p-2.5" value={draft.email || ''} onChange={e=>setDraft(d=>({...d,email:e.target.value}))} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">โทรศัพท์</label>
            <input className="w-full border rounded-xl p-2.5" value={draft.phone_number || ''} onChange={e=>setDraft(d=>({...d,phone_number:e.target.value}))} />
          </div>
          {null}
        </div>
        <div className="p-4 border-t flex justify-end gap-2">
          <IconButton title="บันทึก" ariaLabel="บันทึก" onClick={onSave} variant="primary">💾</IconButton>
          <IconButton title="ยกเลิก" ariaLabel="ยกเลิก" onClick={onClose}>✖️</IconButton>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState('');

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loadingTable, setLoadingTable] = useState(true);
  const [tableError, setTableError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({});
  const [modal, setModal] = useState({ open: false, kind: 'loading', message: '' });

  async function logout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  }

  function startEdit(row) {
    setEditingId(row.id);
    setEditDraft({ ...row });
  }
  function cancelEdit() {
    setEditingId(null);
    setEditDraft({});
  }
  async function saveEdit() {
    if (!editingId) return;
    const updates = {};
    const allowed = ['title','first_name','last_name','phone_number','email','organization','department','participant_type','check_in_status','check_in_participant'];
    for (const k of allowed) {
      if (editDraft[k] !== undefined) updates[k] = editDraft[k];
    }
    setModal({ open: true, kind: 'loading', message: 'กำลังบันทึกข้อมูล' });
    const res = await fetch('/api/admin/registrants', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingId, updates })
    });
    const data = await res.json();
    if (data.ok) {
      cancelEdit();
      await loadTable();
      setModal({ open: true, kind: 'success', message: 'บันทึกข้อมูลสำเร็จ' });
      setTimeout(()=> setModal({ open: false, kind: 'success', message: '' }), 1200);
    } else {
      setModal({ open: false, kind: 'loading', message: '' });
      alert(data.message || 'บันทึกไม่สำเร็จ');
    }
  }

  async function resendEmail(id) {
    setModal({ open: true, kind: 'loading', message: 'กำลังส่งอีเมล' });
    const res = await fetch('/api/admin/resend-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    let data = null;
    try { data = await res.json(); } catch {}
    if (res.ok && data && data.ok) {
      setModal({ open: true, kind: 'success', message: 'ส่งอีเมลสำเร็จ' });
      setTimeout(()=> setModal({ open: false, kind: 'success', message: '' }), 1200);
    } else {
      setModal({ open: false, kind: 'loading', message: '' });
      alert((data && data.message) || 'ส่งอีเมลไม่สำเร็จ');
    }
  }
  async function resendSMS(id) {
    setModal({ open: true, kind: 'loading', message: 'กำลังส่ง SMS' });
    const res = await fetch('/api/admin/resend-sms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    let data = null;
    try { data = await res.json(); } catch {}
    if (res.ok && data && data.ok) {
      setModal({ open: true, kind: 'success', message: 'ส่ง SMS สำเร็จ' });
      setTimeout(()=> setModal({ open: false, kind: 'success', message: '' }), 1200);
    } else {
      setModal({ open: false, kind: 'loading', message: '' });
      alert((data && data.message) || 'ส่ง SMS ไม่สำเร็จ');
    }
  }

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  async function loadStats() {
    setLoadingStats(true);
    setStatsError('');
    try {
      const res = await fetch('/api/admin/stats');
      let data = null;
      try {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          data = await res.json();
        }
      } catch {}
      if (res.ok && data && data.ok) {
        setStats(data);
      } else {
        setStats(null);
        if (res.status === 401) setStatsError('ยังไม่ล็อกอิน โปรดเข้าสู่ระบบก่อนใช้งาน');
        else setStatsError('ไม่สามารถโหลดสถิติได้');
      }
    } finally { setLoadingStats(false); }
  }
  async function loadTable() {
    setLoadingTable(true);
    setTableError('');
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      const res = await fetch(`/api/admin/registrants?${params.toString()}`);
      let data = null;
      try {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          data = await res.json();
        }
      } catch {}
      if (res.ok && data && data.ok) {
        setItems(data.items);
        setTotal(data.total);
      } else {
        // If unauthorized or error, reset items and optionally show a message
        setItems([]);
        setTotal(0);
        if (res.status === 401) setTableError('ยังไม่ล็อกอิน โปรดเข้าสู่ระบบก่อนใช้งาน');
        else setTableError('ไม่สามารถโหลดข้อมูลตารางได้');
      }
    } finally { setLoadingTable(false); }
  }

  useEffect(() => { loadStats(); }, []);
  useEffect(() => { loadTable(); }, [page, pageSize, status]);

  function StatusPill({ row }) {
    const already = row.check_in_participant === 1 || row.check_in_status === 'checked_in';
    return (
      <Badge color={already ? 'blue' : 'gray'}>
        {already ? 'เช็คอินแล้ว' : 'ยังไม่เช็คอิน'}
      </Badge>
    );
  }

  function typeTh(val) {
    const map = {
      participant: 'ผู้เข้าร่วมงาน',
      speaker: 'วิทยากร',
      executive: 'ผู้บริหาร',
    };
    return map[val] || val;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-emerald-700">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <Link href="/admin/checkin" className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-emerald-600 text-white shadow hover:shadow-lg">หน้าเช็คอิน</Link>
            <Link href="/admin/checkin" className="sm:hidden"><IconButton title="เช็คอิน" ariaLabel="เช็คอิน" variant="primary">🏷️</IconButton></Link>
            <IconButton title="ออกจากระบบ" ariaLabel="ออกจากระบบ" onClick={logout}>🚪</IconButton>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/90 border border-emerald-100 rounded-2xl p-5 shadow">
            <div className="text-gray-500 text-sm">ลงทะเบียนทั้งหมด</div>
            <div className="text-3xl font-bold text-emerald-700">{stats?.totals?.total ?? (loadingStats ? '…' : 0)}</div>
          </div>
          <div className="bg-white/90 border border-emerald-100 rounded-2xl p-5 shadow">
            <div className="text-gray-500 text-sm">เช็คอินแล้ว</div>
            <div className="text-3xl font-bold text-emerald-700">{stats?.totals?.checked_in_count ?? (loadingStats ? '…' : 0)}</div>
          </div>
          <div className="bg-white/90 border border-emerald-100 rounded-2xl p-5 shadow">
            <div className="text-gray-500 text-sm">ยังไม่เช็คอิน</div>
            <div className="text-3xl font-bold text-emerald-700">{stats?.totals?.not_checked_in_count ?? (loadingStats ? '…' : 0)}</div>
          </div>
        </div>
        {statsError && (
          <div className="mb-4 p-4 rounded-xl border-2 border-yellow-200 bg-yellow-50 text-yellow-800 flex items-center justify-between">
            <span>{statsError}</span>
            <button onClick={()=>router.push('/admin/login')} className="px-3 py-1 rounded-lg bg-yellow-600 text-white text-sm">ไปหน้าเข้าสู่ระบบ</button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white/90 border border-emerald-100 rounded-2xl p-4 shadow mb-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ค้นหาชื่อ อีเมล โทรศัพท์ รหัส ลงทะเบียน องค์กร" className="flex-1 w-full rounded-xl border-2 border-emerald-200 p-3" />
            <select value={status} onChange={e=>setStatus(e.target.value)} className="rounded-xl border-2 border-emerald-200 p-3">
              <option value="">สถานะ</option>
              <option value="registered">registered</option>
              <option value="checked_in">checked_in</option>
              <option value="no_show">no_show</option>
            </select>
            <button onClick={()=>{ setPage(1); loadTable(); }} className="px-4 py-2 rounded-xl bg-emerald-600 text-white">ค้นหา</button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/90 border border-emerald-100 rounded-2xl shadow overflow-auto">
          {tableError && (
            <div className="p-3 border-b border-emerald-100 bg-amber-50 text-amber-800 flex items-center justify-between">
              <span>{tableError}</span>
              <button onClick={()=>router.push('/admin/login')} className="px-3 py-1 rounded-lg bg-amber-600 text-white text-xs">ไปหน้าเข้าสู่ระบบ</button>
            </div>
          )}
          <table className="min-w-full text-sm">
            <thead className="bg-emerald-50">
              <tr>
                <th className="p-3 text-left">รหัส</th>
                <th className="p-3 text-left">ชื่อ-นามสกุล</th>
                <th className="p-3 text-left">ประเภท</th>
                <th className="p-3 text-left hidden md:table-cell">องค์กร</th>
                <th className="p-3 text-left hidden lg:table-cell">อีเมล</th>
                <th className="p-3 text-left hidden sm:table-cell">โทร</th>
                <th className="p-3 text-left">สถานะเช็คอิน</th>
                <th className="p-3 text-left">การทำงาน</th>
              </tr>
            </thead>
            <tbody>
              {loadingTable ? (
                <tr><td className="p-4" colSpan={8}>กำลังโหลด...</td></tr>
              ) : items.length === 0 ? (
                <tr><td className="p-4" colSpan={8}>ไม่พบข้อมูล</td></tr>
              ) : items.map(row => (
                <tr key={row.id} className="border-t border-emerald-100 hover:bg-emerald-50/30">
                  <td className="p-3 font-mono text-xs">{row.uuid}</td>
                  <td className="p-3">
                    <div className="leading-tight">
                      <div>{row.title}{row.first_name} {row.last_name}</div>
                      <div className="text-xs text-gray-500 md:hidden">องค์กร: {row.organization || '-'}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge>{typeTh(row.participant_type)}</Badge>
                  </td>
                  <td className="p-3 hidden md:table-cell">{row.organization}</td>
                  <td className="p-3 hidden lg:table-cell">{row.email}</td>
                  <td className="p-3 hidden sm:table-cell">{row.phone_number}</td>
                  <td className="p-3"><StatusPill row={row} /></td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <IconButton title="แก้ไข" ariaLabel="แก้ไข" onClick={()=>startEdit(row)}>✏️</IconButton>
                      <IconButton title="ส่งอีเมล" ariaLabel="ส่งอีเมล" onClick={()=>resendEmail(row.id)}>✉️</IconButton>
                      <IconButton title="ส่ง SMS" ariaLabel="ส่ง SMS" onClick={()=>resendSMS(row.id)}>📱</IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">ทั้งหมด {total} รายการ</div>
          <div className="flex items-center gap-2">
            <button disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-3 py-1 rounded border bg-white disabled:opacity-50">ก่อนหน้า</button>
            <span className="px-2 text-sm">หน้า {page}/{totalPages}</span>
            <button disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="px-3 py-1 rounded border bg-white disabled:opacity-50">ถัดไป</button>
            <select value={pageSize} onChange={e=>{ setPageSize(parseInt(e.target.value,10)); setPage(1); }} className="ml-2 rounded border p-1">
              {[10,25,50,100].map(n=> <option key={n} value={n}>{n}/หน้า</option>)}
            </select>
          </div>
        </div>
      </div>
      <EditModal open={!!editingId} draft={editDraft} setDraft={setEditDraft} onSave={saveEdit} onClose={cancelEdit} />
      <Modal open={modal.open} kind={modal.kind} message={modal.message} onClose={()=>setModal({ open: false, kind: 'success', message: '' })} />
    </div>
  );
}
