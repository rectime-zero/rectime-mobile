import React from 'react';
import {DetailScreen} from '../features/detail';
import {HomeScreen} from '../features/home';
import {MapScreen} from '../features/map';
import {RankingScreen} from '../features/ranking';
import {RulesScreen} from '../features/rules';
import {SampleBottomSheet} from '../features/sampleSheet';
import {ScheduleScreen} from '../features/schedule';
import {type AppRoute, type PushScreenName, type RootScreenName, type SheetScreenName} from './types';

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
        case 'detail':
        default:
            return <DetailScreen route={route} />;
    }
}

export function renderSheetScreen(route: AppRoute<SheetScreenName>) {
    switch (route.name) {
        case 'sample-sheet':
        default:
            return <SampleBottomSheet />;
    }
}
