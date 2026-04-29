import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { tokens } from '@/src/theme/tokens';
import { usePostQuery } from '@/src/features/post/hooks/usePostQuery';
import { PostDetail } from '@/src/components/feed/Post/PostDetail';

export default function PostDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const { data: post, isLoading, isError, refetch } = usePostQuery(id);

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
            </View>
        );
    }

    if (isError || !post) {
        return (
            <View style={styles.center}>
                <Text>Ошибка загрузки</Text>
                <Text onPress={() => refetch()}>Повторить</Text>
            </View>
        );
    }

    return <PostDetail post={post} />;
}

const styles = StyleSheet.create({

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    image: {
        width: '100%',
        height: 200,
        borderRadius: tokens.radius.md,
        marginBottom: tokens.spacing.md,
    },

    author: {
        fontSize: tokens.typography.size.md,
        color: tokens.colors.gray,
    },

    title: {
        fontSize: tokens.typography.size.lg,
        fontWeight: tokens.typography.weight.bold,
        marginVertical: tokens.spacing.sm,
    },

    body: {
        fontSize: tokens.typography.size.md,
    },

    locked: {
        color: tokens.colors.gray,
        fontStyle: 'italic',
    },
});
