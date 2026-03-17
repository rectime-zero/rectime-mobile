import React, {ReactNode} from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getMenuRevealWidth} from '../../../navigation/menuLayout';
import PanelLayoutBase from '../base/PanelLayoutBase';
import {screenLayout, sideMenuLayout} from '../../../tokens/layout';

type SideMenuLayoutProps = {
    children: ReactNode;
};

function SideMenuLayout({children}: SideMenuLayoutProps) {
    const {width: screenWidth} = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const revealWidth = getMenuRevealWidth(screenWidth);
    const styles = React.useMemo(() => createStyles(insets.top, revealWidth), [insets.top, revealWidth]);

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
            paddingTop: topInset + screenLayout.headerPaddingTop,
            paddingRight: sideMenuLayout.horizontalPadding,
            paddingBottom: sideMenuLayout.paddingBottom,
            paddingLeft: sideMenuLayout.horizontalPadding,
        },
    });
}

export default SideMenuLayout;
