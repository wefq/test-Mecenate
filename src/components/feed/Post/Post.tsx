import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { tokens } from '@/src/theme/tokens';
import type { PostType } from '@/src/types/api';
import { FreeContent } from '@/src/components/feed/Post/FreeContent';
import { PaidContent } from '@/src/components/feed/Post/PaidContent';

type PostProps = {
    post: PostType;
};

export function Post({ post }: PostProps) {
    const isPaid = post.tier === 'paid';

    return (
        <Pressable
            onPress={() => {
                if (post.tier === 'paid') return;

                router.push({
                    pathname: '/post/[id]',
                    params: { id: post.id },
                });
            }}
        >
            <View style={styles.card}>
                <View style={styles.header}>
                    <Image
                        source={{ uri: post.author.avatarUrl }}
                        style={styles.avatar}
                    />
                    <View style={styles.authorMeta}>
                        <Text style={styles.authorName}>
                            {post.author.displayName}
                        </Text>
                    </View>
                </View>

                {isPaid ? (
                    <PaidContent coverUrl={post.coverUrl} />
                ) : (
                    <FreeContent post={post} variant="feed" />
                )}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        paddingVertical: tokens.spacing.sm,
        backgroundColor: tokens.colors.white,
        marginBottom: tokens.spacing.sm,
        borderRadius: tokens.radius.sm,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: tokens.spacing.md,
        paddingTop: tokens.spacing.xs,
        marginBottom: tokens.spacing.md,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: tokens.radius.full,
    },
    authorMeta: {
        marginLeft: tokens.spacing.sm,
    },
    authorName: {
        fontWeight: tokens.typography.weight.bold,
        fontSize: tokens.typography.size.md,
    },
});
