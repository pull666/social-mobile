import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/stores/session';
import { api, type User } from '@/lib/api';

export function SessionSync() {
  const { token, ready } = useSession();
  const me = useQuery({
    queryKey: ['me', token],
    enabled: ready && !!token,
    queryFn: ({ signal }) => api<User>('/auth/me', { signal }),
    retry: false,
  });
  useEffect(() => {
    if (me.data && useSession.getState().token === token) useSession.setState({ user: me.data });
  }, [me.data, token]);
  return null;
}
