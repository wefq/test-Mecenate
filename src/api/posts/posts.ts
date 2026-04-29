import { request } from '@/src/api/request';
import type {
    LikeResponse,
    PostDetailResponse,
    PostsResponse,
    PostTier,
} from '@/src/types/api';

type GetPostsParams = {
    token: string;
    cursor?: string | null;
    limit?: number;
    tier?: PostTier;
    simulateError?: boolean;
};

export async function getPosts(params: GetPostsParams) {
    const searchParams = new URLSearchParams();

    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.cursor) searchParams.set('cursor', params.cursor);
    if (params.tier) searchParams.set('tier', params.tier);
    if (params.simulateError) searchParams.set('simulate_error', 'true');

    const query = searchParams.toString();
    const path = `/posts${query ? `?${query}` : ''}`;

    return request<PostsResponse>(path, {
        method: 'GET',
        token: params.token,
    });
}

export async function getPost({ token, id }: { token: string; id: string }) {
    return request<PostDetailResponse>(`/posts/${id}`, {
        method: 'GET',
        token,
    });
}

export async function toggleLike({ token, id }: { token: string; id: string }) {
    return request<LikeResponse>(`/posts/${id}/like`, {
        method: 'POST',
        token,
    });
}
