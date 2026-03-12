import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import {navigationTabs} from '../config/navigationTabs';
import {useStage} from '../stage/useStage';
import {useTheme} from '../theme';

function BottomNavigation() {
    const {theme} = useTheme();
    const {rootRoute, setRootScreen} = useStage();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <View pointerEvents="box-none" style={styles.wrapper}>
            <View style={styles.container}>
                {navigationTabs.map(item => {
                    const isActive = item.key === rootRoute.name;

                    return (
                        <Pressable
                            key={item.key}
                            accessibilityRole="button"
                            onPress={() => setRootScreen(item.key)}
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
            left: 16,
            right: 16,
            bottom: 14,
        },
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 26,
            borderWidth: 1,
            borderColor: theme.colors.navigationBorder,
            backgroundColor: theme.colors.navigationBackground,
            paddingHorizontal: 10,
            paddingVertical: 10,
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
