import React from 'react';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import RootScreenLayout from '../../components/layout/screen/RootScreenLayout';
import {FacilityMapView} from '../../features/map/components/FacilityMapView';
import {facilities, initialMapCenter, initialMapZoomLevel, mapCopy} from '../../features/map/data';
import {useMapLocation} from '../../features/map/hooks/useMapLocation';
import {useTheme} from '../../theme';

function MapScreen() {
    const {theme} = useTheme();
    const insets = useSafeAreaInsets();
    const {latitude, longitude, hasPermission, isLoading, requestCurrentLocation} = useMapLocation();
    const styles = React.useMemo(() => createStyles(theme, insets.top), [theme, insets.top]);
    const userLocation = latitude !== null && longitude !== null ? {latitude, longitude} : null;

    return (
        <RootScreenLayout
            contentInsets={{bottom: false, gap: false, horizontal: false}}
            headerMode="overlay"
            headerTitleVisible={false}
            includeBottomNavigationInset={false}
            scrollMode="fixed">
            <View style={styles.mapCard}>
                <View style={styles.mapViewport}>
                    <FacilityMapView
                        facilities={facilities}
                        initialCenter={initialMapCenter}
                        initialZoomLevel={initialMapZoomLevel}
                        isLocatingUser={isLoading}
                        onLocateUser={requestCurrentLocation}
                        unavailableBody={mapCopy.unavailableBody}
                        unavailableTitle={mapCopy.unavailableTitle}
                        userLocation={userLocation}
                    />

                    <View style={styles.topStatusRow}>
                        {isLoading ? (
                            <View style={styles.statusBadge}>
                                <ActivityIndicator color={theme.colors.navigationActive} size="small" />
                                <Text style={styles.statusText}>{mapCopy.currentLocationLoading}</Text>
                            </View>
                        ) : null}

                        {!hasPermission ? (
                            <View style={[styles.statusBadge, styles.permissionBadge]}>
                                <FontAwesome5 color={theme.colors.textWarning} iconStyle="solid" name="map-marker-alt" size={14} />
                                <Text style={styles.statusText}>{mapCopy.permissionRequired}</Text>
                            </View>
                        ) : null}
                    </View>
                </View>
            </View>

            {/* <View style={styles.placeCard}>
                <View style={styles.placeHandle} />
                <Text style={styles.placeTitle}>{mapCopy.placeTitle}</Text>
                <View style={styles.placeList}>
                    {facilities.map((facility, index) => (
                        <Pressable
                            key={facility.id}
                            style={[styles.placeRow, index < facilities.length - 1 ? styles.placeRowBorder : null]}>
                            <View style={styles.placeTextBlock}>
                                <Text style={styles.placeName}>{facility.name}</Text>
                                {facility.description ? <Text style={styles.placeDescription}>{facility.description}</Text> : null}
                            </View>
                            <FontAwesome5 color={theme.colors.textMuted} iconStyle="solid" name="chevron-right" size={12} />
                        </Pressable>
                    ))}
                </View>
            </View> */}
        </RootScreenLayout>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme'], topInset: number) {
    return StyleSheet.create({
        mapCard: {
            flex: 1,
        },
        mapViewport: {
            flex: 1,
        },
        topStatusRow: {
            position: 'absolute',
            top: topInset + 12,
            left: 14,
            right: 14,
            gap: 8,
            alignItems: 'flex-start',
        },
        statusBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            borderRadius: 999,
            paddingHorizontal: 12,
            paddingVertical: 8,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
        },
        permissionBadge: {
            backgroundColor: theme.colors.surfaceWarning,
        },
        statusText: {
            color: theme.colors.textPrimary,
            fontSize: 12,
            fontWeight: '700',
        },
    });
}

export default MapScreen;
