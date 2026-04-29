import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { tokens } from '@/src/theme/tokens';
import type { PostType } from '@/src/types/api';
import { FreeContent } from '@/src/components/feed/Post/FreeContent';

type PostProps = {
    post: PostType;
};

export function PostDetail({ post }: PostProps) {

    return (
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

            <FreeContent post={post} variant="detail" />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        paddingVertical: tokens.spacing.sm,
        backgroundColor: tokens.colors.white,
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
