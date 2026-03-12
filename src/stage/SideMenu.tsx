import React from 'react';
import {Platform, StatusBar, Text, View} from 'react-native';
import ActionButton from '../components/ActionButton';
import {navigationTabs} from '../config/navigationTabs';
import {useStage} from './useStage';

function SideMenu() {
    const {rootRoute, setRootScreen, closeMenu} = useStage();
    const topInset = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

    return (
        <View
            className="absolute inset-y-0 left-0 w-[78%] bg-slate-950 px-5"
            style={{paddingTop: topInset + 18, paddingBottom: 18}}>
            <View className="gap-2">
                <Text className="text-xs font-bold uppercase tracking-[1.2px] text-blue-300">
                    Rectime Zero
                </Text>
                <Text className="text-3xl font-extrabold text-white">Stage Menu</Text>
                <Text className="text-sm leading-6 text-slate-300">
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

            <View className="mt-auto gap-3 rounded-[28px] bg-slate-900/80 p-4">
                <Text className="text-base font-bold text-white">Today&apos;s note</Text>
                <Text className="text-sm leading-6 text-slate-300">
                    右から被さるページと下から上がる sheet は、すべて同じ Stage 管理下で動きます。
                </Text>
                <ActionButton label="メニューを閉じる" onPress={closeMenu} tone="secondary" />
            </View>
        </View>
    );
}

export default SideMenu;
