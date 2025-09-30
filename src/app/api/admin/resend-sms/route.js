import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendRegistrationSMS, sendReminderSMS } from '@/lib/sms';

export async function POST(req) {
  try {
    const { id, mode } = await req.json();
    if (!id) return NextResponse.json({ ok: false, message: 'Missing id' }, { status: 400 });

    const rows = await query('SELECT * FROM epr_registrants WHERE id = ?', [id]);
    const r = rows?.[0];
    if (!r) return NextResponse.json({ ok: false, message: 'Not found' }, { status: 404 });

    const common = {
      phoneNumber: r.phone_number,
      name: `${r.title || ''}${r.first_name} ${r.last_name}`.trim(),
      participantType: r.participant_type,
      uuid: r.uuid,
    };

    const result = mode === 'reminder'
      ? await sendReminderSMS(common)
      : await sendRegistrationSMS({ ...common, organization: r.organization });

    return NextResponse.json({ ok: result.success, result });
  } catch (e) {
    console.error('resend-sms error', e);
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}
