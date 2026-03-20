import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {getMapboxAccessToken} from '../../../config/mapbox';
import {getOptionalMapboxRuntime} from '../../../infrastructure/mapbox/optionalMapbox';
import {useTheme} from '../../../theme';
import {MapLocationButton} from './MapLocationButton';
import {type Facility, type MapLocation} from '../types';

type FacilityMapViewProps = {
    facilities: Facility[];
    initialCenter: [number, number];
    initialZoomLevel?: number;
    userLocation?: MapLocation | null;
    unavailableTitle: string;
    unavailableBody: string;
};

export function FacilityMapView({
    facilities,
    initialCenter,
    initialZoomLevel = 16,
    userLocation = null,
    unavailableTitle,
    unavailableBody,
}: FacilityMapViewProps) {
    const {theme} = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);
    const runtime = React.useMemo(() => getOptionalMapboxRuntime(), []);
    const [cameraRevision, setCameraRevision] = React.useState(0);

    if (!runtime.isAvailable || !runtime.mapbox || !getMapboxAccessToken()) {
        return (
            <View style={styles.unavailableState}>
                <Text style={styles.unavailableTitle}>{unavailableTitle}</Text>
                <Text style={styles.unavailableBody}>{unavailableBody}</Text>
            </View>
        );
    }

    const Mapbox = runtime.mapbox;
    const centerCoordinate = userLocation
        ? [userLocation.longitude, userLocation.latitude] as [number, number]
        : initialCenter;

    return (
        <View style={styles.container}>
            <Mapbox.MapView
                attributionEnabled={false}
                compassEnabled
                logoEnabled={false}
                rotateEnabled={false}
                scaleBarEnabled={false}
                style={styles.map}
                styleURL={Mapbox.StyleURL.Street}>
                <Mapbox.Camera
                    key={`${centerCoordinate[0]}-${centerCoordinate[1]}-${cameraRevision}`}
                    animationDuration={600}
                    centerCoordinate={centerCoordinate}
                    zoomLevel={initialZoomLevel}
                />

                {facilities.map(facility => (
                    <Mapbox.PointAnnotation
                        key={facility.id}
                        coordinate={[facility.longitude, facility.latitude]}
                        id={facility.id}
                    />
                ))}

                {userLocation ? (
                    <Mapbox.PointAnnotation
                        coordinate={[userLocation.longitude, userLocation.latitude]}
                        id="current-location"
                    />
                ) : null}
            </Mapbox.MapView>

            <MapLocationButton
                disabled={!userLocation}
                onPress={() => {
                    if (!userLocation) {
                        return;
                    }

                    setCameraRevision(current => current + 1);
                }}
            />
        </View>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        container: {
            flex: 1,
            overflow: 'hidden',
            borderRadius: 28,
            backgroundColor: theme.colors.surfaceMuted,
        },
        map: {
            flex: 1,
        },
        unavailableState: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 24,
            backgroundColor: theme.colors.surfaceMuted,
            borderRadius: 28,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
        },
        unavailableTitle: {
            color: theme.colors.textPrimary,
            fontSize: 20,
            fontWeight: '800',
            textAlign: 'center',
        },
        unavailableBody: {
            marginTop: 8,
            color: theme.colors.textSecondary,
            fontSize: 14,
            lineHeight: 22,
            textAlign: 'center',
        },
    });
}
