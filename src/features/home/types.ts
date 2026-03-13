import {type AppIconName} from '../../components/iconNames';

export type HomeActionTone = 'primary' | 'secondary';

export type HomeAction = {
    label: string;
    icon: AppIconName;
    tone: HomeActionTone;
};

export type HomeHighlight = {
    label: string;
    value: string;
};
