import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import {navigationTabs} from '../config/navigationTabs';
import {useNavigation} from '../presentation/useNavigation';
import {useTheme} from '../theme';

function BottomNavigation() {
    const {theme} = useTheme();
    const {rootRoute, setRootRoute} = useNavigation();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <View pointerEvents="box-none" style={styles.wrapper}>
            <View style={styles.container}>
                {navigationTabs.map(item => {
                    const isActive = item.route.name === rootRoute.name;

                    return (
                        <Pressable
                            key={item.route.name}
                            accessibilityRole="button"
                            onPress={() => setRootRoute(item.route)}
                            style={styles.tab}>
                            <FontAwesome5
                                color={isActive ? theme.colors.navigationActive : theme.colors.navigationInactive}
                                iconStyle="solid"
                                name={item.icon}
                                size={18}
                            />
                            <Text style={[styles.label, isActive ? styles.activeLabel : styles.inactiveLabel]}>
                                {item.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
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
            paddingTop: 10,
            paddingBottom: 14,
        },
        tab: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            minHeight: 54,
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

