'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { clearStudentSession, getStudentSession } from '@/lib/session';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import type { FormActionState } from '@/lib/types';
import { validateJurnalInput, type JurnalField } from '@/lib/validation';

export async function logoutSiswa(): Promise<void> {
  await clearStudentSession();
  redirect('/masuk');
}

export async function createJurnal(
  _prevState: FormActionState<JurnalField>,
  formData: FormData
): Promise<FormActionState<JurnalField>> {
  const siswaId = await getStudentSession();
  if (!siswaId) {
    redirect('/masuk');
  }

  const rawValues = {
    tanggal: String(formData.get('tanggal') ?? ''),
    kegiatan: String(formData.get('kegiatan') ?? ''),
    kompetensi: String(formData.get('kompetensi') ?? ''),
    durasi_jam: String(formData.get('durasi_jam') ?? ''),
  };

  const validation = validateJurnalInput(rawValues);
  if (!validation.data) {
    return {
      errors: validation.errors,
      values: rawValues,
    };
  }

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('jurnal').insert({
      siswa_id: siswaId,
      tanggal: validation.data.tanggal,
      kegiatan: validation.data.kegiatan,
      kompetensi: validation.data.kompetensi,
      durasi_jam: validation.data.durasi_jam,
      status: 'diajukan',
      catatan: null,
    });

    if (error) {
      if (error.code === '23505') {
        return {
          errors: {
            tanggal: 'Kamu sudah menulis jurnal pada tanggal ini. Maksimal satu jurnal per hari.',
          },
          values: rawValues,
        };
      }
      return {
        message: 'Gagal menyimpan jurnal. Periksa kembali isian kamu.',
        values: rawValues,
      };
    }
  } catch {
    return {
      message: 'Terjadi kesalahan pada server saat menyimpan jurnal.',
      values: rawValues,
    };
  }

  revalidatePath('/jurnal');
  redirect('/jurnal');
}

export async function updateJurnal(
  jurnalId: number,
  _prevState: FormActionState<JurnalField>,
  formData: FormData
): Promise<FormActionState<JurnalField>> {
  const siswaId = await getStudentSession();
  if (!siswaId) {
    redirect('/masuk');
  }

  const rawValues = {
    tanggal: String(formData.get('tanggal') ?? ''),
    kegiatan: String(formData.get('kegiatan') ?? ''),
    kompetensi: String(formData.get('kompetensi') ?? ''),
    durasi_jam: String(formData.get('durasi_jam') ?? ''),
  };

  const supabase = getSupabaseAdmin();
  const { data: existing, error: fetchError } = await supabase
    .from('jurnal')
    .select('id, siswa_id, status')
    .eq('id', jurnalId)
    .maybeSingle();

  if (fetchError || !existing || existing.siswa_id !== siswaId) {
    return {
      message: 'Jurnal tidak ditemukan atau bukan milikmu.',
      values: rawValues,
    };
  }

  if (existing.status === 'disetujui') {
    return {
      message: 'Jurnal yang sudah disetujui terkunci dan tidak dapat diubah.',
      values: rawValues,
    };
  }

  const validation = validateJurnalInput(rawValues);
  if (!validation.data) {
    return {
      errors: validation.errors,
      values: rawValues,
    };
  }

  const updatePayload: {
    tanggal: string;
    kegiatan: string;
    kompetensi: string;
    durasi_jam: number;
    status?: 'diajukan';
    catatan?: null;
  } = {
    tanggal: validation.data.tanggal,
    kegiatan: validation.data.kegiatan,
    kompetensi: validation.data.kompetensi,
    durasi_jam: validation.data.durasi_jam,
  };

  if (existing.status === 'revisi') {
    updatePayload.status = 'diajukan';
    updatePayload.catatan = null;
  }

  const { error: updateError } = await supabase
    .from('jurnal')
    .update(updatePayload)
    .eq('id', jurnalId)
    .eq('siswa_id', siswaId);

  if (updateError) {
    if (updateError.code === '23505') {
      return {
        errors: {
          tanggal: 'Kamu sudah memiliki jurnal pada tanggal ini. Pilih tanggal lain.',
        },
        values: rawValues,
      };
    }
    return {
      message: 'Gagal memperbarui jurnal. Silakan coba lagi.',
      values: rawValues,
    };
  }

  revalidatePath('/jurnal');
  revalidatePath(`/jurnal/${jurnalId}/ubah`);
  redirect('/jurnal');
}
