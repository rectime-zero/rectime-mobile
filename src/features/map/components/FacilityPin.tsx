import React from 'react';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import {StyleSheet, Text, View} from 'react-native';
import {useTheme} from '../../../theme';
import {type FacilityType} from '../types';

type FacilityPinProps = {
    type: FacilityType;
    name: string;
};

type FacilityPinIconName = 'restroom' | 'sign-in-alt' | 'sign-out-alt' | 'info-circle' | 'trash-alt' | 'users';

function resolvePinVisual(
    type: FacilityType,
    colors: ReturnType<typeof useTheme>['theme']['colors'],
): {
    icon: FacilityPinIconName;
    backgroundColor: string;
    color: string;
} {
    switch (type) {
        case 'toilet':
            return {icon: 'restroom', backgroundColor: colors.surfacePrimary, color: colors.textPrimary};
        case 'entrance':
            return {icon: 'sign-in-alt', backgroundColor: colors.navigationActive, color: colors.textOnAccent};
        case 'exit':
            return {icon: 'sign-out-alt', backgroundColor: colors.surfaceDanger, color: colors.textInverse};
        case 'info':
            return {icon: 'info-circle', backgroundColor: colors.surfaceAccent, color: colors.navigationActive};
        case 'trash':
            return {icon: 'trash-alt', backgroundColor: colors.surfaceMuted, color: colors.textPrimary};
        case 'waiting':
        default:
            return {icon: 'users', backgroundColor: colors.surfaceWarning, color: colors.textWarning};
    }
}

export function FacilityPin({type, name}: FacilityPinProps) {
    const {theme} = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);
    const visual = resolvePinVisual(type, theme.colors);

    return (
        <View collapsable={false} style={styles.container}>
            <View style={[styles.iconBubble, {backgroundColor: visual.backgroundColor}]}>
                <FontAwesome5 color={visual.color} iconStyle="solid" name={visual.icon} size={16} />
            </View>
            <Text numberOfLines={1} style={styles.nameLabel}>
                {name}
            </Text>
        </View>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        container: {
            alignItems: 'center',
            maxWidth: 86,
        },
        iconBubble: {
            minWidth: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
            shadowColor: theme.colors.navigationShadow,
            shadowOffset: {width: 0, height: 6},
            shadowOpacity: 0.16,
            shadowRadius: 12,
            elevation: 8,
        },
        nameLabel: {
            marginTop: 6,
            color: theme.colors.textPrimary,
            fontSize: 11,
            lineHeight: 14,
            fontWeight: '800',
            textAlign: 'center',
            backgroundColor: theme.colors.surfacePrimary,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 999,
            overflow: 'hidden',
        },
    });
}
