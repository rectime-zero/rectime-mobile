import React from 'react';
import ScreenLayoutBase, {type ScreenLayoutProps} from '../base/ScreenLayoutBase';

function RootScreenLayout(props: ScreenLayoutProps) {
    return (
        <ScreenLayoutBase
            {...props}
            contentContainerStyle={styles.contentWithBottomNavigation}
        />
    );
}

const styles = {
    contentWithBottomNavigation: {
        paddingBottom: 112,
    },
} as const;

export default RootScreenLayout;
