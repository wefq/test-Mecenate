export type Author = {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    bio: string;
    subscribersCount: number;
    isVerified: boolean;
};

export type PostTier = 'free' | 'paid';

export type PostType = {
    id: string;
    author: Author;
    title: string;
    body: string;
    preview: string;
    coverUrl: string;
    likesCount: number;
    commentsCount: number;
    isLiked: boolean;
    tier: PostTier;
    createdAt: string;
};

export type PostsResponse = {
    data: {
        posts: PostType[];
        nextCursor: string | null;
        hasMore: boolean;
    };
};

type Post = {
    id: string;
    author: Author;
    title: string;
    body: string;
    preview: string;
    coverUrl: string;
    likesCount: number;
    commentsCount: number;
    isLiked: boolean;
    tier: 'free' | 'paid';
    createdAt: string;
};

export type PostDetailResponse = {
    data: {
        post: Post;
    };
};

export type LikeResponse = {
    data: {
        isLiked: boolean;
        likesCount: number;
    };
};
