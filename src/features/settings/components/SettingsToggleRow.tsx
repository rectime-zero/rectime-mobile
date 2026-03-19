import React from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';
import AppIcon from '../../../components/icon/AppIcon';
import {type AppIconName} from '../../../components/icon/iconNames';
import {useTheme} from '../../../theme';

type SettingsToggleRowProps = {
    icon: AppIconName;
    title: string;
    description: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    accent?: boolean;
    isLast?: boolean;
};

function SettingsToggleRow({
    icon,
    title,
    description,
    value,
    onValueChange,
    accent = false,
    isLast = false,
}: SettingsToggleRowProps) {
    const {theme} = useTheme();
    const styles = React.useMemo(() => createStyles(), []);

    return (
        <View>
            <View style={styles.row}>
                <View style={[styles.iconBox, accent ? styles.iconBoxAccent : styles.iconBoxDefault]}>
                    <AppIcon
                        icon={{kind: 'font-awesome', name: icon, iconStyle: 'solid'}}
                        size={16}
                        color={accent ? 'rgba(255, 200, 0, 0.9)' : 'rgba(255, 255, 255, 0.6)'}
                    />
                </View>
                <View style={styles.copy}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>
                </View>
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{
                        false: theme.colors.surfaceMuted,
                        true: theme.colors.buttonPrimary,
                    }}
                    thumbColor={theme.colors.buttonPrimaryText}
                />
            </View>
            {!isLast ? <View style={styles.insetDivider} /> : null}
        </View>
    );
}

function createStyles() {
    return StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            paddingHorizontal: 14,
            paddingVertical: 12,
        },
        insetDivider: {
            height: 1,
            marginLeft: 56,
            marginRight: 14,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
        },
        iconBox: {
            width: 30,
            height: 30,
            borderRadius: 6,
            alignItems: 'center',
            justifyContent: 'center',
        },
        iconBoxDefault: {
            backgroundColor: 'rgba(255, 255, 255, 0.10)',
        },
        iconBoxAccent: {
            backgroundColor: 'rgba(255, 200, 0, 0.3)',
        },
        copy: {
            flex: 1,
        },
        title: {
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: 14,
            fontWeight: '500',
        },
        description: {
            marginTop: 4,
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: 12,
            lineHeight: 18,
        },
    });
}

export default SettingsToggleRow;
