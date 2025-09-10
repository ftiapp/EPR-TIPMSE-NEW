import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendRegistrationEmail } from '@/lib/email';
import { randomUUID } from 'crypto';

function genShortCode(len = 12) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < len; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

function validate(payload) {
  const errors = {};
  const required = ['title', 'first_name', 'last_name', 'phone_number', 'email', 'participant_type', 'consent_given'];
  for (const k of required) {
    if (payload[k] === undefined || payload[k] === null || payload[k] === '') {
      errors[k] = 'required';
    }
  }
  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.email = 'invalid_email';
  }
  if (payload.participant_type && !['participant','speaker','executive'].includes(payload.participant_type)) {
    errors.participant_type = 'invalid_enum';
  }
  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true };
}

export async function POST(req) {
  try {
    const body = await req.json();
    const v = validate(body);
    if (!v.ok) {
      return NextResponse.json({ ok: false, errors: v.errors }, { status: 400 });
    }

    const id = randomUUID();
    const code = genShortCode(8);

    const {
      title,
      first_name,
      last_name,
      phone_number,
      email,
      organization = null,
      department = null,
      participant_type,
      consent_given,
    } = body;

    // Check duplicate by first_name + last_name (allow duplicate phone/email)
    const dupRows = await query(
      'SELECT COUNT(1) as cnt FROM epr_registrants WHERE first_name = ? AND last_name = ?',
      [first_name, last_name]
    );
    if (Array.isArray(dupRows) && dupRows[0]?.cnt > 0) {
      return NextResponse.json(
        { ok: false, errors: { name: 'duplicate_name' }, message: 'Duplicate first_name + last_name' },
        { status: 409 }
      );
    }

    const sql = `
      INSERT INTO epr_registrants (
        id, uuid, title, first_name, last_name, phone_number, email, organization, department,
        participant_type, check_in_status, check_in_participant, checked_in_at, consent_given, registration_date, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'registered', 0, NULL, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
    `;

    await query(sql, [
      id,
      code,
      title,
      first_name,
      last_name,
      phone_number,
      email,
      organization,
      department,
      participant_type,
      consent_given ? 1 : 0,
    ]);

    // Send confirmation email
    try {
      await sendRegistrationEmail({ toEmail: email, toName: `${title}${first_name} ${last_name}`.trim(), code });
    } catch (e) {
      // Don't fail the whole request if email sending fails; log and continue
      console.error('Email error:', e);
    }

    return NextResponse.json({ ok: true, id, code });
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}
