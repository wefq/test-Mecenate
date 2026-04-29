import { useQuery } from '@tanstack/react-query';
import { getPost } from '@/src/api/posts/posts';
import { sessionStore } from '@/src/features/feed/model/session.store';

export function usePostQuery(id: string) {
    return useQuery({
        queryKey: ['post', id],
        queryFn: () =>
            getPost({
                token: sessionStore.token!,
                id,
            }),
        select: (data) => data.data.post,
        enabled: !!id,
    });
}