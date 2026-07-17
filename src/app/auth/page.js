'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/context/UserContext';

export default function AuthPage() {
  const router = useRouter();
  const { login, register, user } = useUser();
  const [isLoginView, setIsLoginView] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isLoginView) {
        await login(formData.email, formData.password);
        setSuccess('Logged in successfully!');
        setTimeout(() => router.push('/'), 1000);
      } else {
        await register(
          formData.email,
          formData.password,
          formData.firstName,
          formData.lastName
        );
        setSuccess('Account created successfully!');
        setTimeout(() => router.push('/'), 1000);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-6">
        <h2 className="text-xl font-black uppercase tracking-widest mb-4">Already Logged In</h2>
        <p className="text-xs text-gray-500 mb-8">You are logged in as {user.firstName} ({user.email}).</p>
        <button 
          onClick={() => router.push('/')}
          className="bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition"
        >
          Return To Home
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black font-sans flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="text-3xl font-black tracking-widest block mb-4">URBAN FIT</Link>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            {isLoginView ? 'Welcome Back' : 'Join the Club'}
          </span>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 mb-6 rounded text-xs uppercase tracking-wider font-bold text-center border border-red-100">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 p-4 mb-6 rounded text-xs uppercase tracking-wider font-bold text-center border border-green-100">
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-6">
          {!isLoginView && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border border-gray-200 p-3 text-xs focus:border-black outline-none transition uppercase tracking-wider"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border border-gray-200 p-3 text-xs focus:border-black outline-none transition uppercase tracking-wider"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-200 p-3 text-xs focus:border-black outline-none transition uppercase tracking-wider"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-200 p-3 text-xs focus:border-black outline-none transition uppercase tracking-wider"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition"
          >
            {isLoginView ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-8">
          <button
            onClick={() => {
              setIsLoginView(!isLoginView);
              setError('');
              setSuccess('');
            }}
            className="text-[10px] font-bold text-gray-400 hover:text-black uppercase tracking-widest transition"
          >
            {isLoginView ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
          </button>
        </div>
      </div>
    </main>
  );
}