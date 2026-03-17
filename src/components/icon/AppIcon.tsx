import React from 'react';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import {Image, type ImageSourcePropType} from 'react-native';
import {type AppIconName} from './iconNames';

type FontAwesomeIconSpec = {
    kind: 'font-awesome';
    name: AppIconName;
    iconStyle?: 'solid' | 'regular';
};

type ImageIconSpec = {
    kind: 'image';
    source: ImageSourcePropType;
};

export type AppIconSpec = FontAwesomeIconSpec | ImageIconSpec;
export type AppIconKey = 'home' | 'schedule' | 'ranking' | 'map' | 'rules' | 'match-info' | 'settings' | 'development';

const appIconMap: Record<AppIconKey, AppIconSpec> = {
    home: {kind: 'font-awesome', name: 'home', iconStyle: 'solid'},
    schedule: {kind: 'font-awesome', name: 'calendar-alt', iconStyle: 'solid'},
    ranking: {kind: 'font-awesome', name: 'trophy', iconStyle: 'solid'},
    map: {kind: 'font-awesome', name: 'map-marked-alt', iconStyle: 'solid'},
    rules: {kind: 'font-awesome', name: 'book-open', iconStyle: 'solid'},
    'match-info': {kind: 'font-awesome', name: 'clipboard-check', iconStyle: 'solid'},
    settings: {kind: 'font-awesome', name: 'cog', iconStyle: 'solid'},
    development: {kind: 'font-awesome', name: 'list-ul', iconStyle: 'solid'},
};

function resolveAppIcon(icon: AppIconKey | AppIconSpec): AppIconSpec {
    if (typeof icon === 'string') {
        return appIconMap[icon];
    }

    return icon;
}

type AppIconProps = {
    icon: AppIconKey | AppIconSpec;
    size: number;
    color?: string;
};

function AppIcon({icon, size, color}: AppIconProps) {
    const resolvedIcon = resolveAppIcon(icon);

    if (resolvedIcon.kind === 'image') {
        return (
            <Image
                source={resolvedIcon.source}
                style={{width: size, height: size, tintColor: color}}
                resizeMode="contain"
            />
        );
    }

    if (resolvedIcon.iconStyle === 'regular') {
        return <FontAwesome5 color={color} iconStyle="regular" name={resolvedIcon.name as never} size={size} />;
    }

    return (
        <FontAwesome5
            color={color}
            iconStyle="solid"
            name={resolvedIcon.name as never}
            size={size}
        />
    );
}

export default AppIcon;
