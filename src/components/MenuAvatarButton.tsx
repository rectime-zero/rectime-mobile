import React from 'react';
import {type ImageSourcePropType} from 'react-native';
import {mockUserAvatarSource} from '../assets/mock/avatar';
import {useTheme} from '../theme';
import SurfaceButton from './SurfaceButton';
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
        <SurfaceButton accessibilityLabel="メニューを開く" chrome="none" onPress={onPress}>
            <UserAvatar
                initials={initials}
                imageSource={imageSource}
                size={44}
                innerSize={38}
                innerBackgroundColor={theme.colors.surfaceInverse}
                textColor={theme.colors.textInverse}
                textSize={13}
            />
        </SurfaceButton>
    );
}

export default MenuAvatarButton;
