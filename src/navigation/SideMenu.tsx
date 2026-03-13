import React from 'react';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import {Image, Platform, Pressable, StatusBar, StyleSheet, Text, View} from 'react-native';
import {mockUserAvatarSource} from '../assets/mockUserAvatar';
import UserAvatar from '../components/UserAvatar';
import {sideNavigationTabs} from '../config/sideNavigationTabs';
import {pushRoutes} from '../config/navigationRoutes';
import {useTheme} from '../theme';
import {useNavigation} from './useNavigation';

const appIcon = require('../assets/icons/app-icon.png');

function SideMenu() {
    const {theme, selectedThemeId, setSelectedThemeId} = useTheme();
    const {rootRoute, setRootRoute, closeMenu, pushRoute} = useNavigation();
    const topInset = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;
    const isBlueTheme = selectedThemeId === 'blue-2024';
    const styles = React.useMemo(() => createStyles(theme, topInset), [theme, topInset]);

    return (
        <View style={styles.container}>
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
                    <Text style={styles.profileMeta}>IA12B / ID: 12345</Text>
                </View>
            </View>

            <View style={styles.tabList}>
                {sideNavigationTabs.map(item => {
                    const isActive = item.route.name === rootRoute.name;

                    return (
                        <Pressable
                            key={item.route.name}
                            onPress={() => setRootRoute(item.route)}
                            style={[styles.tabButton, isActive ? styles.activeTab : null]}>
                            <FontAwesome5
                                color={isActive ? theme.colors.navigationActive : theme.colors.textSecondary}
                                iconStyle="solid"
                                name={item.icon}
                                size={18}
                            />
                            <Text style={[styles.tabLabel, isActive ? styles.activeTabLabel : styles.inactiveTabLabel]}>
                                {item.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            <View style={styles.footerPanel}>
                <View style={styles.footerActions}>
                    <Pressable
                        accessibilityRole="button"
                        onPress={() => setSelectedThemeId(isBlueTheme ? 'default' : 'blue-2024')}
                        style={styles.footerButton}>
                        <FontAwesome5
                            color={theme.colors.navigationActive}
                            iconStyle="solid"
                            name="palette"
                            size={15}
                        />
                    </Pressable>

                    <Pressable
                        accessibilityRole="button"
                        onPress={() => pushRoute(pushRoutes.colorMode())}
                        style={styles.footerButton}>
                        <FontAwesome5
                            color={theme.colors.textSecondary}
                            iconStyle="solid"
                            name="moon"
                            size={15}
                        />
                    </Pressable>
                </View>

                <Pressable accessibilityRole="button" onPress={closeMenu} style={styles.brandButton}>
                    <Image source={appIcon} style={styles.brandIcon} resizeMode="cover" />
                    <Text style={styles.brandLabel}>rectime</Text>
                </Pressable>
            </View>
        </View>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme'], topInset: number) {
    return StyleSheet.create({
        container: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: '78%',
            paddingTop: topInset + 18,
            paddingBottom: 18,
            paddingHorizontal: 20,
            backgroundColor: theme.colors.menuBackground,
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
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 16,
        },
        activeTab: {
            backgroundColor: theme.colors.menuPanel,
        },
        tabLabel: {
            flex: 1,
            fontSize: 17,
            fontWeight: '700',
        },
        activeTabLabel: {
            color: theme.colors.textInverse,
        },
        inactiveTabLabel: {
            color: theme.colors.textSecondary,
        },
        footerPanel: {
            marginTop: 'auto',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 24,
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: theme.colors.menuPanel,
        },
        footerActions: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        footerButton: {
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 18,
            backgroundColor: theme.colors.surfacePrimary,
        },
        brandButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        brandIcon: {
            width: 24,
            height: 24,
            borderRadius: 6,
        },
        brandLabel: {
            color: theme.colors.textSecondary,
            fontSize: 15,
            fontWeight: '800',
        },
    });
}

export default SideMenu;
