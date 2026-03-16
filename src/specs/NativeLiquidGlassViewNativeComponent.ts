import {codegenNativeComponent} from 'react-native';
import type {HostComponent, ViewProps} from 'react-native';
import type {WithDefault} from 'react-native/Libraries/Types/CodegenTypes';

export interface NativeProps extends ViewProps {
    effectStyle?: WithDefault<'regular' | 'clear', 'regular'>;
    interactive?: WithDefault<boolean, false>;
}

export default codegenNativeComponent<NativeProps>('RCTLiquidGlassView') as HostComponent<NativeProps>;
