import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {DimensionValue} from 'react-native';
import {type TimetableLayoutItem, TIMETABLE_CONFIG} from '../../../domain/timetable';
import {useTheme} from '../../../theme';

type TimetableEventBlockProps = {
    item: TimetableLayoutItem;
    gridWidth: number;
    onPress?: (item: TimetableLayoutItem) => void;
};

function TimetableEventBlock({item, gridWidth, onPress}: TimetableEventBlockProps) {
    const {theme} = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);
    const isParticipant = item.accent === 'red';
    const isCompact = item.height < TIMETABLE_CONFIG.COMPACT_THRESHOLD_PX;
    const isVeryCompact = item.height < TIMETABLE_CONFIG.VERY_COMPACT_THRESHOLD_PX;
    const isNarrow = item.actualColumns >= 3;
    const isVeryNarrow = item.actualColumns >= 4;
    const isUltraNarrow = item.actualColumns >= 5;
    const backgroundColor = isParticipant ? theme.colors.timetableCardParticipant : theme.colors.timetableCardBackground;
    const textColor = isParticipant ? theme.colors.timetableCardTextDark : theme.colors.surfacePrimary;
    const resolvedWidth: DimensionValue =
        gridWidth > 0
            ? Math.max((gridWidth * item.widthPercent) / 100, TIMETABLE_CONFIG.MIN_EVENT_WIDTH_PX)
            : `${item.widthPercent}%`;
    const resolvedLeft: DimensionValue = gridWidth > 0 ? (gridWidth * item.leftPercent) / 100 : `${item.leftPercent}%`;

    return (
        <Pressable
            accessibilityRole="button"
            onPress={onPress ? () => onPress(item) : undefined}
            style={[
                styles.container,
                isCompact ? styles.containerCompact : null,
                isNarrow ? styles.containerNarrow : null,
                isVeryNarrow ? styles.containerVeryNarrow : null,
                {
                    top: item.top,
                    height: item.height,
                    left: resolvedLeft,
                    width: resolvedWidth,
                    backgroundColor,
                },
            ]}>
            <View style={[styles.accent, isParticipant ? styles.accentParticipant : styles.accentDefault]} />

            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <Text
                        numberOfLines={1}
                        style={[
                            styles.title,
                            isVeryCompact || isVeryNarrow ? styles.titleVeryCompact : null,
                            !isVeryCompact && (isCompact || isNarrow) ? styles.titleCompact : null,
                            isUltraNarrow ? styles.titleUltraNarrow : null,
                            {color: textColor},
                        ]}>
                        {item.title}
                    </Text>

                    {isVeryCompact ? (
                        <Text numberOfLines={1} style={[styles.inlineRange, {color: textColor}]}>
                            {item.rangeLabel}
                        </Text>
                    ) : null}
                </View>

                {isVeryCompact ? null : (
                    <Text
                        numberOfLines={1}
                        style={[
                            styles.range,
                            isNarrow ? styles.rangeCompact : null,
                            isVeryNarrow ? styles.rangeVeryCompact : null,
                            isUltraNarrow ? styles.rangeUltraCompact : null,
                            {color: textColor},
                        ]}>
                        {item.rangeLabel}
                    </Text>
                )}
            </View>
        </Pressable>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        container: {
            position: 'absolute',
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 4,
            paddingHorizontal: 8,
            paddingVertical: 8,
            shadowColor: '#000000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.16,
            shadowRadius: 2,
            elevation: 2,
            zIndex: 10,
        },
        containerCompact: {
            paddingVertical: 2,
        },
        containerNarrow: {
            paddingHorizontal: 6,
        },
        containerVeryNarrow: {
            paddingHorizontal: 4,
        },
        accent: {
            width: 4,
            height: '100%',
            borderRadius: 999,
            marginRight: 8,
        },
        accentDefault: {
            backgroundColor: theme.colors.timetableTimeLine,
        },
        accentParticipant: {
            backgroundColor: theme.colors.surfacePrimary,
        },
        content: {
            flex: 1,
            gap: 4,
            overflow: 'hidden',
        },
        titleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        title: {
            flexShrink: 1,
            fontWeight: '600',
        },
        titleCompact: {
            fontSize: 10,
            lineHeight: 12,
        },
        titleVeryCompact: {
            fontSize: 9,
            lineHeight: 10,
        },
        titleUltraNarrow: {
            fontSize: 8,
            lineHeight: 9,
        },
        range: {
            fontSize: 9,
            lineHeight: 10,
            fontWeight: '500',
            opacity: 0.8,
        },
        rangeCompact: {
            fontSize: 8,
            lineHeight: 9,
        },
        rangeVeryCompact: {
            fontSize: 7,
            lineHeight: 8,
        },
        rangeUltraCompact: {
            fontSize: 6,
            lineHeight: 7,
        },
        inlineRange: {
            flexShrink: 0,
            fontSize: 8,
            lineHeight: 10,
            fontWeight: '500',
            opacity: 0.7,
        },
    });
}

export default TimetableEventBlock;
