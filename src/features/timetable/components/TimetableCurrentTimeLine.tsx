import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '../../../theme';

type TimetableCurrentTimeLineProps = {
    top: number;
};

function TimetableCurrentTimeLine({top}: TimetableCurrentTimeLineProps) {
    const {theme} = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return <View style={[styles.line, {top}]} />;
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        line: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            backgroundColor: theme.colors.timetableTimeLine,
            zIndex: 40,
        },
    });
}

export default TimetableCurrentTimeLine;
