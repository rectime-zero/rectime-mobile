import {Platform} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

export type AppHapticType = 'tap' | 'success' | 'warning' | 'error' | 'selection';

type NativeHapticMethod =
    | 'impactLight'
    | 'notificationSuccess'
    | 'notificationWarning'
    | 'notificationError'
    | 'selection';

const HAPTIC_OPTIONS = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
} as const;

function resolveNativeMethod(type: AppHapticType): NativeHapticMethod {
    switch (type) {
        case 'success':
            return 'notificationSuccess';
        case 'warning':
            return 'notificationWarning';
        case 'error':
            return 'notificationError';
        case 'selection':
            return Platform.OS === 'ios' ? 'selection' : 'impactLight';
        case 'tap':
        default:
            return 'impactLight';
    }
}

export function triggerNativeHaptic(type: AppHapticType) {
    ReactNativeHapticFeedback.trigger(resolveNativeMethod(type), HAPTIC_OPTIONS);
}
