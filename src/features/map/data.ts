import {type Facility, type MapCopy} from './types';

export const mapCopy: MapCopy = {
    title: '会場マップ',
    body: '現在地と主要施設をあわせて確認できます。ネイティブ設定が未反映の間も一覧は維持します。',
    placeTitle: '場所一覧',
    permissionRequired: '位置情報の許可が必要です',
    currentLocationLoading: '現在地を取得しています。',
    unavailableTitle: '地図を表示できません',
    unavailableBody: 'Mapbox のネイティブ設定、またはアクセストークンが未設定です。',
};

export const initialMapCenter: [number, number] = [139.7673068, 35.6809591];
export const initialMapZoomLevel = 16;

export const facilities: Facility[] = [
    {
        id: 'main-entrance',
        type: 'entrance',
        name: 'メイン入口',
        latitude: 35.68122,
        longitude: 139.76675,
        description: '入場ゲート',
    },
    {
        id: 'south-exit',
        type: 'exit',
        name: '南側出口',
        latitude: 35.68041,
        longitude: 139.76786,
        description: '退場導線',
    },
    {
        id: 'info-desk',
        type: 'info',
        name: '案内所',
        latitude: 35.68092,
        longitude: 139.76632,
        description: '総合案内',
    },
    {
        id: 'toilet-east',
        type: 'toilet',
        name: '東トイレ',
        latitude: 35.68148,
        longitude: 139.7681,
        description: '多目的トイレあり',
    },
    {
        id: 'trash-west',
        type: 'trash',
        name: '西側ゴミ箱',
        latitude: 35.68054,
        longitude: 139.76594,
        description: '分別対応',
    },
    {
        id: 'waiting-area',
        type: 'waiting',
        name: '待機エリア',
        latitude: 35.68077,
        longitude: 139.76727,
        description: '集合場所',
    },
];
