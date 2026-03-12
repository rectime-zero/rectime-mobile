import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import HeaderIconButton from '../components/HeaderIconButton';
import MenuAvatarButton from '../components/MenuAvatarButton';
import PageLayout from '../components/PageLayout';
import {useStage} from '../stage/useStage';
import {useTheme} from '../theme';

const places = ['センターコート', '受付', 'フードエリア', '休憩ゾーン'];

function MapScreen() {
    const {theme} = useTheme();
    const {openMenu, presentSheet} = useStage();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <PageLayout
            headerLeading={<MenuAvatarButton onPress={openMenu} />}
            headerTrailing={<HeaderIconButton icon="bell" label="通知" onPress={() => presentSheet('sample-sheet', undefined)} />}
            title="マップ">
            <View style={styles.mapPlaceholder}>
                <View style={styles.blurLayer} />
                <Text style={styles.placeholderTitle}>マップは後続実装</Text>
                <Text style={styles.placeholderBody}>この画面では地図本体はまだ描かず、操作ボタンと場所一覧だけを配置しています。</Text>

                <View style={styles.floatingLeft}>
                    <FontAwesome5 color={theme.colors.textOnAccent} iconStyle="solid" name="bullseye" size={18} />
                </View>
                <View style={styles.floatingRight}>
                    <FontAwesome5 color={theme.colors.textPrimary} iconStyle="solid" name="list-ul" size={18} />
                </View>
            </View>

            <View style={styles.placeCard}>
                <View style={styles.placeHandle} />
                <Text style={styles.placeTitle}>場所一覧</Text>
                <View style={styles.placeList}>
                    {places.map(place => (
                        <Pressable key={place} style={styles.placeRow}>
                            <Text style={styles.placeName}>{place}</Text>
                            <FontAwesome5 color={theme.colors.textMuted} iconStyle="solid" name="chevron-right" size={12} />
                        </Pressable>
                    ))}
                </View>
            </View>
        </PageLayout>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        mapPlaceholder: {
            height: 360,
            borderRadius: 28,
            overflow: 'hidden',
            justifyContent: 'flex-end',
            padding: 20,
            backgroundColor: theme.colors.surfaceMuted,
        },
        blurLayer: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: theme.colors.surfaceAccent,
            opacity: 0.78,
        },
        placeholderTitle: {
            color: theme.colors.textPrimary,
            fontSize: 24,
            fontWeight: '800',
        },
        placeholderBody: {
            marginTop: 8,
            maxWidth: 240,
            color: theme.colors.textSecondary,
            fontSize: 14,
            lineHeight: 22,
        },
        floatingLeft: {
            position: 'absolute',
            left: 18,
            bottom: 22,
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.navigationActive,
        },
        floatingRight: {
            position: 'absolute',
            right: 18,
            bottom: 22,
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.surfacePrimary,
        },
        placeCard: {
            marginTop: -78,
            borderRadius: 28,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
            paddingHorizontal: 18,
            paddingTop: 10,
            paddingBottom: 8,
            gap: 12,
        },
        placeHandle: {
            alignSelf: 'center',
            width: 52,
            height: 6,
            borderRadius: 3,
            backgroundColor: theme.colors.borderSubtle,
        },
        placeTitle: {
            color: theme.colors.textPrimary,
            fontSize: 18,
            fontWeight: '800',
        },
        placeList: {
            borderRadius: 20,
            overflow: 'hidden',
            backgroundColor: theme.colors.surfaceMuted,
        },
        placeRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.borderSubtle,
        },
        placeName: {
            color: theme.colors.textPrimary,
            fontSize: 15,
            fontWeight: '700',
        },
    });
}

export default MapScreen;
