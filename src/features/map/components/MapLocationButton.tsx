import React from 'react';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import {Pressable, StyleSheet} from 'react-native';
import {useTheme} from '../../../theme';

type MapLocationButtonProps = {
    disabled?: boolean;
    onPress: () => void;
};

export function MapLocationButton({disabled = false, onPress}: MapLocationButtonProps) {
    const {theme} = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <Pressable
            disabled={disabled}
            onPress={onPress}
            style={({pressed}) => [
                styles.button,
                disabled ? styles.buttonDisabled : null,
                pressed && !disabled ? styles.buttonPressed : null,
            ]}>
            <FontAwesome5 color={theme.colors.textPrimary} iconStyle="solid" name="crosshairs" size={18} />
        </Pressable>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        button: {
            position: 'absolute',
            right: 16,
            bottom: 16,
            width: 48,
            height: 48,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 24,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
            shadowColor: theme.colors.navigationShadow,
            shadowOffset: {width: 0, height: 8},
            shadowOpacity: 0.18,
            shadowRadius: 16,
            elevation: 10,
        },
        buttonDisabled: {
            opacity: 0.42,
        },
        buttonPressed: {
            transform: [{scale: 0.96}],
        },
    });
}
