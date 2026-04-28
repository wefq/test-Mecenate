import { Text, StyleProp, TextStyle } from 'react-native';
import ReadMore from 'react-native-read-more-text';

import { tokens } from '@/src/theme/tokens';

type ExpandableTextProps = {
    text: string;
    numberOfLines?: number;
    textStyle?: StyleProp<TextStyle>;
    linkStyle?: StyleProp<TextStyle>;
    moreLabel?: string;
    lessLabel?: string;
};

export function ExpandableText({
    text,
    numberOfLines = 2,
    textStyle,
    linkStyle,
    moreLabel = 'Показать еще',
    lessLabel = 'Скрыть',
}: ExpandableTextProps) {
    const renderTruncatedFooter = (handlePress: () => void) => (
        <Text style={[styles.link, linkStyle]} onPress={handlePress}>
            {moreLabel}
        </Text>
    );

    const renderRevealedFooter = (handlePress: () => void) => (
        <Text style={[styles.link, linkStyle]} onPress={handlePress}>
            {lessLabel}
        </Text>
    );

    return (
        <ReadMore
            numberOfLines={numberOfLines}
            renderTruncatedFooter={renderTruncatedFooter}
            renderRevealedFooter={renderRevealedFooter}
        >
            <Text style={textStyle}>{text}</Text>
        </ReadMore>
    );
}

const styles = {
    link: {
        color: tokens.colors.primary,
        marginTop: tokens.spacing.xs,
    } as TextStyle,
};
