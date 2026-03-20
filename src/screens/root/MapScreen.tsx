import React from 'react';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import {ActivityIndicator, Pressable, StyleSheet, Text, View} from 'react-native';
import RootScreenLayout from '../../components/layout/screen/RootScreenLayout';
import {FacilityMapView} from '../../features/map/components/FacilityMapView';
import {facilities, initialMapCenter, initialMapZoomLevel, mapCopy} from '../../features/map/data';
import {useMapLocation} from '../../features/map/hooks/useMapLocation';
import {useTheme} from '../../theme';

function MapScreen() {
    const {theme} = useTheme();
    const {latitude, longitude, hasPermission, isLoading} = useMapLocation();
    const styles = React.useMemo(() => createStyles(theme), [theme]);
    const userLocation = latitude !== null && longitude !== null ? {latitude, longitude} : null;

    return (
        <RootScreenLayout>
            <View style={styles.mapCard}>
                <View style={styles.mapCopyBlock}>
                    <Text style={styles.placeholderTitle}>{mapCopy.title}</Text>
                    <Text style={styles.placeholderBody}>{mapCopy.body}</Text>
                </View>

                <View style={styles.mapViewport}>
                    <FacilityMapView
                        facilities={facilities}
                        initialCenter={initialMapCenter}
                        initialZoomLevel={initialMapZoomLevel}
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

            <View style={styles.placeCard}>
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
            </View>
        </RootScreenLayout>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        mapCard: {
            gap: 14,
        },
        mapCopyBlock: {
            gap: 8,
        },
        mapViewport: {
            height: 380,
            overflow: 'hidden',
            borderRadius: 28,
        },
        topStatusRow: {
            position: 'absolute',
            top: 14,
            left: 14,
            right: 14,
            gap: 8,
            alignItems: 'flex-start',
        },
        placeholderTitle: {
            color: theme.colors.textPrimary,
            fontSize: 24,
            fontWeight: '800',
        },
        placeholderBody: {
            marginTop: 8,
            maxWidth: 240,
            color: theme.colors.textSecondary,
            fontSize: 14,
            lineHeight: 22,
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
        placeCard: {
            gap: 12,
            borderRadius: 28,
            paddingHorizontal: 18,
            paddingTop: 10,
            paddingBottom: 8,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
        },
        placeHandle: {
            alignSelf: 'center',
            width: 52,
            height: 6,
            borderRadius: 3,
            backgroundColor: theme.colors.borderSubtle,
        },
        placeTitle: {
            color: theme.colors.textPrimary,
            fontSize: 18,
            fontWeight: '800',
        },
        placeList: {
            overflow: 'hidden',
            borderRadius: 20,
            backgroundColor: theme.colors.surfaceMuted,
        },
        placeRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            paddingHorizontal: 16,
            paddingVertical: 15,
        },
        placeTextBlock: {
            flex: 1,
            gap: 4,
        },
        placeRowBorder: {
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.borderSubtle,
        },
        placeName: {
            color: theme.colors.textPrimary,
            fontSize: 15,
            fontWeight: '700',
        },
        placeDescription: {
            color: theme.colors.textSecondary,
            fontSize: 12,
            lineHeight: 18,
        },
    });
}

export default MapScreen;
