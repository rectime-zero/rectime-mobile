import React from 'react';
import AccessoryButton from '../../button/AccessoryButton';
import ScreenLayoutBase, {type ScreenLayoutProps} from '../base/ScreenLayoutBase';
import {getPushRouteTitle} from '../../../config/navigationRoutes';
import {type AppRoute, type PushScreenName} from '../../../navigation/types';
import {useNavigation} from '../../../navigation/useNavigation';

type PushScreenLayoutProps = Omit<ScreenLayoutProps, 'title' | 'headerLeading'> & {
    route: AppRoute<PushScreenName>;
    titleOverride?: string;
};

function PushScreenLayout({route, titleOverride, ...props}: PushScreenLayoutProps) {
    const {pop} = useNavigation();

    return (
        <ScreenLayoutBase
            {...props}
            headerLeading={<AccessoryButton accessibilityLabel="戻る" icon="chevron-left" onPress={pop} />}
            title={titleOverride ?? getPushRouteTitle(route)}
        />
    );
}

export default PushScreenLayout;
