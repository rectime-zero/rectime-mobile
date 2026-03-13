import React from 'react';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import {Image, Platform, Pressable, StatusBar, Text, View} from 'react-native';
import {sideNavigationTabs} from '../config/sideNavigationTabs';
import {pushRoutes} from '../config/navigationRoutes';
import {useNavigation} from './useNavigation';
import {useTheme} from '../theme';

const appIcon = require('../assets/icons/app-icon.png');

function SideMenu() {
    const {theme, selectedThemeId, setSelectedThemeId} = useTheme();
    const {rootRoute, setRootRoute, closeMenu, pushRoute} = useNavigation();
    const topInset = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;
    const isBlueTheme = selectedThemeId === 'blue-2024';

    return (
        <View
            className="absolute inset-y-0 left-0 w-[78%] px-5"
            style={{
                backgroundColor: theme.colors.menuBackground,
                paddingTop: topInset + 18,
                paddingBottom: 18,
            }}>
            <View className="flex-row items-center gap-3">
                <View
                    className="h-14 w-14 items-center justify-center rounded-full"
                    style={{backgroundColor: theme.colors.surfaceAccent}}>
                    <View
                        className="h-12 w-12 items-center justify-center rounded-full"
                        style={{backgroundColor: theme.colors.surfacePrimary}}>
                        <Text style={{color: theme.colors.textPrimary, fontSize: 16, fontWeight: '800'}}>RK</Text>
                    </View>
                </View>
                <View className="flex-1 gap-1">
                    <Text style={{color: theme.colors.textInverse, fontSize: 26, fontWeight: '800'}}>菴占陸 蛛･螟ｪ</Text>
                    <Text style={{color: theme.colors.textSecondary, fontSize: 14, fontWeight: '600'}}>3-A / ID: 20240001</Text>
                </View>
            </View>

            <View className="mt-8 gap-2">
                {sideNavigationTabs.map(item => {
                    const isActive = item.route.name === rootRoute.name;

                    return (
                        <Pressable
                            key={item.route.name}
                            onPress={() => setRootRoute(item.route)}
                            className="flex-row items-center gap-4 rounded-2xl px-4 py-4"
                            style={{
                                backgroundColor: isActive ? theme.colors.menuPanel : 'transparent',
                            }}>
                            <FontAwesome5
                                color={isActive ? theme.colors.navigationActive : theme.colors.textSecondary}
                                iconStyle="solid"
                                name={item.icon}
                                size={18}
                            />
                            <Text
                                style={{
                                    flex: 1,
                                    color: isActive ? theme.colors.textInverse : theme.colors.textSecondary,
                                    fontSize: 17,
                                    fontWeight: '700',
                                }}>
                                {item.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            <View
                className="mt-auto flex-row items-center justify-between rounded-[24px] px-4 py-3"
                style={{backgroundColor: theme.colors.menuPanel}}>
                <View className="flex-row items-center gap-2">
                    <Pressable
                        accessibilityRole="button"
                        onPress={() => setSelectedThemeId(isBlueTheme ? 'default' : 'blue-2024')}
                        className="h-11 w-11 items-center justify-center rounded-[18px]"
                        style={{backgroundColor: theme.colors.surfacePrimary}}>
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
                        className="h-11 w-11 items-center justify-center rounded-[18px]"
                        style={{backgroundColor: theme.colors.surfacePrimary}}>
                        <FontAwesome5
                            color={theme.colors.textSecondary}
                            iconStyle="solid"
                            name="moon"
                            size={15}
                        />
                    </Pressable>
                </View>

                <Pressable
                    accessibilityRole="button"
                    onPress={closeMenu}
                    className="flex-row items-center gap-2">
                    <Image source={appIcon} className="h-6 w-6 rounded-[6px]" resizeMode="cover" />
                    <Text
                        style={{
                            color: theme.colors.textSecondary,
                            fontSize: 15,
                            fontWeight: '800',
                        }}>
                        rectime
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

export default SideMenu;

