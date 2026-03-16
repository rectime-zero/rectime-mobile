import React from 'react';
import {Platform, View} from 'react-native';
import type {ViewProps} from 'react-native';
import NativeLiquidGlassViewNativeComponent from '../specs/NativeLiquidGlassViewNativeComponent';

type LiquidGlassEffectStyle = 'regular' | 'clear';

type NativeLiquidGlassViewProps = ViewProps & {
    effectStyle?: LiquidGlassEffectStyle;
    interactive?: boolean;
};

const NATIVE_COMPONENT_NAME = 'RCTLiquidGlassView';

export function isNativeLiquidGlassAvailable() {
    return Platform.OS === 'ios' && getIosMajorVersion() >= 26;
}

function NativeLiquidGlassView({
    style,
    effectStyle = 'regular',
    interactive = false,
}: NativeLiquidGlassViewProps) {
    if (!isNativeLiquidGlassAvailable()) {
        return <View pointerEvents="none" style={style} />;
    }

    return (
        <NativeLiquidGlassViewNativeComponent
            effectStyle={effectStyle}
            interactive={interactive}
            pointerEvents="none"
            nativeID={NATIVE_COMPONENT_NAME}
            style={style}
        />
    );
}

function getIosMajorVersion() {
    if (Platform.OS !== 'ios') {
        return 0;
    }

    return typeof Platform.Version === 'string' ? Number.parseInt(Platform.Version, 10) : Platform.Version;
}

export default NativeLiquidGlassView;
