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

const sizeClasses: Record<ActionButtonSize, string> = {
    regular: 'min-h-12 rounded-2xl px-4 py-3',
    compact: 'min-h-10 rounded-xl px-3 py-2',
};

function ActionButton({
    label,
    onPress,
    tone = 'primary',
    size = 'regular',
}: ActionButtonProps) {
    const {theme} = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

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
        <Pressable
            onPress={onPress}
            className={`items-center justify-center ${sizeClasses[size]}`}
            style={buttonToneStyles[tone]}>
            <Text style={[styles.label, textToneStyles[tone]]}>{label}</Text>
        </Pressable>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
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
