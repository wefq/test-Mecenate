import { useEffect } from 'react';

import {
    InfiniteData,
    QueryClient,
    useQueryClient,
} from '@tanstack/react-query';
import { sessionStore } from '@/src/features/feed/model/session.store';
import type {
    PostDetailResponse,
    PostsResponse,
    PostType,
} from '@/src/types/api';

type LikeUpdatedEvent = {
    type: 'like_updated';
    postId: string;
    likesCount: number;
};

const RECONNECT_DELAY_MS = 2000;

function getWebSocketUrl(token: string) {
    const url = new URL(process.env.EXPO_PUBLIC_API_URL!);

    url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    url.pathname = `${url.pathname.replace(/\/$/, '')}/ws`;
    url.searchParams.set('token', token);

    return url.toString();
}

function patchPostLikesCount(
    post: PostType,
    postId: string,
    likesCount: number,
) {
    if (post.id !== postId) return post;

    return {
        ...post,
        likesCount,
    };
}

function applyLikeUpdated(
    queryClient: QueryClient,
    postId: string,
    likesCount: number,
) {
    queryClient.setQueryData<PostDetailResponse>(['post', postId], (current) => {
        if (!current) return current;

        return {
            ...current,
            data: {
                ...current.data,
                post: patchPostLikesCount(
                    current.data.post,
                    postId,
                    likesCount,
                ),
            },
        };
    });

    queryClient.setQueriesData<InfiniteData<PostsResponse>>(
        { queryKey: ['feed'] },
        (current) => {
            if (!current) return current;

            return {
                ...current,
                pages: current.pages.map((page) => ({
                    ...page,
                    data: {
                        ...page.data,
                        posts: page.data.posts.map((post) =>
                            patchPostLikesCount(post, postId, likesCount),
                        ),
                    },
                })),
            };
        },
    );
}

function parseLikeUpdatedEvent(data: unknown): LikeUpdatedEvent | null {
    if (typeof data !== 'string') return null;

    try {
        const message = JSON.parse(data) as Partial<LikeUpdatedEvent>;

        if (
            message.type === 'like_updated' &&
            typeof message.postId === 'string' &&
            typeof message.likesCount === 'number'
        ) {
            return message as LikeUpdatedEvent;
        }

        return null;
    } catch {
        return null;
    }
}

export function RealtimeLikesBridge() {
    const queryClient = useQueryClient();

    useEffect(() => {
        const token = sessionStore.token;

        if (!token) return;

        let socket: WebSocket | null = null;
        let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
        let closedByEffect = false;

        const connect = () => {
            socket = new WebSocket(getWebSocketUrl(token));

            socket.onmessage = (event) => {
                const message = parseLikeUpdatedEvent(event.data);

                if (message) {
                    applyLikeUpdated(
                        queryClient,
                        message.postId,
                        message.likesCount,
                    );
                }
            };

            socket.onclose = () => {
                if (closedByEffect) return;

                reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS);
            };

            socket.onerror = () => {
                socket?.close();
            };
        };

        connect();

        return () => {
            closedByEffect = true;

            if (reconnectTimer) {
                clearTimeout(reconnectTimer);
            }

            socket?.close();
        };
    }, [queryClient]);

    return null;
}
