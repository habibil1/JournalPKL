'use server';

import { redirect } from 'next/navigation';
import { clearStudentSession } from '@/lib/session';

export async function logoutSiswa(): Promise<void> {
  await clearStudentSession();
  redirect('/masuk');
}
