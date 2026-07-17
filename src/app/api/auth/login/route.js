import { NextResponse } from 'next/server';
import { createToken } from '../../../lib/auth';

global.mockUsersDb = global.mockUsersDb || [];

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const user = global.mockUsersDb.find((u) => u.email === email && u.password === password);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const userPayload = { id: user.id, email: user.email, firstName: user.firstName };
    const token = await createToken(userPayload);

    const response = NextResponse.json({ success: true, user: userPayload });
    response.cookies.set({
      name: 'urban_fit_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}