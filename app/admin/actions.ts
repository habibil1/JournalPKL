'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/session';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import type { FormActionState } from '@/lib/types';

export async function tinjauJurnal(
  _prevState: FormActionState<'catatan'>,
  formData: FormData
): Promise<FormActionState<'catatan'>> {
  const isAdmin = await getAdminSession();
  if (!isAdmin) {
    redirect('/login');
  }

  const jurnalId = Number(formData.get('jurnal_id'));
  const aksi = String(formData.get('aksi') ?? '');
  const rawCatatan = String(formData.get('catatan') ?? '');
  const catatan = rawCatatan.trim();

  if (!Number.isInteger(jurnalId) || jurnalId <= 0) {
    return { message: 'Jurnal tidak valid.' };
  }

  if (aksi !== 'setujui' && aksi !== 'revisi') {
    return { message: 'Aksi peninjauan tidak valid.' };
  }

  if (aksi === 'revisi' && catatan.length < 5) {
    return {
      errors: {
        catatan: 'Catatan revisi wajib diisi minimal 5 karakter.',
      },
      values: { catatan: rawCatatan },
    };
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('jurnal')
    .update(
      aksi === 'setujui'
        ? { status: 'disetujui', catatan: null }
        : { status: 'revisi', catatan }
    )
    .eq('id', jurnalId);

  if (error) {
    return {
      message: 'Gagal memperbarui status jurnal. Silakan coba lagi.',
      values: { catatan: rawCatatan },
    };
  }

  revalidatePath('/admin');
  revalidatePath('/jurnal');
  revalidatePath(`/jurnal/${jurnalId}/ubah`);

  return {
    success: true,
    message:
      aksi === 'setujui'
        ? 'Jurnal berhasil disetujui.'
        : 'Permintaan revisi dan catatan telah dikirim ke siswa.',
  };
}
