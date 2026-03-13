import React from 'react';
import {Pressable, type ImageSourcePropType} from 'react-native';
import {mockUserAvatarSource} from '../assets/mockUserAvatar';
import {useTheme} from '../theme';
import UserAvatar from './UserAvatar';

type MenuAvatarButtonProps = {
    initials?: string;
    imageSource?: ImageSourcePropType;
    onPress: () => void;
};

function MenuAvatarButton({
    initials = 'RK',
    imageSource = mockUserAvatarSource,
    onPress,
}: MenuAvatarButtonProps) {
    const {theme} = useTheme();

    return (
        <Pressable accessibilityLabel="メニューを開く" accessibilityRole="button" onPress={onPress}>
            <UserAvatar
                initials={initials}
                imageSource={imageSource}
                size={44}
                innerSize={38}
                innerBackgroundColor={theme.colors.surfaceInverse}
                textColor={theme.colors.textInverse}
                textSize={13}
            />
        </Pressable>
    );
}

export default MenuAvatarButton;
