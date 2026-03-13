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

    React.useEffect(() => {
        setHasImageError(false);
    }, [imageSource]);

    return (
        <View
            style={[
                styles.outer,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: outerBackgroundColor,
                },
                style,
            ]}>
            <View
                style={[
                styles.inner,
                    {
                        width: innerSize,
                        height: innerSize,
                        borderRadius: innerSize / 2,
                        backgroundColor: innerBackgroundColor,
                    },
                ]}>
                {shouldShowImage ? (
                    <Image
                        source={imageSource}
                        style={{
                            width: innerSize,
                            height: innerSize,
                            borderRadius: innerSize / 2,
                        }}
                        resizeMode="cover"
                        onError={() => setHasImageError(true)}
                    />
                ) : (
                    <Text style={[styles.initials, {color: textColor, fontSize: textSize}]}>{initials}</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    inner: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    initials: {
        fontWeight: '800',
    },
});

export default UserAvatar;
