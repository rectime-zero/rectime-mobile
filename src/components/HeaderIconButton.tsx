import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import {type AppIconName} from './iconNames';
import {useTheme} from '../theme';

type HeaderIconButtonProps = {
    icon: AppIconName;
    onPress: () => void;
    label: string;
};

function HeaderIconButton({icon, onPress, label}: HeaderIconButtonProps) {
    const {theme} = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <Pressable
            accessibilityLabel={label}
            accessibilityRole="button"
            onPress={onPress}
            style={styles.button}>
            <FontAwesome5
                color={theme.colors.headerActionForeground}
                iconStyle="solid"
                name={icon}
                size={16}
            />
            <Text style={styles.label}>{label}</Text>
        </Pressable>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        button: {
            width: 44,
            height: 44,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.headerActionBackground,
        },
        label: {
            position: 'absolute',
            opacity: 0,
        },
    });
}

export default HeaderIconButton;
