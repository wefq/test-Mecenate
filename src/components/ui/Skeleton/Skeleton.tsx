import { View, StyleSheet, type ViewStyle } from 'react-native';

type Props = {
    width: ViewStyle['width'];
    height: number;
    borderRadius?: number;
    style?: ViewStyle;
};

export function Skeleton({
    width,
    height,
    borderRadius = 12,
    style,
}: Props) {
    return (
        <View
            style={[
                styles.block,
                { width, height, borderRadius },
                style,
            ]}
        />
    );
}

const styles = StyleSheet.create({
    block: {
        backgroundColor: '#E9E9EC',
    },
});