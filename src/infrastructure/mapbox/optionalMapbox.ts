export type MapboxRuntime = typeof import('@rnmapbox/maps');

export type OptionalMapboxRuntime = {
    isAvailable: boolean;
    mapbox: MapboxRuntime | null;
    error?: unknown;
};

let cachedRuntime: OptionalMapboxRuntime | null = null;

export function getOptionalMapboxRuntime(): OptionalMapboxRuntime {
    if (cachedRuntime) {
        return cachedRuntime;
    }

    try {
        const mapbox = require('@rnmapbox/maps') as MapboxRuntime;
        cachedRuntime = {isAvailable: true, mapbox};
    } catch (error) {
        cachedRuntime = {isAvailable: false, mapbox: null, error};
    }

    return cachedRuntime;
}
