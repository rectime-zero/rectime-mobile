import {NativeModules, Platform} from 'react-native';

type VisionCameraModule = typeof import('react-native-vision-camera');
type VisionCameraClass = VisionCameraModule['Camera'];

export type OptionalVisionCameraRuntime =
    | {
          isAvailable: true;
          CameraComponent: VisionCameraClass;
          getAvailableCameraDevices: () => ReturnType<VisionCameraClass['getAvailableCameraDevices']>;
          getCameraPermissionStatus: () => ReturnType<VisionCameraClass['getCameraPermissionStatus']>;
          requestCameraPermission: () => ReturnType<VisionCameraClass['requestCameraPermission']>;
      }
    | {
          isAvailable: false;
          reason: string;
      };

function getErrorMessage(error: unknown) {
    if (error instanceof Error && error.message) {
        return error.message;
    }

    return 'VisionCamera native module is unavailable.';
}

export function getOptionalVisionCameraRuntime(): OptionalVisionCameraRuntime {
    try {
        if (NativeModules.CameraView == null) {
            return {
                isAvailable: false,
                reason:
                    Platform.OS === 'ios'
                        ? 'VisionCamera native module is unavailable. Rebuild the iOS app after `pod install`.'
                        : 'VisionCamera native module is unavailable.',
            };
        }

        const visionCameraModule = require('react-native-vision-camera') as VisionCameraModule;
        const {Camera} = visionCameraModule;

        return {
            isAvailable: true,
            CameraComponent: Camera,
            getAvailableCameraDevices: () => Camera.getAvailableCameraDevices(),
            getCameraPermissionStatus: () => Camera.getCameraPermissionStatus(),
            requestCameraPermission: () => Camera.requestCameraPermission(),
        };
    } catch (error) {
        return {
            isAvailable: false,
            reason: getErrorMessage(error),
        };
    }
}
