import React from 'react';
import {Platform, View} from 'react-native';
import type {ViewProps} from 'react-native';
import {
  LiquidGlassView,
  isLiquidGlassSupported,
} from '@callstack/liquid-glass';

type LiquidGlassEffectStyle = 'regular' | 'clear';

type NativeLiquidGlassViewProps = ViewProps & {
  effectStyle?: LiquidGlassEffectStyle;
  interactive?: boolean;
};

export function isNativeLiquidGlassAvailable() {
  return Platform.OS === 'ios' && isLiquidGlassSupported;
}

function NativeLiquidGlassView({
  style,
  effectStyle = 'regular',
  interactive = false,
  children,
  ...rest
}: NativeLiquidGlassViewProps) {
  if (!isNativeLiquidGlassAvailable()) {
    return <View pointerEvents="none" style={style} />;
  }

  return (
    <LiquidGlassView
      {...rest}
      effect={effectStyle}
      interactive={interactive}
      pointerEvents="none"
      style={style}>
      {children}
    </LiquidGlassView>
  );
}

export default NativeLiquidGlassView;
