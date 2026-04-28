import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeAutoObservable, runInAction } from 'mobx';

const STORAGE_KEY = 'mecenate_user_uuid';

function generateUuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export class SessionStore {
    token: string | null = null;
    isReady = false;

    constructor() {
        makeAutoObservable(this);
    }

    async init() {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);

        if (saved) {
            runInAction(() => {
                this.token = saved;
                this.isReady = true;
            });
            return;
        }

        const next = generateUuid();
        await AsyncStorage.setItem(STORAGE_KEY, next);

        runInAction(() => {
            this.token = next;
            this.isReady = true;
        });
    }
}

export const sessionStore = new SessionStore();
