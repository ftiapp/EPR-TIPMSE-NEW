import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const uuid = (searchParams.get('uuid') || '').trim();
    if (!uuid) return NextResponse.json({ ok: false, message: 'Missing uuid' }, { status: 400 });

    const rows = await query('SELECT * FROM epr_registrants WHERE uuid = ?', [uuid]);
    if (!rows?.length) return NextResponse.json({ ok: false, message: 'Not found' }, { status: 404 });

    return NextResponse.json({ ok: true, registrant: rows[0] });
  } catch (e) {
    console.error('checkin lookup error', e);
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}
