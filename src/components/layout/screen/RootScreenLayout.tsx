import React from 'react';
import AccessoryButton from '../../button/AccessoryButton';
import ScreenLayoutBase, {type ScreenLayoutProps} from '../base/ScreenLayoutBase';
import {getRootRouteTitle} from '../../../config/navigationRoutes';
import {useNavigation} from '../../../navigation/useNavigation';
import OpenMenuButton from '../../../navigation/components/OpenMenuButton';
import {screenLayout} from '../../../tokens/layout';

type RootScreenLayoutProps = Omit<ScreenLayoutProps, 'title' | 'headerLeading' | 'headerTrailing'>;

function RootScreenLayout(props: RootScreenLayoutProps) {
    const {rootRoute, pushRoute} = useNavigation();

    return (
        <ScreenLayoutBase
            {...props}
            headerLeading={<OpenMenuButton />}
            headerTrailing={
                <AccessoryButton
                    accessibilityLabel="通知"
                    icon="bell"
                    onPress={() => pushRoute({name: 'notifications', params: undefined})}
                />
            }
            title={getRootRouteTitle(rootRoute.name)}
            contentContainerStyle={styles.contentWithBottomNavigation}
        />
    );
}

const styles = {
    contentWithBottomNavigation: {
        paddingBottom: screenLayout.rootBottomNavigationInset,
    },
} as const;

export default RootScreenLayout;
