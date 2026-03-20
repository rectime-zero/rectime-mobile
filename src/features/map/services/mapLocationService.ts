import {PermissionsAndroid, Platform} from 'react-native';
import {type MapLocation} from '../types';

type GeolocationModule = typeof import('react-native-geolocation-service');
type GeolocationRuntime = GeolocationModule['default'];

function getOptionalGeolocationRuntime(): GeolocationRuntime | null {
    try {
        const module = require('react-native-geolocation-service') as GeolocationModule & {
            default?: GeolocationRuntime;
        };

        return module.default ?? (module as unknown as GeolocationRuntime);
    } catch (error) {
        console.error('react-native-geolocation-service is unavailable.', error);
        return null;
    }
}

function toMapLocation(position: {
    coords: {
        latitude: number;
        longitude: number;
    };
}): MapLocation {
    return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
    };
}

export async function requestMapLocationPermission(): Promise<boolean> {
    const geolocation = getOptionalGeolocationRuntime();

    if (!geolocation) {
        return false;
    }

    if (Platform.OS === 'ios') {
        const status = await geolocation.requestAuthorization('whenInUse');
        return status === 'granted';
    }

    const permissionResult = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
            title: '位置情報の利用許可',
            message: '会場マップで現在地を表示するために位置情報を使用します。',
            buttonPositive: '許可する',
            buttonNegative: '許可しない',
            buttonNeutral: 'あとで',
        },
    );

    return permissionResult === PermissionsAndroid.RESULTS.GRANTED;
}

export function getCurrentMapLocation(): Promise<MapLocation> {
    const geolocation = getOptionalGeolocationRuntime();

    if (!geolocation) {
        return Promise.reject(new Error('Geolocation runtime is unavailable.'));
    }

    return new Promise((resolve, reject) => {
        geolocation.getCurrentPosition(
            position => {
                resolve(toMapLocation(position));
            },
            error => {
                reject(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 5000,
                showLocationDialog: true,
                forceRequestLocation: true,
            },
        );
    });
}

export function watchMapLocation(
    onLocation: (location: MapLocation) => void,
    onError: (error: unknown) => void,
) {
    const geolocation = getOptionalGeolocationRuntime();

    if (!geolocation) {
        onError(new Error('Geolocation runtime is unavailable.'));
        return () => undefined;
    }

    const watchId = geolocation.watchPosition(
        position => {
            onLocation(toMapLocation(position));
        },
        error => {
            onError(error);
        },
        {
            enableHighAccuracy: true,
            distanceFilter: 10,
            interval: 10000,
            fastestInterval: 5000,
            showLocationDialog: true,
            forceRequestLocation: true,
        },
    );

    return () => {
        geolocation.clearWatch(watchId);
    };
}
