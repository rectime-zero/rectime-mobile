import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AppIcon from '../../icon/AppIcon';
import PressSurface from '../../surface/PressSurface';
import {navigationTabs} from '../../../config/navigationTabs';
import {useNavigation} from '../../../navigation/useNavigation';
import {useTheme} from '../../../theme';

function BottomNavigation() {
    const {theme} = useTheme();
    const insets = useSafeAreaInsets();
    const {rootRoute, setRootRoute} = useNavigation();
    const styles = React.useMemo(() => createStyles(theme, Math.max(insets.bottom, 14)), [insets.bottom, theme]);

    return (
        <View pointerEvents="box-none" style={styles.wrapper}>
            <View style={styles.container}>
                {navigationTabs.map(item => {
                    const isActive = item.route.name === rootRoute.name;

                    return (
                        <PressSurface
                            key={item.route.name}
                            accessibilityLabel={item.label}
                            chrome="none"
                            onPress={() => setRootRoute(item.route)}
                            style={styles.tab}
                            contentStyle={styles.tabContent}>
                            <AppIcon
                                color={isActive ? theme.colors.navigationActive : theme.colors.navigationInactive}
                                icon={item.icon}
                                size={18}
                            />
                            <Text style={[styles.label, isActive ? styles.activeLabel : styles.inactiveLabel]}>
                                {item.label}
                            </Text>
                        </PressSurface>
                    );
                })}
            </View>
        </View>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme'], bottomInset: number) {
    return StyleSheet.create({
        wrapper: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
        },
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTopWidth: 1,
            borderTopColor: theme.colors.navigationBorder,
            backgroundColor: theme.colors.navigationBackground,
            paddingHorizontal: 10,
            paddingTop: 3,
            paddingBottom: bottomInset,
        },
        tab: {
            flex: 1,
            minHeight: 54,
        },
        tabContent: {
            gap: 6,
        },
        label: {
            fontSize: 11,
            fontWeight: '700',
        },
        activeLabel: {
            color: theme.colors.navigationActive,
        },
        inactiveLabel: {
            color: theme.colors.navigationInactive,
        },
    });
}

export default BottomNavigation;
