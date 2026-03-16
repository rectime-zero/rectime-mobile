import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type {WithDefault} from 'react-native/Libraries/Types/CodegenTypes';
import type {HostComponent, ViewProps} from 'react-native';

export interface NativeProps extends ViewProps {
    effectStyle?: WithDefault<'regular' | 'clear', 'regular'>;
    interactive?: WithDefault<boolean, false>;
}

export default codegenNativeComponent<NativeProps>('RCTLiquidGlassView') as HostComponent<NativeProps>;
