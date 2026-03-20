import React from 'react';
import AccessoryButton from '../../button/AccessoryButton';
import ScreenLayoutBase, {type ScreenLayoutProps} from '../base/ScreenLayoutBase';
import {getRootRouteTitle} from '../../../config/navigationRoutes';
import {useNavigation} from '../../../navigation/useNavigation';
import OpenMenuButton from '../../../navigation/components/OpenMenuButton';
import {screenLayout} from '../../../tokens/layout';

type RootScreenLayoutProps = Omit<ScreenLayoutProps, 'title' | 'headerLeading' | 'headerTrailing'> & {
    includeBottomNavigationInset?: boolean;
};

function RootScreenLayout(props: RootScreenLayoutProps) {
    const {contentContainerStyle, includeBottomNavigationInset = true, ...restProps} = props;
    const {rootRoute, pushRoute} = useNavigation();

    return (
        <ScreenLayoutBase
            {...restProps}
            headerLeading={<OpenMenuButton />}
            headerTrailing={
                <AccessoryButton
                    accessibilityLabel="通知"
                    icon="bell"
                    onPress={() => pushRoute({name: 'notifications', params: undefined})}
                />
            }
            title={getRootRouteTitle(rootRoute.name)}
            contentContainerStyle={[includeBottomNavigationInset ? styles.contentWithBottomNavigation : null, contentContainerStyle]}
        />
    );
}

const styles = {
    contentWithBottomNavigation: {
        paddingBottom: screenLayout.rootBottomNavigationInset,
    },
} as const;

export default RootScreenLayout;
