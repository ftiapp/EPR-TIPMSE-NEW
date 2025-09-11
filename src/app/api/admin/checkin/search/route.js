import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    if (!q) return NextResponse.json({ ok: true, items: [] });

    const like = `%${q}%`;
    const sql = `
      SELECT id, uuid, title, first_name, last_name, organization, email, phone_number, participant_type, check_in_status, check_in_participant, checked_in_at
      FROM epr_registrants
      WHERE first_name LIKE ? OR last_name LIKE ? OR CONCAT(first_name,' ',last_name) LIKE ? OR email LIKE ? OR phone_number LIKE ? OR organization LIKE ?
      ORDER BY registration_date DESC
      LIMIT ${limit}
    `;
    const rows = await query(sql, [like, like, like, like, like, like]);
    return NextResponse.json({ ok: true, items: rows });
  } catch (e) {
    console.error('checkin search error', e);
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}
