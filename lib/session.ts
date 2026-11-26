import crypto from 'crypto';
import { cookies } from 'next/headers';

const STUDENT_COOKIE = 'pkl_student_session';
const ADMIN_COOKIE = 'pkl_admin_session';
const STUDENT_MAX_AGE = 60 * 60 * 24 * 7;
const ADMIN_MAX_AGE = 60 * 60 * 24;

interface SessionPayload {
  role: 'student' | 'admin';
  siswaId?: number;
  exp: number;
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('SESSION_SECRET wajib diisi (minimal 16 karakter).');
  }
  return secret;
}

function signToken(payload: SessionPayload): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getSessionSecret())
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${signature}`;
}

function verifyToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encoded, signature] = parts;
  if (!encoded || !signature) return null;

  try {
    const expectedSig = crypto
      .createHmac('sha256', getSessionSecret())
      .update(encoded)
      .digest('base64url');

    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length) return null;
    if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;

    const payload = JSON.parse(
      Buffer.from(encoded, 'base64url').toString('utf8')
    ) as SessionPayload;

    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function setStudentSession(siswaId: number): Promise<void> {
  const cookieStore = await cookies();
  const token = signToken({
    role: 'student',
    siswaId,
    exp: Date.now() + STUDENT_MAX_AGE * 1000,
  });

  cookieStore.set(STUDENT_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: STUDENT_MAX_AGE,
  });
}

export async function getStudentSession(): Promise<number | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(STUDENT_COOKIE)?.value;
  const payload = verifyToken(token);

  if (!payload || payload.role !== 'student' || typeof payload.siswaId !== 'number') {
    return null;
  }
  return payload.siswaId;
}

export async function clearStudentSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(STUDENT_COOKIE);
}

export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = signToken({
    role: 'admin',
    exp: Date.now() + ADMIN_MAX_AGE * 1000,
  });

  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ADMIN_MAX_AGE,
  });
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  const payload = verifyToken(token);
  return payload?.role === 'admin';
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}
