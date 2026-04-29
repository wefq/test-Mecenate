import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';

import { sessionStore } from '@/src/features/feed/model/session.store';
import { RealtimeLikesBridge } from '@/src/features/realtime/RealtimeLikesBridge';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function RootLayout() {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: 1,
                        staleTime: 15_000,
                    },
                },
            }),
    );

    const [ready, setReady] = useState(false);

    useEffect(() => {
        sessionStore.init().finally(() => setReady(true));
    }, []);

    if (!ready) return null;

    return (
        <QueryClientProvider client={queryClient}>
            <RealtimeLikesBridge />
            <Stack screenOptions={{ headerShown: false }} />
        </QueryClientProvider>
    );
}
