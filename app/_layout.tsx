import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';

import { sessionStore } from '@/src/features/feed/model/session.store';
import { RealtimeBridge } from '@/src/features/realtime/RealtimeBridge';
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
            <RealtimeBridge />
            <Stack screenOptions={{ headerShown: false }} />
        </QueryClientProvider>
    );
}
