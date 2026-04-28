import { getPosts } from '@/src/api/posts/posts';
import { useInfiniteQuery } from '@tanstack/react-query';
import { sessionStore } from '@/src/features/feed/model/session.store';

export function useFeedQuery() {
    return useInfiniteQuery({
        queryKey: ['feed'],
        initialPageParam: null as string | null,
        queryFn: ({ pageParam }) =>
            getPosts({
                token: sessionStore.token!,
                cursor: pageParam,
                limit: 10,
                // simulateError: true
            }),
        getNextPageParam: (lastPage) =>
            lastPage.data.hasMore ? lastPage.data.nextCursor : undefined,
    });
}
