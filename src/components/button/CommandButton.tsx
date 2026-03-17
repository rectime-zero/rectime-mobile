import React from 'react';
import {StyleSheet, Text} from 'react-native';
import PressSurface from '../surface/PressSurface';
import {useTheme} from '../../theme';

type CommandButtonTone = 'primary' | 'secondary' | 'ghost';
type CommandButtonSize = 'regular' | 'compact';

type CommandButtonProps = {
    label: string;
    onPress: () => void;
    tone?: CommandButtonTone;
    size?: CommandButtonSize;
};

function CommandButton({
    label,
    onPress,
    tone = 'primary',
    size = 'regular',
}: CommandButtonProps) {
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
        <PressSurface
            accessibilityLabel={label}
            chrome="solid"
            onPress={onPress}
            size={size}
            style={[buttonSizeStyles[size], buttonToneStyles[tone]]}>
            <Text style={[styles.label, textToneStyles[tone]]}>{label}</Text>
        </PressSurface>
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

export default CommandButton;
