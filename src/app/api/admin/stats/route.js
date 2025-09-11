import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const statusCounts = await query(`
      SELECT check_in_status as status, COUNT(1) as cnt
      FROM epr_registrants
      GROUP BY check_in_status
    `);

    const typeCounts = await query(`
      SELECT participant_type as type, COUNT(1) as cnt
      FROM epr_registrants
      GROUP BY participant_type
    `);

    const totals = await query(`
      SELECT 
        COUNT(1) as total,
        SUM(check_in_participant = 1) as checked_in_count,
        SUM(check_in_participant = 0) as not_checked_in_count
      FROM epr_registrants
    `);

    return NextResponse.json({ ok: true, statusCounts, typeCounts, totals: totals?.[0] || {} });
  } catch (e) {
    console.error('stats error', e);
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}
