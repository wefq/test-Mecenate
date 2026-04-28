import { makeAutoObservable } from 'mobx';

class LikesStore {
    likedPosts = new Set<string>();

    constructor() {
        makeAutoObservable(this);
    }

    isLiked(postId: string) {
        return this.likedPosts.has(postId);
    }

    toggle(postId: string) {
        if (this.likedPosts.has(postId)) {
            this.likedPosts.delete(postId);
        } else {
            this.likedPosts.add(postId);
        }
    }

    getCount(baseCount: number, postId: string) {
        return this.isLiked(postId) ? baseCount + 1 : baseCount;
    }
}

export const likesStore = new LikesStore();
