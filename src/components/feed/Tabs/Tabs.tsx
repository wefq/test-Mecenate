import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { observer } from 'mobx-react-lite';

import { feedStore, FeedTab } from '@/src/features/feed/model/feed.store';
import { tokens } from '@/src/theme/tokens';

const TABS: { key: FeedTab; label: string }[] = [
    { key: 'all', label: 'Все' },
    { key: 'free', label: 'Бесплатные' },
    { key: 'paid', label: 'Платные' },
];

export const FeedTabs = observer(() => {
    return (
        <View style={styles.container}>
            {TABS.map((tab) => {
                const active = feedStore.tab === tab.key;

                return (
                    <Pressable
                        key={tab.key}
                        onPress={() => feedStore.setTab(tab.key)}
                        style={[styles.tab, active && styles.activeTab]}
                    >
                        <Text
                            style={[styles.text, active && styles.activeText]}
                        >
                            {tab.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        margin: tokens.spacing.md,
        borderWidth: 1,
        borderColor: tokens.colors.alternativeGray,
        borderRadius: tokens.radius.full,
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: tokens.colors.white,
    },

    tab: {
        flex: 1,
        paddingVertical: tokens.spacing.sm,
        alignItems: 'center',
        borderRadius: tokens.radius.full,
    },

    activeTab: {
        borderWidth: 1,
        borderColor: tokens.colors.primary,
        backgroundColor: tokens.colors.primary,
    },

    text: {
        fontSize: tokens.typography.size.md,
        fontWeight: tokens.typography.weight.medium,
        color: tokens.colors.gray,
    },

    activeText: {
        color: tokens.colors.white,
    },
});
