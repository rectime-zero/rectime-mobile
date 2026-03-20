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
    isLocatingUser?: boolean;
    onLocateUser: () => void;
    userLocation?: MapLocation | null;
    unavailableTitle: string;
    unavailableBody: string;
};

export function FacilityMapView({
    facilities,
    initialCenter,
    initialZoomLevel = 16,
    isLocatingUser = false,
    onLocateUser,
    userLocation = null,
    unavailableTitle,
    unavailableBody,
}: FacilityMapViewProps) {
    const {theme} = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);
    const runtime = React.useMemo(() => getOptionalMapboxRuntime(), []);
    const cameraRef = React.useRef<{
        setCamera: (config: {
            centerCoordinate?: [number, number];
            zoomLevel?: number;
            animationDuration?: number;
            animationMode?: 'easeTo' | 'flyTo' | 'linearTo' | 'moveTo' | 'none';
        }) => void;
    } | null>(null);
    const [isFollowingUser, setIsFollowingUser] = React.useState(false);

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

    React.useEffect(() => {
        if (!userLocation || !isFollowingUser) {
            return;
        }

        cameraRef.current?.setCamera({
            centerCoordinate: [userLocation.longitude, userLocation.latitude],
            zoomLevel: initialZoomLevel,
            animationDuration: 600,
            animationMode: 'easeTo',
        });
    }, [initialZoomLevel, isFollowingUser, userLocation]);

    return (
        <View style={styles.container}>
            <Mapbox.MapView
                attributionEnabled={false}
                compassEnabled={false}
                logoEnabled={false}
                rotateEnabled={false}
                scaleBarEnabled={false}
                style={styles.map}
                styleURL={Mapbox.StyleURL.Street}>
                <Mapbox.Camera
                    ref={cameraRef}
                    animationDuration={600}
                    centerCoordinate={centerCoordinate}
                    zoomLevel={initialZoomLevel}
                />

                {facilities.map(facility => (
                    <Mapbox.PointAnnotation
                        key={facility.id}
                        coordinate={[facility.longitude, facility.latitude]}
                        id={facility.id}>
                        <View style={styles.facilityMarker} />
                    </Mapbox.PointAnnotation>
                ))}

                {userLocation ? (
                    <Mapbox.PointAnnotation
                        coordinate={[userLocation.longitude, userLocation.latitude]}
                        id="current-location">
                        <View style={styles.currentLocationMarker} />
                    </Mapbox.PointAnnotation>
                ) : null}
            </Mapbox.MapView>

            <MapLocationButton
                isLoading={isLocatingUser}
                label={userLocation ? '現在地へ戻る' : '現在地を取得'}
                onPress={() => {
                    setIsFollowingUser(true);
                    void onLocateUser();
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
        facilityMarker: {
            width: 12,
            height: 12,
            borderRadius: 999,
            backgroundColor: theme.colors.navigationActive,
            borderWidth: 2,
            borderColor: theme.colors.surfacePrimary,
        },
        currentLocationMarker: {
            width: 22,
            height: 22,
            borderRadius: 999,
            backgroundColor: 'rgba(46, 117, 255, 0.22)',
            borderWidth: 1,
            borderColor: 'rgba(46, 117, 255, 0.36)',
            shadowColor: theme.colors.navigationActive,
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 0.22,
            shadowRadius: 6,
            elevation: 4,
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
