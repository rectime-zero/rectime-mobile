import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TIMETABLE_VIEW_CONFIG} from '../../../config/timetableConfig';
import {useTheme} from '../../../theme';

type TimetableCurrentTimeBadgeProps = {
    label: string;
    top: number;
};

function TimetableCurrentTimeBadge({label, top}: TimetableCurrentTimeBadgeProps) {
    const {theme} = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <View style={[styles.container, {top}]}>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        container: {
            position: 'absolute',
            top: 0,
            right: 4,
            width: TIMETABLE_VIEW_CONFIG.CURRENT_TIME_BADGE_WIDTH_PX,
            height: 22,
            borderRadius: 4,
            backgroundColor: theme.colors.timetableTimeLine,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 40,
        },
        label: {
            color: theme.colors.surfacePrimary,
            fontSize: 10,
            fontWeight: '800',
        },
    });
}

export default TimetableCurrentTimeBadge;
