import React from 'react';
import {
    getCurrentMapLocation,
    requestMapLocationPermission,
    watchMapLocation,
} from '../services/mapLocationService';
import {type MapLocation} from '../types';

export type UseMapLocationResult = {
    latitude: number | null;
    longitude: number | null;
    hasPermission: boolean;
    isLoading: boolean;
    requestCurrentLocation: () => Promise<void>;
};

function toResult(
    location: MapLocation | null,
    hasPermission: boolean,
    isLoading: boolean,
    requestCurrentLocation: () => Promise<void>,
): UseMapLocationResult {
    return {
        latitude: location?.latitude ?? null,
        longitude: location?.longitude ?? null,
        hasPermission,
        isLoading,
        requestCurrentLocation,
    };
}

export function useMapLocation(): UseMapLocationResult {
    const [location, setLocation] = React.useState<MapLocation | null>(null);
    const [hasPermission, setHasPermission] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);
    const stopWatchingRef = React.useRef<(() => void) | null>(null);

    const startWatchingLocation = React.useCallback(() => {
        if (stopWatchingRef.current) {
            return;
        }

        stopWatchingRef.current = watchMapLocation(
            nextLocation => {
                setLocation(nextLocation);
                setIsLoading(false);
            },
            error => {
                console.error('Failed to watch current location.', error);
                setIsLoading(false);
            },
        );
    }, []);

    const requestCurrentLocation = React.useCallback(async () => {
        setIsLoading(true);

        try {
            const permissionGranted = await requestMapLocationPermission();

            if (!permissionGranted) {
                setHasPermission(false);
                return;
            }

            setHasPermission(true);

            const nextLocation = await getCurrentMapLocation();
            setLocation(nextLocation);
            startWatchingLocation();
        } catch (error) {
            console.error('Failed to fetch current location.', error);
            setHasPermission(false);
        } finally {
            setIsLoading(false);
        }
    }, [startWatchingLocation]);

    React.useEffect(() => {
        return () => {
            stopWatchingRef.current?.();
            stopWatchingRef.current = null;
        };
    }, []);

    return toResult(location, hasPermission, isLoading, requestCurrentLocation);
}
