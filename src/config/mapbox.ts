import Config from 'react-native-config';
import {getOptionalMapboxRuntime} from '../infrastructure/mapbox/optionalMapbox';

let isMapboxInitialized = false;

export function getMapboxAccessToken() {
    return Config.MAPBOX_ACCESS_TOKEN?.trim() ?? '';
}

export function initializeMapbox() {
    if (isMapboxInitialized) {
        return;
    }

    const accessToken = getMapboxAccessToken();

    if (!accessToken) {
        return;
    }

    const runtime = getOptionalMapboxRuntime();

    if (!runtime.isAvailable || !runtime.mapbox) {
        return;
    }

    isMapboxInitialized = true;
    runtime.mapbox.setTelemetryEnabled(false);

    runtime.mapbox.setAccessToken(accessToken).catch(error => {
        console.error('Failed to initialize Mapbox access token.', error);
        isMapboxInitialized = false;
    });
}
