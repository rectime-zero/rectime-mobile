import React, {ReactNode} from 'react';
import {Platform, StatusBar, StyleSheet, useWindowDimensions} from 'react-native';
import {getMenuRevealWidth} from '../../../navigation/menuLayout';
import PanelLayoutBase from '../base/PanelLayoutBase';

type SideMenuLayoutProps = {
    children: ReactNode;
};

function SideMenuLayout({children}: SideMenuLayoutProps) {
    const {width: screenWidth} = useWindowDimensions();
    const topInset = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;
    const revealWidth = getMenuRevealWidth(screenWidth);
    const styles = React.useMemo(() => createStyles(topInset, revealWidth), [topInset, revealWidth]);

    return (
        <PanelLayoutBase contentStyle={styles.contentArea}>
            {children}
        </PanelLayoutBase>
    );
}

function createStyles(topInset: number, revealWidth: number) {
    return StyleSheet.create({
        contentArea: {
            width: revealWidth,
            flex: 1,
            paddingTop: topInset + 18,
            paddingRight: 30,
            paddingBottom: 33,
            paddingLeft: 30,
        },
    });
}

export default SideMenuLayout;
