import React from 'react';
import DetailScreen from '../screens/DetailScreen';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import RankingScreen from '../screens/RankingScreen';
import RulesScreen from '../screens/RulesScreen';
import SampleBottomSheet from '../screens/SampleBottomSheet';
import ScheduleScreen from '../screens/ScheduleScreen';
import {type PushScreenName, type RootScreenName, type SheetScreenName, type StageRoute} from './types';

export function renderRootScreen(route: StageRoute<RootScreenName>) {
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

export function renderPushScreen(route: StageRoute<PushScreenName>) {
    switch (route.name) {
        case 'detail':
        default:
            return <DetailScreen route={route} />;
    }
}

export function renderSheetScreen(route: StageRoute<SheetScreenName>) {
    switch (route.name) {
        case 'sample-sheet':
        default:
            return <SampleBottomSheet />;
    }
}
