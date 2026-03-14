import React from 'react';
import {
    Image,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
    type ImageStyle,
} from 'react-native';
import {mockUserAvatarSource} from '../../assets/mock/avatar';
import {sheetRoutes} from '../../config/navigationRoutes';
import {sideMenuItems} from '../../config/sideMenuItems';
import {getMenuRevealWidth} from '../../navigation/menuLayout';
import {useNavigation} from '../../navigation/useNavigation';
import {useTheme} from '../../theme';
import AppIcon from '../AppIcon';
import SurfaceButton from '../SurfaceButton';
import UserAvatar from '../UserAvatar';

const appIcon = require('../../assets/icons/app-icon.png');
const brandIconStyle: ImageStyle = {
    width: 30,
    height: 30,
    borderRadius: 6,
};

function SideMenu() {
    const {theme, selectedThemeId} = useTheme();
    const {openMenuPageRoute, closeMenu, presentSheetRoute} = useNavigation();
    const {width: screenWidth} = useWindowDimensions();
    const topInset = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;
    const revealWidth = getMenuRevealWidth(screenWidth);
    const isBlueTheme = selectedThemeId === 'blue-2024';
    const styles = React.useMemo(() => createStyles(theme, topInset, revealWidth), [theme, topInset, revealWidth]);

    return (
        <View style={styles.container}>
            <View style={styles.contentArea}>
                <View style={styles.profileRow}>
                    <UserAvatar
                        initials="RK"
                        imageSource={mockUserAvatarSource}
                        size={56}
                        innerSize={48}
                        outerBackgroundColor={theme.colors.surfaceAccent}
                        innerBackgroundColor={theme.colors.surfacePrimary}
                        textColor={theme.colors.textPrimary}
                        textSize={16}
                    />
                    <View style={styles.profileTextBlock}>
                        <Text style={styles.profileName}>HAL 太郎</Text>
                        <Text style={styles.profileMeta}>IA12B / 16 / No. 12345</Text>
                    </View>
                </View>

                <View style={styles.tabList}>
                    {sideMenuItems.map(item => (
                        <SurfaceButton
                            key={`${item.kind}-${item.route.name}-${item.label}`}
                            accessibilityLabel={item.label}
                            chrome="none"
                            onPress={() => openMenuPageRoute(item.route)}
                            style={styles.tabButton}
                            contentStyle={styles.tabButtonContent}>
                            <AppIcon
                                color={theme.colors.textSecondary}
                                icon={item.icon}
                                size={18}
                            />
                            <Text style={[styles.tabLabel, styles.inactiveTabLabel]}>{item.label}</Text>
                        </SurfaceButton>
                    ))}
                </View>

                <View style={styles.footerPanel}>
                    <SurfaceButton
                        accessibilityLabel="button"
                        chrome="none"
                        onPress={() => presentSheetRoute(sheetRoutes.themePicker)}
                        style={styles.footerActions}
                        contentStyle={styles.footerActionsContent}>
                        <View style={styles.footerPreviewCluster}>
                            <AppIcon
                                color={theme.colors.textSecondary}
                                icon={{kind: 'font-awesome', name: 'moon'}}
                                size={17}
                            />
                        </View>

                        <View style={styles.footerPreviewCluster}>
                            <View style={styles.footerPreviewShell}>
                                <View
                                    style={[
                                        styles.footerPreviewFill,
                                        isBlueTheme ? styles.footerPreviewFillBlue : styles.footerPreviewFillDefault,
                                    ]}
                                />
                            </View>
                            <View
                                style={[
                                    styles.footerPreviewAccent,
                                    isBlueTheme ? styles.footerPreviewAccentBlue : styles.footerPreviewAccentDefault,
                                ]}
                            />
                        </View>
                    </SurfaceButton>

                    <SurfaceButton
                        accessibilityLabel="button"
                        chrome="none"
                        onPress={closeMenu}
                        style={styles.brandButton}
                        contentStyle={styles.brandButtonContent}>
                        <Image source={appIcon} style={brandIconStyle} resizeMode="cover" />
                        <Text style={styles.brandLabel}>rectime</Text>
                    </SurfaceButton>
                </View>
            </View>
        </View>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme'], topInset: number, revealWidth: number) {
    return StyleSheet.create({
        container: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: '100%',
            backgroundColor: theme.colors.menuBackground,
        },
        contentArea: {
            width: revealWidth,
            flex: 1,
            paddingTop: topInset + 18,
            paddingRight: 20,
            paddingBottom: 18,
            paddingLeft: 20,
        },
        profileRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        profileTextBlock: {
            flex: 1,
            gap: 4,
        },
        profileName: {
            color: theme.colors.textInverse,
            fontSize: 26,
            fontWeight: '800',
        },
        profileMeta: {
            color: theme.colors.textSecondary,
            fontSize: 14,
            fontWeight: '600',
        },
        tabList: {
            marginTop: 32,
            gap: 8,
        },
        tabButton: {
            alignSelf: 'flex-start',
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 16,
        },
        tabButtonContent: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
        },
        tabLabel: {
            flex: 1,
            fontSize: 17,
            fontWeight: '700',
        },
        inactiveTabLabel: {
            color: theme.colors.textSecondary,
        },
        footerPanel: {
            marginTop: 'auto',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        footerActions: {
            borderRadius: 999,
            paddingLeft: 6,
            paddingRight: 7,
            paddingVertical: 3,
            backgroundColor: '#FFFFFF',
        },
        footerActionsContent: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        footerPreviewCluster: {
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        footerPreviewShell: {
            width: 30,
            height: 30,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            backgroundColor: '#EEF2F7',
        },
        footerPreviewFill: {
            width: 22,
            height: 22,
            borderRadius: 20,
        },
        footerPreviewFillDefault: {
            backgroundColor: '#C9D1DC',
        },
        footerPreviewFillBlue: {
            backgroundColor: '#355CFF',
        },
        footerPreviewAccent: {
            position: 'absolute',
            right: 4,
            bottom: 5,
            width: 12,
            height: 12,
            borderRadius: 6,
            borderWidth: 2,
            borderColor: '#FFFFFF',
        },
        footerPreviewAccentDefault: {
            backgroundColor: '#8E9AAF',
        },
        footerPreviewAccentBlue: {
            backgroundColor: '#8DE1FF',
        },
        brandButton: {},
        brandButtonContent: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        brandLabel: {
            color: theme.colors.textSecondary,
            fontSize: 18,
            fontWeight: '800',
        },
    });
}

export default SideMenu;
