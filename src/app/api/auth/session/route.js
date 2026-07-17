import { NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/auth';

export async function GET(request) {
  const token = request.cookies.get('urban_fit_token')?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user: payload });
}