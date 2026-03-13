import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '../theme';

type MenuAvatarButtonProps = {
    initials?: string;
    onPress: () => void;
};

function MenuAvatarButton({initials = 'RK', onPress}: MenuAvatarButtonProps) {
    const {theme} = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <Pressable accessibilityLabel="メニューを開く" accessibilityRole="button" onPress={onPress}>
            <View style={styles.outer}>
                <View style={styles.inner}>
                    <Text style={styles.initials}>{initials}</Text>
                </View>
            </View>
        </Pressable>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        outer: {
            width: 44,
            height: 44,
            borderRadius: 22,
            alignItems: 'center',
            justifyContent: 'center',
        },
        inner: {
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: theme.colors.surfaceInverse,
            alignItems: 'center',
            justifyContent: 'center',
        },
        initials: {
            color: theme.colors.textInverse,
            fontSize: 13,
            fontWeight: '800',
        },
    });
}

export default MenuAvatarButton;
