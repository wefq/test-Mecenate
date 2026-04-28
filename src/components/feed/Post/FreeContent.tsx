import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { observer } from 'mobx-react-lite';

import type { PostType } from '@/src/types/api';
import ChatIcon from '@/assets/icons/chat.svg';
import LikeIcon from '@/assets/icons/heart.svg';
import ActiveLikeIcon from '@/assets/icons/filled-heart.svg';
import { ExpandableText } from '@/src/components/ui/ExpandableText/ExpandableText';
import { IconCounterButton } from '@/src/components/ui/CounterButton/CounterButton';
import { likesStore } from '@/src/features/feed/model/likes.store';
import { tokens } from '@/src/theme/tokens';

type Props = {
    post: PostType;
};

export const FreeContent = observer(({ post }: Props) => {
    const liked = likesStore.isLiked(post.id);
    const likesCount = likesStore.getCount(post.likesCount, post.id);

    const onLike = () => likesStore.toggle(post.id)

    return (
        <>
            {!!post.coverUrl && (
                <Image
                    source={{ uri: post.coverUrl }}
                    style={styles.cover}
                    contentFit="cover"
                />
            )}

            <View style={styles.content}>
                <Text style={styles.title}>{post.title}</Text>

                <ExpandableText text={post.preview} numberOfLines={2} />

                <View style={styles.footer}>
                    <IconCounterButton
                        number={likesCount}
                        isActive={liked}
                        icon={LikeIcon}
                        activeIcon={ActiveLikeIcon}
                        onPress={onLike}
                        activeBg={tokens.components.likeButton.active.default}
                        inactiveBg={
                            tokens.components.likeButton.inactive.default
                        }
                        activeTextColor={tokens.colors.white}
                        inactiveTextColor={tokens.colors.gray}
                    />

                    <IconCounterButton
                        number={post.commentsCount}
                        icon={ChatIcon}
                        inactiveBg={
                            tokens.components.likeButton.inactive.default
                        }
                        inactiveTextColor={tokens.colors.gray}
                    />
                </View>
            </View>
        </>
    );
});

const styles = StyleSheet.create({
    cover: {
        width: '100%',
        aspectRatio: 1,
    },

    content: {
        padding: tokens.spacing.md,
    },

    title: {
        fontSize: tokens.typography.size.md,
        fontWeight: tokens.typography.weight.bold,
        marginBottom: tokens.spacing.xs,
    },

    footer: {
        flexDirection: 'row',
        gap: tokens.spacing.md,
        marginTop: tokens.spacing.sm,
    },
});
