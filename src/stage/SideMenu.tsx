import React from 'react';
import {Platform, StatusBar, Text, View} from 'react-native';
import ActionButton from '../components/ActionButton';
import {navigationTabs} from '../config/navigationTabs';
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
            <View className="gap-2">
                <Text style={{color: theme.colors.textBrand, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2}}>
                    Rectime Zero
                </Text>
                <Text style={{color: theme.colors.textInverse, fontSize: 30, fontWeight: '800'}}>Stage Menu</Text>
                <Text style={{color: theme.colors.textSecondary, fontSize: 14, lineHeight: 24}}>
                    背面メニューは常時ここにあり、前景カードだけがスライドして見える構成です。
                </Text>
            </View>

            <View className="mt-8 gap-3">
                {navigationTabs.map(item => {
                    const isActive = item.key === rootRoute.name;

                    return (
                        <ActionButton
                            key={item.key}
                            label={item.label}
                            onPress={() => setRootScreen(item.key)}
                            tone={isActive ? 'primary' : 'ghost'}
                        />
                    );
                })}
            </View>

            <View className="mt-auto gap-3 rounded-[28px] p-4" style={{backgroundColor: theme.colors.menuPanel}}>
                <Text style={{color: theme.colors.textInverse, fontSize: 16, fontWeight: '700'}}>Today&apos;s note</Text>
                <Text style={{color: theme.colors.textSecondary, fontSize: 14, lineHeight: 24}}>
                    右から被さるページと下から上がる sheet は、すべて同じ Stage 管理下で動きます。
                </Text>
                <ActionButton label="メニューを閉じる" onPress={closeMenu} tone="secondary" />
            </View>
        </View>
    );
}

export default SideMenu;
