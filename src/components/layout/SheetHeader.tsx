import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AppIcon from '../AppIcon';
import SurfaceButton from '../SurfaceButton';
import {useTheme} from '../../theme';

type HeaderAction = 'none' | 'back' | 'close';

type SheetHeaderProps = {
    title: string;
    leftAction?: HeaderAction;
    rightAction?: HeaderAction;
    onLeftPress?: () => void;
    onRightPress?: () => void;
};

const ACTION_SIZE = 40;

function SheetHeader({
    title,
    leftAction = 'none',
    rightAction = 'none',
    onLeftPress,
    onRightPress,
}: SheetHeaderProps) {
    const {theme} = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <View style={styles.container}>
            <HeaderActionButton action={leftAction} iconColor={theme.colors.textPrimary} onPress={onLeftPress} styles={styles} />
            <Text numberOfLines={1} style={styles.title}>
                {title}
            </Text>
            <HeaderActionButton action={rightAction} iconColor={theme.colors.textPrimary} onPress={onRightPress} styles={styles} />
        </View>
    );
}

function HeaderActionButton({
    action,
    onPress,
    styles,
    iconColor,
}: {
    action: HeaderAction;
    onPress?: () => void;
    styles: ReturnType<typeof createStyles>;
    iconColor: string;
}) {
    if (action === 'none') {
        return <View style={styles.actionSpacer} />;
    }

    return (
        <SurfaceButton
            accessibilityLabel={action === 'back' ? '戻る' : '閉じる'}
            chrome="glass"
            onPress={onPress ?? (() => {})}
            style={styles.actionButton}>
            <AppIcon color={iconColor} icon={{kind: 'font-awesome', name: action === 'back' ? 'chevron-left' : 'times'}} size={14} />
        </SurfaceButton>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        title: {
            flex: 1,
            color: theme.colors.textPrimary,
            fontSize: 20,
            fontWeight: '800',
            textAlign: 'center',
        },
        actionButton: {
            width: ACTION_SIZE,
            height: ACTION_SIZE,
            borderRadius: ACTION_SIZE / 2,
            borderColor: 'transparent',
        },
        actionSpacer: {
            width: ACTION_SIZE,
            height: ACTION_SIZE,
        },
    });
}

export default SheetHeader;
