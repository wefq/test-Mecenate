import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { addComment } from '@/src/api/posts/posts';
import { sessionStore } from '@/src/features/feed/model/session.store';
import type {
    CommentType,
    CommentsResponse,
    PostDetailResponse,
    PostsResponse,
    PostType,
} from '@/src/types/api';

type AddCommentParams = {
    postId: string;
    text: string;
};

function incrementCommentsCount(post: PostType, postId: string) {
    if (post.id !== postId) return post;

    return {
        ...post,
        commentsCount: post.commentsCount + 1,
    };
}

function appendCommentToFirstPage(
    current: InfiniteData<CommentsResponse> | undefined,
    comment: CommentType,
) {
    if (!current) {
        return {
            pageParams: [null],
            pages: [
                {
                    data: {
                        comments: [comment],
                        nextCursor: null,
                        hasMore: false,
                    },
                },
            ],
        };
    }

    if (
        current.pages.some((page) =>
            page.data.comments.some((item) => item.id === comment.id),
        )
    ) {
        return current;
    }

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

export function useAddCommentMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, text }: AddCommentParams) =>
            addComment({
                token: sessionStore.token!,
                postId,
                text,
            }),
        onSuccess: (response, { postId }) => {
            const { comment } = response.data;

            queryClient.setQueryData<InfiniteData<CommentsResponse>>(
                ['comments', postId],
                (current) => appendCommentToFirstPage(current, comment),
            );

            queryClient.setQueryData<PostDetailResponse>(
                ['post', postId],
                (current) => {
                    if (!current) return current;

                    return {
                        ...current,
                        data: {
                            ...current.data,
                            post: incrementCommentsCount(
                                current.data.post,
                                postId,
                            ),
                        },
                    };
                },
            );

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
        },
    });
}
