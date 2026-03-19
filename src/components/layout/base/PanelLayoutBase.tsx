import React, {ReactNode} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useTheme} from '../../../theme';

export type PanelLayoutProps = {
    children: ReactNode;
    contentStyle?: StyleProp<ViewStyle>;
};

function PanelLayoutBase({children, contentStyle}: PanelLayoutProps) {
    const {theme} = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <View style={styles.container}>
            <View style={[styles.content, contentStyle]}>{children}</View>
        </View>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        container: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: '100%',
            backgroundColor: theme.colors.menuBackground,
        },
        content: {
            flex: 1,
        },
    });
}

export default PanelLayoutBase;
