import { Text, Pressable, StyleSheet } from 'react-native';

import { tokens } from '@/src/theme/tokens';

type ButtonProps = {
    title: string;
    fullWidth?: boolean;
    onClick?: () => void;
};

export function CustomButton({ title, fullWidth, onClick }: ButtonProps) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                pressed && styles.pressed,
                fullWidth && styles.fullWidth,
            ]}
            onPress={onClick}
        >
            <Text style={styles.title}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: tokens.spacing.md,
        paddingHorizontal: tokens.spacing.xl,
        borderRadius: tokens.radius.md,
        backgroundColor: tokens.components.button.default,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullWidth: { width: '100%' },
    pressed: {
        backgroundColor: tokens.components.button.pressed,
    },
    title: {
        color: tokens.colors.white,
    },
});
