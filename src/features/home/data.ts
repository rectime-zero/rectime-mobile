import {type HomeAction, type HomeHighlight} from './types';

export const homeActions: HomeAction[] = [
    {label: '次の試合', icon: 'play-circle', tone: 'primary'},
    {label: '通知を確認', icon: 'bell', tone: 'secondary'},
    {label: '会場メモ', icon: 'sticky-note', tone: 'secondary'},
];

export const homeHighlights: HomeHighlight[] = [
    {label: '来場者', value: '1,280'},
    {label: '進行率', value: '68%'},
    {label: 'コート数', value: '12'},
];
