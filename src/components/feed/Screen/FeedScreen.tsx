import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    View,
} from 'react-native';
import { observer } from 'mobx-react-lite';

import { useFeedQuery } from '@/src/features/feed/hooks/useFeedQuery';
import { FeedErrorState } from '@/src/components/feed/Error/FeedErrorState';
import { Post } from '@/src/components/feed/Post/Post';
import { feedStore } from '@/src/features/feed/model/feed.store';
import { FeedTabs } from '@/src/components/feed/Tabs/Tabs';
import { tokens } from '@/src/theme/tokens';

export const FeedScreen = observer(() => {
    const tab = feedStore.tab;

    const {
        data,
        isLoading,
        isError,
        refetch,
        isRefetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useFeedQuery(tab);

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
            <FeedTabs />

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
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: tokens.colors.appBackground,
        paddingTop: tokens.spacing.xl
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
