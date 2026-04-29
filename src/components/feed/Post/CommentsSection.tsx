import { Image } from 'expo-image';
import { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import SendIcon from '@/assets/icons/send.svg';
import { PostDetail } from '@/src/components/feed/Post/PostDetail';
import { useAddCommentMutation } from '@/src/features/post/hooks/useAddCommentMutation';
import { useCommentsQuery } from '@/src/features/post/hooks/useCommentsQuery';
import { tokens } from '@/src/theme/tokens';
import type { CommentType, PostType } from '@/src/types/api';
import { pluralize } from '@/src/helpers/pluralize';

type Props = {
    post: PostType;
};

function CommentItem({ comment }: { comment: CommentType }) {
    return (
        <View style={styles.comment}>
            <Image
                source={{ uri: comment.author.avatarUrl }}
                style={styles.avatar}
            />

            <View style={styles.commentBody}>
                <Text style={styles.authorName}>
                    {comment.author.displayName}
                </Text>
                <Text style={styles.commentText}>{comment.text}</Text>
            </View>
        </View>
    );
}

export function CommentsSection({ post }: Props) {
    const [text, setText] = useState('');
    const commentsQuery = useCommentsQuery(post.id);
    const addCommentMutation = useAddCommentMutation();

    const comments =
        commentsQuery.data?.pages.flatMap((page) => page.data.comments) ?? [];

    const submitComment = () => {
        const trimmed = text.trim();

        if (!trimmed || addCommentMutation.isPending) return;

        addCommentMutation.mutate(
            { postId: post.id, text: trimmed },
            {
                onSuccess: () => setText(''),
            },
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
            style={styles.container}
        >
            <FlatList
                data={comments}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="interactive"
                ListHeaderComponent={
                    <>
                        <PostDetail post={post} />
                        <Text style={styles.title}>
                            {post.commentsCount}{' '}
                            {pluralize(post.commentsCount, [
                                'комментарий',
                                'комментария',
                                'комментариев',
                            ])}
                        </Text>
                        {commentsQuery.isLoading ? (
                            <ActivityIndicator style={styles.loader} />
                        ) : null}
                    </>
                }
                renderItem={({ item }) => <CommentItem comment={item} />}
                ListFooterComponent={
                    commentsQuery.isFetchingNextPage ? (
                        <ActivityIndicator style={styles.loader} />
                    ) : null
                }
                onEndReachedThreshold={0.4}
                onEndReached={() => {
                    if (
                        commentsQuery.hasNextPage &&
                        !commentsQuery.isFetchingNextPage
                    ) {
                        commentsQuery.fetchNextPage();
                    }
                }}
            />

            <View style={styles.footer}>
                <View style={styles.form}>
                    <TextInput
                        value={text}
                        onChangeText={setText}
                        placeholder="Ваш комментарий"
                        multiline
                        maxLength={500}
                        style={styles.input}
                        placeholderTextColor={tokens.colors.alternativeGray}
                    />
                    <Pressable onPress={submitComment}>
                        <SendIcon />
                    </Pressable>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: tokens.colors.white,
    },
    title: {
        paddingHorizontal: tokens.spacing.md,
        fontSize: tokens.typography.size.md,
        fontWeight: tokens.typography.weight.bold,
        color: tokens.colors.gray,
    },
    comment: {
        flexDirection: 'row',
        paddingHorizontal: tokens.spacing.md,
        paddingVertical: tokens.spacing.sm,
        backgroundColor: tokens.colors.white,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: tokens.radius.full,
        marginRight: tokens.spacing.sm,
    },
    commentBody: {
        flex: 1,
    },
    authorName: {
        fontSize: tokens.typography.size.md,
        fontWeight: tokens.typography.weight.bold,
        marginBottom: tokens.spacing.xs,
    },
    commentText: {
        fontSize: tokens.typography.size.md,
    },
    loader: {
        paddingVertical: tokens.spacing.md,
    },
    footer: {
        paddingHorizontal: tokens.spacing.md,
        paddingTop: tokens.spacing.sm,
        paddingBottom: tokens.spacing.md,
    },
    form: {
        flexDirection: 'row',
        gap: tokens.spacing.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        paddingHorizontal: tokens.spacing.md,
        paddingVertical: tokens.spacing.sm,
        flex: 1,
        borderWidth: 1,
        borderColor: tokens.colors.alternativeGray,
        borderRadius: tokens.radius.full,
        backgroundColor: tokens.colors.white,
    },
});
