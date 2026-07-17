import { NextResponse } from 'next/server';
import { createToken } from '../../../lib/auth';

global.mockUsersDb = global.mockUsersDb || [];

export async function POST(request) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const userExists = global.mockUsersDb.find((u) => u.email === email);
    if (userExists) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      email,
      password, 
      firstName,
      lastName,
    };

    global.mockUsersDb.push(newUser);

    const userPayload = { id: newUser.id, email: newUser.email, firstName: newUser.firstName };
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