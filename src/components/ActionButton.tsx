import React from 'react';
import {StyleSheet, Text} from 'react-native';
import SurfaceButton from './SurfaceButton';
import {useTheme} from '../theme';

type ActionButtonTone = 'primary' | 'secondary' | 'ghost';
type ActionButtonSize = 'regular' | 'compact';

type ActionButtonProps = {
    label: string;
    onPress: () => void;
    tone?: ActionButtonTone;
    size?: ActionButtonSize;
};

function ActionButton({
    label,
    onPress,
    tone = 'primary',
    size = 'regular',
}: ActionButtonProps) {
    const {theme} = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    const buttonSizeStyles = {
        regular: styles.regularButton,
        compact: styles.compactButton,
    };

    const buttonToneStyles = {
        primary: styles.primaryButton,
        secondary: styles.secondaryButton,
        ghost: styles.ghostButton,
    };

    const textToneStyles = {
        primary: styles.primaryText,
        secondary: styles.secondaryText,
        ghost: styles.ghostText,
    };

    return (
        <SurfaceButton
            accessibilityLabel={label}
            chrome="solid"
            onPress={onPress}
            size={size}
            style={[buttonSizeStyles[size], buttonToneStyles[tone]]}>
            <Text style={[styles.label, textToneStyles[tone]]}>{label}</Text>
        </SurfaceButton>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        regularButton: {
            backgroundColor: theme.colors.buttonPrimary,
        },
        compactButton: {},
        primaryButton: {
            backgroundColor: theme.colors.buttonPrimary,
        },
        secondaryButton: {
            backgroundColor: theme.colors.buttonSecondary,
            borderColor: theme.colors.buttonSecondaryBorder,
        },
        ghostButton: {
            backgroundColor: theme.colors.buttonGhost,
            borderColor: 'transparent',
        },
        label: {
            fontSize: 14,
            fontWeight: '700',
        },
        primaryText: {
            color: theme.colors.buttonPrimaryText,
        },
        secondaryText: {
            color: theme.colors.buttonSecondaryText,
        },
        ghostText: {
            color: theme.colors.buttonGhostText,
        },
    });
}

export default ActionButton;
