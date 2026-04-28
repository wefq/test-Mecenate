import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';

import PaidIcon from '@/assets/icons/paid.svg';
import { CustomButton } from '@/src/components/ui/CustomButton/CustomButton';
import { Skeleton } from '@/src/components/ui/Skeleton/Skeleton';
import { tokens } from '@/src/theme/tokens';

type Props = {
    coverUrl?: string;
};

export function PaidContent({ coverUrl }: Props) {
    return (
        <>
            <View style={styles.mediaContainer}>
                {!!coverUrl && (
                    <Image
                        source={{ uri: coverUrl }}
                        style={styles.cover}
                        contentFit="cover"
                    />
                )}

                <BlurView intensity={40} style={StyleSheet.absoluteFill} />

                <View style={styles.overlay}>
                    <PaidIcon style={styles.icon} />

                    <Text style={styles.text}>
                        Контент скрыт пользователем.{'\n'}
                        Доступ откроется после доната
                    </Text>

                    <CustomButton title="Отправить донат" />
                </View>
            </View>

            <View style={styles.content}>
                <Skeleton
                    width="45%"
                    height={20}
                    borderRadius={10}
                    style={styles.titleSkeleton}
                />

                <Skeleton width="100%" height={26} borderRadius={10} />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    mediaContainer: {
        position: 'relative',
    },

    cover: {
        width: '100%',
        aspectRatio: 1,
    },

    overlay: {
        position: 'absolute',
        inset: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: tokens.spacing.md,
    },

    icon: {
        marginBottom: tokens.spacing.sm,
    },

    text: {
        fontSize: tokens.typography.size.md,
        fontWeight: tokens.typography.weight.bold,
        color: tokens.colors.white,
        textAlign: 'center',
        marginBottom: tokens.spacing.sm,
    },

    content: {
        padding: tokens.spacing.md,
    },

    titleSkeleton: {
        marginBottom: tokens.spacing.sm,
    },
});
