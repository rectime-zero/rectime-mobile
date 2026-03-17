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
import {resolveTheme} from '../../theme/themes';
import AccessoryButton from '../AccessoryButton';
import AppIcon from '../AppIcon';
import PressSurface from '../PressSurface';
import UserAvatar from '../UserAvatar';

const appIcon = require('../../assets/icons/app-icon.png');
const brandIconStyle: ImageStyle = {
    width: 30,
    height: 30,
    borderRadius: 6,
};

function SideMenu() {
    const {theme, resolvedMode, selectedThemeId} = useTheme();
    const {openMenuPageRoute, closeMenu, presentSheetRoute} = useNavigation();
    const {width: screenWidth} = useWindowDimensions();
    const topInset = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;
    const revealWidth = getMenuRevealWidth(screenWidth);
    const styles = React.useMemo(() => createStyles(theme, topInset, revealWidth), [theme, topInset, revealWidth]);
    const defaultPreviewTheme = React.useMemo(() => resolveTheme('default', resolvedMode), [resolvedMode]);
    const bluePreviewTheme = React.useMemo(() => resolveTheme('blue-2024', resolvedMode), [resolvedMode]);
    const activePreviewTheme = selectedThemeId === 'blue-2024' ? bluePreviewTheme : defaultPreviewTheme;

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
                        <PressSurface
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
                        </PressSurface>
                    ))}
                </View>

                <View style={styles.footerPanel}>
                    <AccessoryButton
                        accessibilityLabel="テーマを開く"
                        shape="pill"
                        onPress={() => presentSheetRoute(sheetRoutes.themePicker)}
                        style={styles.footerActions}
                        contentStyle={styles.footerActionsContent}>
                        <View style={styles.footerPreviewCluster}>
                            <AppIcon
                                color={theme.colors.textSecondary}
                                icon={{kind: 'font-awesome', name: resolvedMode === 'dark' ? 'moon' : 'sun'}}
                                size={17}
                            />
                        </View>

                        <View style={styles.footerPreviewCluster}>
                            <View
                                style={[
                                    styles.footerPreviewShell,
                                    {backgroundColor: activePreviewTheme.colors.surfaceMuted},
                                ]}>
                                <View
                                    style={[
                                        styles.footerPreviewFill,
                                        {backgroundColor: activePreviewTheme.colors.surfaceAccentStrong},
                                    ]}
                                />
                            </View>
                            <View
                                style={[
                                    styles.footerPreviewAccent,
                                    {
                                        backgroundColor: activePreviewTheme.colors.navigationActive,
                                        borderColor: activePreviewTheme.colors.surfacePrimary,
                                    },
                                ]}
                            />
                        </View>
                    </AccessoryButton>

                    <PressSurface
                        accessibilityLabel="メニューを閉じる"
                        chrome="none"
                        onPress={closeMenu}
                        style={styles.brandButton}
                        contentStyle={styles.brandButtonContent}>
                        <Image source={appIcon} style={brandIconStyle} resizeMode="cover" />
                        <Text style={styles.brandLabel}>rectime</Text>
                    </PressSurface>
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
            // backgroundColor: theme.colors.surfacePrimary,
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
        },
        footerPreviewFill: {
            width: 22,
            height: 22,
            borderRadius: 20,
        },
        footerPreviewAccent: {
            position: 'absolute',
            right: 4,
            bottom: 5,
            width: 12,
            height: 12,
            borderRadius: 6,
            borderWidth: 2,
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
