import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
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
        <Pressable onPress={onPress} style={[styles.buttonBase, buttonSizeStyles[size], buttonToneStyles[tone]]}>
            <Text style={[styles.label, textToneStyles[tone]]}>{label}</Text>
        </Pressable>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        buttonBase: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        regularButton: {
            minHeight: 48,
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        compactButton: {
            minHeight: 40,
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 8,
        },
        primaryButton: {
            backgroundColor: theme.colors.buttonPrimary,
        },
        secondaryButton: {
            backgroundColor: theme.colors.buttonSecondary,
            borderWidth: 1,
            borderColor: theme.colors.buttonSecondaryBorder,
        },
        ghostButton: {
            backgroundColor: theme.colors.buttonGhost,
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
