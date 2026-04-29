import { useInfiniteQuery } from '@tanstack/react-query';
import { getComments } from '@/src/api/posts/posts';
import { sessionStore } from '@/src/features/feed/model/session.store';

export function useCommentsQuery(postId: string) {
    return useInfiniteQuery({
        queryKey: ['comments', postId],
        initialPageParam: null as string | null,
        queryFn: ({ pageParam }) =>
            getComments({
                token: sessionStore.token!,
                postId,
                cursor: pageParam,
                limit: 20,
            }),
        getNextPageParam: (lastPage) =>
            lastPage.data.hasMore ? lastPage.data.nextCursor : undefined,
        enabled: !!postId,
    });
}
