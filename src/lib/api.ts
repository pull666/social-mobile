import { useSession } from '@/stores/session';

export interface User {
  id: string;
  username: string;
  nickname: string;
  role: 'user' | 'admin';
  status: 'active' | 'banned';
}

export interface Post {
  id: string;
  authorId: string;
  nickname: string;
  body: string;
  status: 'pending' | 'published' | 'hidden';
  createdAt: string;
}

export interface Page {
  items: Post[];
  nextCursor: string | null;
}

const base = (process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function api<T>(
  path: string,
  options: { method?: string; body?: unknown; signal?: AbortSignal } = {},
): Promise<T> {
  const token = useSession.getState().token;
  const response = await fetch(`${base}/api/app/v1${path}`, {
    method: options.method ?? 'GET',
    signal: options.signal ?? AbortSignal.timeout(15000),
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const result = (await response.json()) as { success: boolean; data: T; errorMessage?: string };
  if (!response.ok || !result.success) {
    if (response.status === 401 && path !== '/auth/login') await useSession.getState().clear();
    throw new ApiError(response.status, result.errorMessage ?? '请求失败，请重试');
  }
  return result.data;
}
