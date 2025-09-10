import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const first_name = searchParams.get('first_name');
    const last_name = searchParams.get('last_name');

    if (!first_name || !last_name) {
      return NextResponse.json({ ok: false, message: 'first_name and last_name are required' }, { status: 400 });
    }

    const rows = await query(
      'SELECT COUNT(1) as cnt FROM epr_registrants WHERE first_name = ? AND last_name = ? LIMIT 1',
      [first_name, last_name]
    );
    const cnt = Array.isArray(rows) ? rows[0]?.cnt || 0 : 0;

    if (cnt > 0) {
      return NextResponse.json({ ok: false, duplicate: true }, { status: 409 });
    }
    return NextResponse.json({ ok: true, duplicate: false });
  } catch (err) {
    console.error('check-name error:', err);
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}
