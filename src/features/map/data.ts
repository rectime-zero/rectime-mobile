import {type MapCopy, type MapPlace} from './types';

export const mapCopy: MapCopy = {
    title: 'マップは後続実装',
    body: 'この画面では地図本体はまだ描かず、操作ボタンと場所一覧だけを配置しています。',
    placeTitle: '場所一覧',
};

export const mapPlaces: MapPlace[] = [
    {id: 'center-court', name: 'センターコート'},
    {id: 'reception', name: '受付'},
    {id: 'food-area', name: 'フードエリア'},
    {id: 'rest-zone', name: '休憩ゾーン'},
];
