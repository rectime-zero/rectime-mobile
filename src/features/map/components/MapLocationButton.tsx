import React from 'react';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import {ActivityIndicator, Pressable, StyleSheet, Text} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../../theme';
import {bottomNavigationLayout, size, spacing} from '../../../tokens/layout';

type MapLocationButtonProps = {
    disabled?: boolean;
    isLoading?: boolean;
    label: string;
    onPress: () => void;
};

export function MapLocationButton({disabled = false, isLoading = false, label, onPress}: MapLocationButtonProps) {
    const {theme} = useTheme();
    const insets = useSafeAreaInsets();
    const styles = React.useMemo(() => createStyles(theme, Math.max(insets.bottom, bottomNavigationLayout.minBottomInset)), [theme, insets.bottom]);

    return (
        <Pressable
            disabled={disabled || isLoading}
            onPress={onPress}
            style={({pressed}) => [
                styles.button,
                (disabled || isLoading) ? styles.buttonDisabled : null,
                pressed && !disabled && !isLoading ? styles.buttonPressed : null,
            ]}>
            {isLoading ? (
                <ActivityIndicator color={theme.colors.navigationActive} size="small" />
            ) : (
                <FontAwesome5 color={theme.colors.navigationActive} iconStyle="solid" name="crosshairs" size={16} />
            )}
            <Text style={styles.label}>{label}</Text>
        </Pressable>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme'], bottomInset: number) {
    return StyleSheet.create({
        button: {
            position: 'absolute',
            left: 16,
            bottom: bottomInset + size.bottomTabMinHeight + bottomNavigationLayout.paddingTop + spacing.lg,
            height: 48,
            paddingHorizontal: 16,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 10,
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
        label: {
            color: theme.colors.textPrimary,
            fontSize: 13,
            fontWeight: '700',
        },
    });
}
