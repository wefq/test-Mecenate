import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleLike } from '@/src/api/posts/posts';
import { sessionStore } from '@/src/features/feed/model/session.store';
import type {
    PostDetailResponse,
    PostsResponse,
    PostType,
} from '@/src/types/api';

type ToggleLikeParams = {
    postId: string;
};

function patchPostLike(
    post: PostType,
    postId: string,
    isLiked: boolean,
    likesCount: number,
) {
    if (post.id !== postId) return post;

    return {
        ...post,
        isLiked,
        likesCount,
    };
}

export function useToggleLikeMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId }: ToggleLikeParams) =>
            toggleLike({
                token: sessionStore.token!,
                id: postId,
            }),
        onSuccess: (response, { postId }) => {
            const { isLiked, likesCount } = response.data;

            queryClient.setQueryData<PostDetailResponse>(
                ['post', postId],
                (current) => {
                    if (!current) return current;

                    return {
                        ...current,
                        data: {
                            ...current.data,
                            post: patchPostLike(
                                current.data.post,
                                postId,
                                isLiked,
                                likesCount,
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
                                    patchPostLike(
                                        post,
                                        postId,
                                        isLiked,
                                        likesCount,
                                    ),
                                ),
                            },
                        })),
                    };
                },
            );
        },
    });
}
