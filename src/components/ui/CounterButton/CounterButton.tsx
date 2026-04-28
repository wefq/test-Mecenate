import { Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';

import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

import { tokens } from '@/src/theme/tokens';

type IconType = React.ComponentType<any>;

type Props = {
    number: number;
    isActive?: boolean;

    icon: IconType;
    activeIcon?: IconType;

    activeBg?: string;
    inactiveBg?: string;

    activeTextColor?: string;
    inactiveTextColor?: string;

    onPress?: () => void;
};

export function IconCounterButton({
    number,
    isActive = false,
    icon: Icon,
    activeIcon: ActiveIcon,
    activeBg,
    inactiveBg,
    activeTextColor,
    inactiveTextColor,
    onPress,
}: Props) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePress = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        scale.value = withSequence(
            withTiming(1.15, { duration: 120 }),
            withTiming(1, { duration: 120 }),
        );

        onPress?.();
    };

    const CurrentIcon = isActive && ActiveIcon ? ActiveIcon : Icon;

    return (
        <Animated.View style={animatedStyle}>
            <Pressable
                onPress={handlePress}
                style={[
                    styles.button,
                    {
                        backgroundColor: isActive ? activeBg : inactiveBg,
                    },
                ]}
            >
                <CurrentIcon />
                <Text
                    style={[
                        styles.title,
                        {
                            color: isActive
                                ? activeTextColor
                                : inactiveTextColor,
                        },
                    ]}
                >
                    {number}
                </Text>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: tokens.spacing.sm,
        borderRadius: tokens.radius.full,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: tokens.typography.size.sm,
        fontWeight: tokens.typography.weight.bold,
    },
});