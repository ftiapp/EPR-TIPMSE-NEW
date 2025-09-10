import { NextResponse } from 'next/server';
import { sendRegistrationEmail } from '@/lib/email';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const { uuid, toEmail, toName } = await request.json();

    if (!uuid || !toEmail) {
      return NextResponse.json({ ok: false, message: 'uuid and toEmail are required' }, { status: 400 });
    }

    // Try to enrich email with registrant details
    let registrant = null;
    try {
      const rows = await query('SELECT * FROM epr_registrants WHERE uuid = ? LIMIT 1', [uuid]);
      if (Array.isArray(rows) && rows.length > 0) {
        registrant = rows[0];
      }
    } catch (e) {
      console.error('Failed to load registrant for resend:', e);
    }

    await sendRegistrationEmail({
      toEmail,
      toName,
      code: uuid,
      participantType: registrant?.participant_type,
      organization: registrant?.organization,
      phoneNumber: registrant?.phone_number,
      title: registrant?.title,
      firstName: registrant?.first_name,
      lastName: registrant?.last_name,
      department: registrant?.department,
    });

    return NextResponse.json({ ok: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Resend email error:', error);
    return NextResponse.json({ ok: false, message: 'Failed to send email' }, { status: 500 });
  }
}
