import { View, Text, StyleSheet } from 'react-native';

import ErrorIcon from '@/assets/icons/error.svg';
import { tokens } from '@/src/theme/tokens';
import { CustomButton } from '@/src/components/ui/CustomButton/CustomButton';

type FeedErrorStateProps = {
    onRetry: () => void;
};

export function FeedErrorState({ onRetry }: FeedErrorStateProps) {
    return (
        <View style={styles.container}>
            <ErrorIcon style={styles.icon} />
            <Text style={styles.title}>Не удалось загрузить публикации</Text>
            <CustomButton
                title="Повторить"
                fullWidth={true}
                onClick={onRetry}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: tokens.spacing.lg,
    },

    icon: {
        marginBottom: tokens.spacing.md,
    },

    title: {
        fontSize: tokens.typography.size.lg,
        fontWeight: tokens.typography.weight.bold,
        marginBottom: tokens.spacing.md,
        textAlign: 'center',
    },

    button: {
        paddingHorizontal: tokens.spacing.md,
        paddingVertical: tokens.spacing.sm,
        borderRadius: tokens.radius.sm,
        backgroundColor: tokens.colors.primary,
    },
});
