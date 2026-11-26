'use server';

import crypto from 'crypto';
import { redirect } from 'next/navigation';
import { clearAdminSession, setAdminSession } from '@/lib/session';
import type { FormActionState } from '@/lib/types';

function hashValue(val: string): Buffer {
  return crypto.createHash('sha256').update(val).digest();
}

export async function loginAdmin(
  _prevState: FormActionState<'password'>,
  formData: FormData
): Promise<FormActionState<'password'>> {
  const password = String(formData.get('password') ?? '');
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    return {
      errors: { password: 'ADMIN_PASSWORD belum diatur di server.' },
    };
  }

  if (!password) {
    return {
      errors: { password: 'Kata sandi admin wajib diisi.' },
    };
  }

  const isMatch = crypto.timingSafeEqual(
    hashValue(password),
    hashValue(expectedPassword)
  );

  if (!isMatch) {
    return {
      errors: { password: 'Kata sandi admin salah. Silakan periksa kembali.' },
    };
  }

  await setAdminSession();
  redirect('/admin');
}

export async function logoutAdmin(): Promise<void> {
  await clearAdminSession();
  redirect('/login');
}
