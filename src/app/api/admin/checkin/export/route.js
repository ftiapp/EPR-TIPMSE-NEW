import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import * as XLSX from 'xlsx';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();
    const participantType = (searchParams.get('participantType') || '').trim();
    const search = (searchParams.get('search') || '').trim();

    const clauses = [];
    const params = [];

    if (q) {
      const like = `%${q}%`;
      clauses.push(`(
        first_name LIKE ? OR
        last_name LIKE ? OR
        CONCAT(first_name,' ',last_name) LIKE ? OR
        email LIKE ? OR
        phone_number LIKE ? OR
        organization LIKE ?
      )`);
      params.push(like, like, like, like, like, like);
    }

    if (participantType) {
      clauses.push('participant_type = ?');
      params.push(participantType);
    }

    if (search) {
      const like = `%${search}%`;
      clauses.push(`(
        first_name LIKE ? OR
        last_name LIKE ? OR
        CONCAT(first_name,' ',last_name) LIKE ? OR
        email LIKE ? OR
        phone_number LIKE ? OR
        organization LIKE ? OR
        uuid LIKE ?
      )`);
      params.push(like, like, like, like, like, like, like);
    }

    const whereSql = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

    const sql = `
      SELECT id, uuid, title, first_name, last_name, organization, email, phone_number, participant_type, check_in_status, check_in_participant, checked_in_at, registration_date
      FROM epr_registrants
      ${whereSql}
      ORDER BY registration_date DESC
    `;
    const rows = await query(sql, params);

    if (!rows?.length) {
      return NextResponse.json({ ok: false, message: 'ไม่พบข้อมูลสำหรับส่งออก' }, { status: 404 });
    }

    const exportRows = rows.map((row, index) => ({
      '#': index + 1,
      'UUID': row.uuid,
      'คำนำหน้า': row.title || '-',
      'ชื่อ': row.first_name || '-',
      'นามสกุล': row.last_name || '-',
      'องค์กร': row.organization || '-',
      'อีเมล': row.email || '-',
      'เบอร์โทร': row.phone_number || '-',
      'ประเภทผู้เข้าร่วม': row.participant_type || '-',
      'สถานะเช็คอิน': row.check_in_participant === 1 || row.check_in_status === 'checked_in' ? 'เช็คอินแล้ว' : 'ยังไม่เช็คอิน',
      'เวลาเช็คอิน': row.checked_in_at ? new Date(row.checked_in_at).toLocaleString('th-TH') : '-',
      'วันที่ลงทะเบียน': row.registration_date ? new Date(row.registration_date).toLocaleString('th-TH') : '-',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Check-in');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    const filename = `checkin-export-${Date.now()}.xlsx`;

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
  } catch (e) {
    console.error('checkin export error', e);
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}
