'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/session';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import type { FormActionState } from '@/lib/types';
import {
  generateKodeSiswa,
  validateSiswaInput,
  type SiswaField,
} from '@/lib/validation';

export async function tambahSiswa(
  _prevState: FormActionState<SiswaField>,
  formData: FormData
): Promise<FormActionState<SiswaField>> {
  const isAdmin = await getAdminSession();
  if (!isAdmin) {
    redirect('/login');
  }

  const rawValues = {
    nama: String(formData.get('nama') ?? ''),
    kelas: String(formData.get('kelas') ?? ''),
    tempat_pkl: String(formData.get('tempat_pkl') ?? ''),
    pembimbing: String(formData.get('pembimbing') ?? ''),
  };

  const validation = validateSiswaInput(rawValues);
  if (!validation.data) {
    return {
      errors: validation.errors,
      values: rawValues,
    };
  }

  const supabase = getSupabaseAdmin();

  for (let attempt = 0; attempt < 3; attempt++) {
    const kode = generateKodeSiswa();
    const { error } = await supabase.from('siswa').insert({
      nama: validation.data.nama,
      kelas: validation.data.kelas,
      tempat_pkl: validation.data.tempat_pkl,
      pembimbing: validation.data.pembimbing,
      kode,
    });

    if (!error) {
      revalidatePath('/admin/siswa');
      revalidatePath('/admin');
      return {
        success: true,
        message: `Siswa ${validation.data.nama} ditambahkan dengan kode ${kode}.`,
      };
    }

    if (error.code !== '23505') {
      return {
        message: 'Gagal menambahkan siswa. Silakan coba lagi.',
        values: rawValues,
      };
    }
  }

  return {
    message: 'Gagal menghasilkan kode siswa unik. Silakan coba lagi.',
    values: rawValues,
  };
}

export async function hapusSiswa(formData: FormData): Promise<void> {
  const isAdmin = await getAdminSession();
  if (!isAdmin) {
    redirect('/login');
  }

  const siswaId = Number(formData.get('siswa_id'));
  if (!Number.isInteger(siswaId) || siswaId <= 0) {
    return;
  }

  const supabase = getSupabaseAdmin();
  const { count } = await supabase
    .from('jurnal')
    .select('id', { count: 'exact', head: true })
    .eq('siswa_id', siswaId);

  if ((count ?? 0) > 0) {
    return;
  }

  await supabase.from('siswa').delete().eq('id', siswaId);
  revalidatePath('/admin/siswa');
  revalidatePath('/admin');
}
