import { makeAutoObservable } from 'mobx';

export type FeedTab = 'all' | 'free' | 'paid';

class FeedStore {
    tab: FeedTab = 'all';

    constructor() {
        makeAutoObservable(this);
    }

    setTab(tab: FeedTab) {
        this.tab = tab;
    }
}

export const feedStore = new FeedStore();
