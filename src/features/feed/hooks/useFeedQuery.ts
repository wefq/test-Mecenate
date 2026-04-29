import { useInfiniteQuery } from '@tanstack/react-query';
import { getPosts } from '@/src/api/posts/posts';
import { sessionStore } from '@/src/features/feed/model/session.store';
import { FeedTab } from '@/src/features/feed/model/feed.store';

export function useFeedQuery(tab: FeedTab) {
    return useInfiniteQuery({
        queryKey: ['feed', tab],
        initialPageParam: null as string | null,
        queryFn: ({ pageParam }) =>
            getPosts({
                token: sessionStore.token!,
                cursor: pageParam,
                limit: 10,
                tier:
                    tab === 'all'
                        ? undefined
                        : tab,
                // simulateError: true
            }),
        getNextPageParam: (lastPage) =>
            lastPage.data.hasMore ? lastPage.data.nextCursor : undefined,
    });
}
