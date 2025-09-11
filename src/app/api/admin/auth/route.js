import { NextResponse } from 'next/server';

function getCreds() {
  const USER = process.env.ADMIN_USER || 'tipmseadmin';
  const PASS = process.env.ADMIN_PASS || 'AAaa123**';
  return { USER, PASS };
}

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    const { USER, PASS } = getCreds();
    if (username === USER && password === PASS) {
      const res = NextResponse.json({ ok: true });
      res.cookies.set('admin_auth', '1', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 12, // 12 hours
      });
      return res;
    }
    return NextResponse.json({ ok: false, message: 'Invalid credentials' }, { status: 401 });
  } catch (e) {
    return NextResponse.json({ ok: false, message: 'Bad request' }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin_auth', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 });
  return res;
}
