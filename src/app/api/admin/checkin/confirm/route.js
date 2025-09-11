import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req) {
  try {
    const { uuid } = await req.json();
    if (!uuid) return NextResponse.json({ ok: false, message: 'Missing uuid' }, { status: 400 });

    const rows = await query('SELECT * FROM epr_registrants WHERE uuid = ?', [uuid]);
    const r = rows?.[0];
    if (!r) return NextResponse.json({ ok: false, message: 'Not found' }, { status: 404 });

    if (r.check_in_participant === 1 || r.check_in_status === 'checked_in') {
      return NextResponse.json({ ok: true, already: true, registrant: r });
    }

    await query(`UPDATE epr_registrants 
      SET check_in_status = 'checked_in', check_in_participant = 1, checked_in_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE uuid = ?`, [uuid]);

    const updated = await query('SELECT * FROM epr_registrants WHERE uuid = ?', [uuid]);
    return NextResponse.json({ ok: true, registrant: updated?.[0] });
  } catch (e) {
    console.error('checkin confirm error', e);
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}
