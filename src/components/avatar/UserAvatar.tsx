import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
    type ImageSourcePropType,
    type StyleProp,
    type ViewStyle,
} from 'react-native';

type UserAvatarProps = {
    initials?: string;
    imageSource?: ImageSourcePropType;
    size?: number;
    innerSize?: number;
    outerBackgroundColor?: string;
    innerBackgroundColor: string;
    textColor: string;
    textSize?: number;
    style?: StyleProp<ViewStyle>;
};

function UserAvatar({
    initials = 'RK',
    imageSource,
    size = 44,
    innerSize = 38,
    outerBackgroundColor = 'transparent',
    innerBackgroundColor,
    textColor,
    textSize = 13,
    style,
}: UserAvatarProps) {
    const [hasImageError, setHasImageError] = React.useState(false);
    const shouldShowImage = Boolean(imageSource) && !hasImageError;
    const styles = React.useMemo(
        () =>
            createStyles({
                size,
                innerSize,
                outerBackgroundColor,
                innerBackgroundColor,
                textColor,
                textSize,
            }),
        [innerBackgroundColor, innerSize, outerBackgroundColor, size, textColor, textSize],
    );

    React.useEffect(() => {
        setHasImageError(false);
    }, [imageSource]);

    return (
        <View style={[styles.outer, style]}>
            <View style={styles.inner}>
                {shouldShowImage ? (
                    <Image
                        source={imageSource}
                        style={styles.image}
                        resizeMode="cover"
                        onError={() => setHasImageError(true)}
                    />
                ) : (
                    <Text style={styles.initials}>{initials}</Text>
                )}
            </View>
        </View>
    );
}

function createStyles({
    size,
    innerSize,
    outerBackgroundColor,
    innerBackgroundColor,
    textColor,
    textSize,
}: {
    size: number;
    innerSize: number;
    outerBackgroundColor: string;
    innerBackgroundColor: string;
    textColor: string;
    textSize: number;
}) {
    return StyleSheet.create({
        outer: {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: outerBackgroundColor,
            alignItems: 'center',
            justifyContent: 'center',
        },
        inner: {
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            backgroundColor: innerBackgroundColor,
            alignItems: 'center',
            justifyContent: 'center',
        },
        image: {
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
        },
        initials: {
            color: textColor,
            fontSize: textSize,
            fontWeight: '800',
        },
    });
}

export default UserAvatar;
