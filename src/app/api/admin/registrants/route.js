import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/admin/registrants?search=&status=&page=1&pageSize=50
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get('search') || '').trim();
    const status = (searchParams.get('status') || '').trim();
    const participantType = (searchParams.get('participantType') || '').trim();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(200, Math.max(1, parseInt(searchParams.get('pageSize') || '50', 10)));
    const offset = (page - 1) * pageSize;

    const where = [];
    const params = [];
    if (search) {
      where.push('(first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone_number LIKE ? OR uuid LIKE ? OR organization LIKE ? )');
      const like = `%${search}%`;
      params.push(like, like, like, like, like, like);
    }
    if (status) {
      where.push('check_in_status = ?');
      params.push(status);
    }
    if (participantType) {
      where.push('participant_type = ?');
      params.push(participantType);
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    // Inline LIMIT/OFFSET to avoid MySQL ER_WRONG_ARGUMENTS with placeholders
    const listSql = `
      SELECT SQL_CALC_FOUND_ROWS id, uuid, title, first_name, last_name, phone_number, email, organization, department, participant_type, check_in_status, check_in_participant, checked_in_at, consent_given, registration_date, updated_at
      FROM epr_registrants ${whereSql}
      ORDER BY registration_date DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `;
    const rows = await query(listSql, params);
    const totalRows = await query('SELECT FOUND_ROWS() as total');
    const total = Array.isArray(totalRows) ? totalRows[0]?.total || 0 : 0;

    return NextResponse.json({ ok: true, items: rows, total, page, pageSize });
  } catch (e) {
    console.error('GET /api/admin/registrants error', e);
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}

// PATCH /api/admin/registrants -> update registrant fields
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { id, updates } = body || {};
    if (!id || !updates || typeof updates !== 'object') {
      return NextResponse.json({ ok: false, message: 'Invalid request' }, { status: 400 });
    }

    const allowed = new Set(['title','first_name','last_name','phone_number','email','organization','department','participant_type','check_in_status','check_in_participant']);
    const sets = [];
    const params = [];
    for (const [k,v] of Object.entries(updates)) {
      if (allowed.has(k)) {
        sets.push(`${k} = ?`);
        params.push(v);
      }
    }
    if (!sets.length) {
      return NextResponse.json({ ok: false, message: 'No valid fields' }, { status: 400 });
    }
    sets.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    await query(`UPDATE epr_registrants SET ${sets.join(', ')} WHERE id = ?`, params);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('PATCH registrants error', e);
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}
