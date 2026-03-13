import React from 'react';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import {Platform, Pressable, StatusBar, Text, View} from 'react-native';
import {sideNavigationTabs} from '../config/sideNavigationTabs';
import {useStage} from './useStage';
import {useTheme} from '../theme';

function SideMenu() {
    const {theme} = useTheme();
    const {rootRoute, setRootScreen, closeMenu} = useStage();
    const topInset = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

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
                    <Text style={{color: theme.colors.textInverse, fontSize: 26, fontWeight: '800'}}>佐藤 健太</Text>
                    <Text style={{color: theme.colors.textSecondary, fontSize: 14, fontWeight: '600'}}>3-A / ID: 20240001</Text>
                </View>
            </View>

            <View className="mt-8 gap-2">
                {sideNavigationTabs.map(item => {
                    const isActive = item.key === rootRoute.name;

                    return (
                        <Pressable
                            key={item.key}
                            onPress={() => setRootScreen(item.key)}
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

            <View className="mt-auto gap-3 rounded-[28px] p-4" style={{backgroundColor: theme.colors.menuPanel}}>
                <Text style={{color: theme.colors.textInverse, fontSize: 16, fontWeight: '700'}}>ヘルプセンター</Text>
                <Text style={{color: theme.colors.textSecondary, fontSize: 14, lineHeight: 24}}>
                    下部タブとメニューはそのままに、各画面の見た目だけを切り替える構成です。
                </Text>
                <Text
                    onPress={closeMenu}
                    style={{color: theme.colors.textBrand, fontSize: 14, fontWeight: '700'}}>
                    メニューを閉じる
                </Text>
            </View>
        </View>
    );
}

export default SideMenu;
