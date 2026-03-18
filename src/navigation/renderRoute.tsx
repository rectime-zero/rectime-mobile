import React from 'react';
import {DetailScreen} from '../features/detail';
import {DevMenuScreen} from '../features/dev/screens/DevMenuScreen';
import {HelpCenterScreen} from '../features/helpCenter';
import {HomeScreen} from '../features/home';
import {MapScreen} from '../features/map';
import {MatchInfoScreen} from '../features/matchInfo';
import {NotificationsScreen} from '../features/notifications';
import {RankingScreen} from '../features/ranking';
import {RulesScreen} from '../features/rules';
import {SampleBottomSheet} from '../features/sampleSheet';
import {ScheduleScreen} from '../features/schedule';
import {SettingsScreen} from '../features/settings';
import {ThemeSheet} from '../features/themeSheet';
import {
    type AppRoute,
    type PushScreenName,
    type RootScreenName,
    type SheetScreenName,
    type SheetScreenOptions,
} from './types';

export function renderRootScreen(route: AppRoute<RootScreenName>) {
    switch (route.name) {
        case 'schedule':
            return <ScheduleScreen />;
        case 'ranking':
            return <RankingScreen />;
        case 'map':
            return <MapScreen />;
        case 'rules':
            return <RulesScreen />;
        case 'home':
        default:
            return <HomeScreen />;
    }
}

export function renderPushScreen(route: AppRoute<PushScreenName>) {
    switch (route.name) {
        case 'notifications':
            return <NotificationsScreen route={route as AppRoute<'notifications'>} />;
        case 'settings':
            return <SettingsScreen route={route as AppRoute<'settings'>} />;
        case 'help-center':
            return <HelpCenterScreen route={route as AppRoute<'help-center'>} />;
        case 'match-info':
            return <MatchInfoScreen route={route as AppRoute<'match-info'>} />;
        case 'dev':
            return <DevMenuScreen />;
        case 'detail':
        default:
            return <DetailScreen route={route as AppRoute<'detail'>} />;
    }
}

export function renderSheetScreen(route: AppRoute<SheetScreenName>) {
    switch (route.name) {
        case 'theme-sheet':
            return <ThemeSheet />;
        case 'sample-sheet':
        default:
            return <SampleBottomSheet />;
    }
}

export function getSheetScreenOptions(route: AppRoute<SheetScreenName>): SheetScreenOptions {
    switch (route.name) {
        case 'theme-sheet':
            return {
                layoutMode: 'full',
                showHandle: false,
            };
        case 'sample-sheet':
        default:
            return {
                layoutMode: 'fit',
                showHandle: true,
            };
    }
}
