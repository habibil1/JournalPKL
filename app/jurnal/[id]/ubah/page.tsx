import { notFound, redirect } from 'next/navigation';
import { getStudentSession } from '@/lib/session';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import type { Jurnal, SiswaTanpaKode } from '@/lib/types';
import { getMinDateJakarta, getTodayJakarta } from '@/lib/validation';
import { StudentShell } from '@/components/StudentShell';
import { JurnalForm } from '@/components/JurnalForm';

export const dynamic = 'force-dynamic';

export default async function UbahJurnalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const siswaId = await getStudentSession();
  if (!siswaId) {
    redirect('/masuk');
  }

  const { id } = await params;
  const jurnalId = Number(id);
  if (!Number.isInteger(jurnalId) || jurnalId <= 0) {
    notFound();
  }

  const supabase = getSupabaseAdmin();

  const { data: siswa } = await supabase
    .from('siswa')
    .select('id, nama, kelas, tempat_pkl, pembimbing')
    .eq('id', siswaId)
    .maybeSingle<SiswaTanpaKode>();

  if (!siswa) {
    redirect('/masuk');
  }

  const { data: jurnal } = await supabase
    .from('jurnal')
    .select('id, siswa_id, tanggal, kegiatan, kompetensi, durasi_jam, status, catatan, dibuat')
    .eq('id', jurnalId)
    .maybeSingle<Jurnal>();

  if (!jurnal || jurnal.siswa_id !== siswa.id) {
    notFound();
  }

  return (
    <StudentShell siswa={siswa} activeNav="jurnal" breadcrumb="Ubah jurnal">
      <JurnalForm
        mode="edit"
        siswa={siswa}
        minDate={getMinDateJakarta()}
        maxDate={getTodayJakarta()}
        initialJurnal={jurnal}
      />
    </StudentShell>
  );
}
