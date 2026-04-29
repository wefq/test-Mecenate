import { useEffect } from 'react';

import {
    InfiniteData,
    QueryClient,
    useQueryClient,
} from '@tanstack/react-query';
import { sessionStore } from '@/src/features/feed/model/session.store';
import type {
    CommentType,
    CommentsResponse,
    PostDetailResponse,
    PostsResponse,
    PostType,
} from '@/src/types/api';

type LikeUpdatedEvent = {
    type: 'like_updated';
    postId: string;
    likesCount: number;
};

type CommentAddedEvent = {
    type: 'comment_added';
    postId: string;
    comment: CommentType;
};

type RealtimeEvent = LikeUpdatedEvent | CommentAddedEvent;

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

function appendCommentToFirstPage(
    current: InfiniteData<CommentsResponse> | undefined,
    comment: CommentType,
) {
    if (!current) return current;

    const [firstPage, ...restPages] = current.pages;

    if (!firstPage) return current;

    return {
        ...current,
        pages: [
            {
                ...firstPage,
                data: {
                    ...firstPage.data,
                    comments: [comment, ...firstPage.data.comments],
                },
            },
            ...restPages,
        ],
    };
}

function hasComment(
    current: InfiniteData<CommentsResponse> | undefined,
    commentId: string,
) {
    return current?.pages.some((page) =>
        page.data.comments.some((comment) => comment.id === commentId),
    );
}

function applyCommentAdded(
    queryClient: QueryClient,
    postId: string,
    comment: CommentType,
) {
    const commentsKey = ['comments', postId];
    const currentComments =
        queryClient.getQueryData<InfiniteData<CommentsResponse>>(commentsKey);

    if (hasComment(currentComments, comment.id)) return;

    queryClient.setQueryData<InfiniteData<CommentsResponse>>(
        commentsKey,
        (current) => appendCommentToFirstPage(current, comment),
    );

    queryClient.setQueryData<PostDetailResponse>(['post', postId], (current) => {
        if (!current) return current;

        return {
            ...current,
            data: {
                ...current.data,
                post: incrementCommentsCount(current.data.post, postId),
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
                            incrementCommentsCount(post, postId),
                        ),
                    },
                })),
            };
        },
    );
}

function incrementCommentsCount(post: PostType, postId: string) {
    if (post.id !== postId) return post;

    return {
        ...post,
        commentsCount: post.commentsCount + 1,
    };
}

function isComment(value: unknown): value is CommentType {
    if (!value || typeof value !== 'object') return false;

    const comment = value as Partial<CommentType>;

    return (
        typeof comment.id === 'string' &&
        typeof comment.postId === 'string' &&
        typeof comment.text === 'string' &&
        typeof comment.createdAt === 'string' &&
        !!comment.author
    );
}

function parseRealtimeEvent(data: unknown): RealtimeEvent | null {
    if (typeof data !== 'string') return null;

    try {
        const message = JSON.parse(data) as Partial<CommentAddedEvent> &
            Partial<LikeUpdatedEvent>;

        if (
            message.type === 'like_updated' &&
            typeof message.postId === 'string' &&
            typeof message.likesCount === 'number'
        ) {
            return {
                type: message.type,
                postId: message.postId,
                likesCount: message.likesCount,
            };
        }

        if (
            message.type === 'comment_added' &&
            typeof message.postId === 'string' &&
            isComment(message.comment)
        ) {
            return {
                type: message.type,
                postId: message.postId,
                comment: message.comment,
            };
        }

        return null;
    } catch {
        return null;
    }
}

export function RealtimeBridge() {
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
                const message = parseRealtimeEvent(event.data);

                if (message?.type === 'like_updated') {
                    applyLikeUpdated(
                        queryClient,
                        message.postId,
                        message.likesCount,
                    );
                }

                if (message?.type === 'comment_added') {
                    applyCommentAdded(
                        queryClient,
                        message.postId,
                        message.comment,
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
