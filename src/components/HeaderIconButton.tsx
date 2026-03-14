import React from 'react';
import {StyleSheet, Text} from 'react-native';
import AppIcon from './AppIcon';
import {type AppIconName} from './iconNames';
import {useTheme} from '../theme';
import SurfaceButton from './SurfaceButton';

type HeaderIconButtonProps = {
    icon: AppIconName;
    onPress: () => void;
    label: string;
};

function HeaderIconButton({icon, onPress, label}: HeaderIconButtonProps) {
    const {theme} = useTheme();
    const styles = React.useMemo(() => createStyles(), []);

    return (
        <SurfaceButton accessibilityLabel={label} onPress={onPress}>
            <AppIcon color={theme.colors.headerActionForeground} icon={{kind: 'font-awesome', name: icon}} size={16} />
            <Text style={styles.label}>{label}</Text>
        </SurfaceButton>
    );
}

function createStyles() {
    return StyleSheet.create({
        label: {
            position: 'absolute',
            opacity: 0,
        },
    });
}

export default HeaderIconButton;
