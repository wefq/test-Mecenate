import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    View,
} from 'react-native';

import { FeedErrorState } from '@/src/components/feed/Error/FeedErrorState';
import { Post } from '@/src/components/feed/Post/Post';
import { tokens } from '@/src/theme/tokens';
import { useFeedQuery } from '@/src/features/feed/hooks/useFeedQuery';

export function FeedScreen() {
    const {
        data,
        isLoading,
        isError,
        refetch,
        isRefetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useFeedQuery();

    const posts = data?.pages.flatMap((page) => page.data.posts) ?? [];

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
            </View>
        );
    }

    if (isError) {
        return <FeedErrorState onRetry={() => refetch()} />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.content}
                renderItem={({ item }) => <Post post={item} />}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetch}
                    />
                }
                onEndReachedThreshold={0.4}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) {
                        fetchNextPage();
                    }
                }}
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <View style={styles.footerLoader}>
                            <ActivityIndicator />
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: tokens.colors.appBackground,
    },
    content: {},
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerLoader: {
        paddingVertical: tokens.spacing.md,
    },
});
