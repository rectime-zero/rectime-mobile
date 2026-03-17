import React, {ReactNode} from 'react';
import {Platform, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import AppIcon from './AppIcon';
import {type AppIconName} from './iconNames';
import PressSurface from './PressSurface';
import {useTheme} from '../theme';

type AccessoryButtonSize = 'small' | 'medium' | 'large';
type AccessoryButtonTone = 'default' | 'accent';
type AccessoryButtonShape = 'circle' | 'pill';

type AccessoryButtonProps = {
    accessibilityLabel: string;
    onPress: () => void;
    icon?: AppIconName;
    children?: ReactNode;
    size?: AccessoryButtonSize;
    tone?: AccessoryButtonTone;
    shape?: AccessoryButtonShape;
    color?: string;
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
};

function AccessoryButton({
    accessibilityLabel,
    onPress,
    icon,
    children,
    size = 'medium',
    tone = 'default',
    shape = 'circle',
    color,
    style,
    contentStyle,
}: AccessoryButtonProps) {
    const {theme} = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);
    const chrome = Platform.OS === 'ios' ? 'glass' : 'solid';

    const sizeStyles =
        shape === 'pill'
            ? {
                small: styles.smallPillButton,
                medium: styles.mediumPillButton,
                large: styles.largePillButton,
            }
            : {
                small: styles.smallCircleButton,
                medium: styles.mediumCircleButton,
                large: styles.largeCircleButton,
            };

    const toneStyles = Platform.OS === 'ios'
        ? {
            default: styles.iosDefaultButton,
            accent: styles.iosAccentButton,
        }
        : {
            default: styles.androidDefaultButton,
            accent: styles.androidAccentButton,
        };

    const iconSizes = {
        small: 14,
        medium: 16,
        large: 18,
    };

    const iconColor = color ?? (tone === 'accent' ? theme.colors.navigationActive : theme.colors.headerActionForeground);
    const content = children ?? (icon ? <AppIcon color={iconColor} icon={{kind: 'font-awesome', name: icon}} size={iconSizes[size]} /> : null);

    return (
        <PressSurface
            accessibilityLabel={accessibilityLabel}
            chrome={chrome}
            onPress={onPress}
            style={[sizeStyles[size], toneStyles[tone], style]}
            contentStyle={contentStyle}>
            {content}
        </PressSurface>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        smallCircleButton: {
            width: 36,
            height: 36,
            borderRadius: 18,
        },
        mediumCircleButton: {
            width: 44,
            height: 44,
            borderRadius: 22,
        },
        largeCircleButton: {
            width: 52,
            height: 52,
            borderRadius: 26,
        },
        smallPillButton: {
            minHeight: 40,
            borderRadius: 20,
            paddingHorizontal: 8,
            paddingVertical: 4,
        },
        mediumPillButton: {
            minHeight: 44,
            borderRadius: 22,
            paddingHorizontal: 10,
            paddingVertical: 4,
        },
        largePillButton: {
            minHeight: 52,
            borderRadius: 26,
            paddingHorizontal: 12,
            paddingVertical: 6,
        },
        iosDefaultButton: {
            borderColor: 'transparent',
        },
        iosAccentButton: {
            borderColor: 'transparent',
        },
        androidDefaultButton: {
            backgroundColor: theme.colors.surfacePrimary,
            borderColor: theme.colors.borderSubtle,
        },
        androidAccentButton: {
            backgroundColor: theme.colors.surfaceAccent,
            borderColor: 'transparent',
        },
    });
}

export default AccessoryButton;
