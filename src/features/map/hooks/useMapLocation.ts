import React from 'react';
import {requestMapLocationPermission, watchMapLocation} from '../services/mapLocationService';
import {type MapLocation} from '../types';

export type UseMapLocationResult = {
    latitude: number | null;
    longitude: number | null;
    hasPermission: boolean;
    isLoading: boolean;
};

function toResult(location: MapLocation | null, hasPermission: boolean, isLoading: boolean): UseMapLocationResult {
    return {
        latitude: location?.latitude ?? null,
        longitude: location?.longitude ?? null,
        hasPermission,
        isLoading,
    };
}

export function useMapLocation(): UseMapLocationResult {
    const [location, setLocation] = React.useState<MapLocation | null>(null);
    const [hasPermission, setHasPermission] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        let isMounted = true;
        let stopWatching: () => void = () => undefined;

        async function startWatchingLocation() {
            try {
                const permissionGranted = await requestMapLocationPermission();

                if (!isMounted) {
                    return;
                }

                if (!permissionGranted) {
                    setHasPermission(false);
                    setIsLoading(false);
                    return;
                }

                setHasPermission(true);

                stopWatching = watchMapLocation(
                    nextLocation => {
                        if (!isMounted) {
                            return;
                        }

                        setLocation(nextLocation);
                        setIsLoading(false);
                    },
                    error => {
                        if (!isMounted) {
                            return;
                        }

                        console.error('Failed to watch current location.', error);
                        setIsLoading(false);
                    },
                );
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                console.error('Failed to initialize current location flow.', error);
                setHasPermission(false);
                setIsLoading(false);
            }
        }

        startWatchingLocation().catch(error => {
            if (!isMounted) {
                return;
            }

            console.error('Failed to start watching location.', error);
            setHasPermission(false);
            setIsLoading(false);
        });

        return () => {
            isMounted = false;
            stopWatching();
        };
    }, []);

    return toResult(location, hasPermission, isLoading);
}
