import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '../../../theme';

type TimetablePastOverlayProps = {
    height: number;
};

function TimetablePastOverlay({height}: TimetablePastOverlayProps) {
    const {theme} = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    if (height <= 0) {
        return null;
    }

    return <View style={[styles.overlay, {height}]} />;
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        overlay: {
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            backgroundColor: theme.colors.timetablePastOverlay,
            zIndex: 5,
        },
    });
}

export default TimetablePastOverlay;
