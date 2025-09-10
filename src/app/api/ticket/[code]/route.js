import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req, context) {
  try {
    const { code } = await context.params;
    
    if (!code) {
      return NextResponse.json({ ok: false, message: 'Code is required' }, { status: 400 });
    }

    const rows = await query(
      'SELECT * FROM epr_registrants WHERE uuid = ? LIMIT 1',
      [code]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ ok: false, message: 'Registration not found' }, { status: 404 });
    }

    const registrant = rows[0];
    
    // Don't expose sensitive data
    const safeRegistrant = {
      uuid: registrant.uuid,
      title: registrant.title,
      first_name: registrant.first_name,
      last_name: registrant.last_name,
      phone_number: registrant.phone_number,
      email: registrant.email,
      organization: registrant.organization,
      department: registrant.department,
      participant_type: registrant.participant_type,
      check_in_status: registrant.check_in_status,
      registration_date: registrant.registration_date
    };

    return NextResponse.json({ ok: true, registrant: safeRegistrant });
  } catch (err) {
    console.error('Ticket fetch error:', err);
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}
