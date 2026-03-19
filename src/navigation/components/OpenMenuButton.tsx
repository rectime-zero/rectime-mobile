import React from 'react';
import {type ImageSourcePropType} from 'react-native';
import {mockUserAvatarSource} from '../../assets/mock/avatar';
import {useTheme} from '../../theme';
import UserAvatar from '../../components/avatar/UserAvatar';
import PressSurface from '../../components/surface/PressSurface';
import {useNavigation} from '../useNavigation';

type OpenMenuButtonProps = {
    initials?: string;
    imageSource?: ImageSourcePropType;
};

function OpenMenuButton({
    initials = 'RK',
    imageSource = mockUserAvatarSource,
}: OpenMenuButtonProps) {
    const {theme} = useTheme();
    const {openMenu} = useNavigation();

    return (
        <PressSurface accessibilityLabel="メニューを開く" chrome="none" onPress={openMenu}>
            <UserAvatar
                initials={initials}
                imageSource={imageSource}
                size={44}
                innerSize={38}
                innerBackgroundColor={theme.colors.surfaceInverse}
                textColor={theme.colors.textInverse}
                textSize={13}
            />
        </PressSurface>
    );
}

export default OpenMenuButton;
