import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendRegistrationEmail } from '@/lib/email';

export async function POST(req) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ ok: false, message: 'Missing id' }, { status: 400 });

    const rows = await query('SELECT * FROM epr_registrants WHERE id = ?', [id]);
    const r = rows?.[0];
    if (!r) return NextResponse.json({ ok: false, message: 'Not found' }, { status: 404 });

    await sendRegistrationEmail({
      toEmail: r.email,
      toName: `${r.title || ''}${r.first_name} ${r.last_name}`.trim(),
      code: r.uuid,
      participantType: r.participant_type,
      organization: r.organization,
      phoneNumber: r.phone_number,
      title: r.title,
      firstName: r.first_name,
      lastName: r.last_name,
      department: r.department,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('resend-email error', e);
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}
