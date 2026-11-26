'use server';

import { redirect } from 'next/navigation';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { setStudentSession } from '@/lib/session';
import type { FormActionState } from '@/lib/types';

export async function loginSiswa(
  _prevState: FormActionState<'kode'>,
  formData: FormData
): Promise<FormActionState<'kode'>> {
  const rawKode = String(formData.get('kode') ?? '').trim();
  const kode = rawKode.toUpperCase();

  if (!kode) {
    return {
      errors: { kode: 'Kode siswa wajib diisi.' },
      values: { kode: rawKode },
    };
  }

  if (kode.length < 6 || kode.length > 12) {
    return {
      errors: { kode: 'Kode siswa harus terdiri dari 6 sampai 12 karakter.' },
      values: { kode: rawKode },
    };
  }

  let siswaId: number | null = null;
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('siswa')
      .select('id')
      .eq('kode', kode)
      .maybeSingle();

    if (error) {
      return {
        errors: { kode: 'Terjadi kesalahan saat memeriksa kode siswa.' },
        values: { kode: rawKode },
      };
    }

    siswaId = data?.id ?? null;
  } catch {
    return {
      errors: { kode: 'Konfigurasi server basis data belum siap.' },
      values: { kode: rawKode },
    };
  }

  if (!siswaId) {
    return {
      errors: { kode: 'Kode siswa tidak ditemukan. Periksa kembali kode dari pembimbing.' },
      values: { kode: rawKode },
    };
  }

  await setStudentSession(siswaId);
  redirect('/jurnal');
}
