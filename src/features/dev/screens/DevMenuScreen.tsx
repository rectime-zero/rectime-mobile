import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import type {Code, CodeScanner} from 'react-native-vision-camera';
import {getOptionalVisionCameraRuntime} from '../../../infrastructure/native/optionalVisionCamera';

// Dev feature: 開発・デバッグ機能
// 責務: アプリケーション全体の開発用ツール・ユーティリティを集約
// 特に QR スキャン機能の dev フィーチャでの提供は、
// gate フィーチャ（本番入場管理）とは独立した開発用ツールとしての位置付け

export type GateCheckInPayload = {
  qrData: string;
  scannedAt: string; // ISO 8601
};

type CameraPermissionStatus = 'denied' | 'granted' | 'not-determined' | 'restricted';

export const DevMenuScreen = () => {
  const [isScanningQR, setIsScanningQR] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<CameraPermissionStatus>('not-determined');
  const isScanning = useRef(false);
  const visionCameraRuntime = useMemo(() => getOptionalVisionCameraRuntime(), []);
  const CameraComponent = visionCameraRuntime.isAvailable ? visionCameraRuntime.CameraComponent : null;
  const backDevice = useMemo(() => {
    if (!visionCameraRuntime.isAvailable) {
      return null;
    }

    return visionCameraRuntime.getAvailableCameraDevices().find(device => device.position === 'back') ?? null;
  }, [visionCameraRuntime]);

  useEffect(() => {
    if (!visionCameraRuntime.isAvailable) {
      return undefined;
    }

    setPermissionStatus(visionCameraRuntime.getCameraPermissionStatus());
    return undefined;
  }, [visionCameraRuntime]);

  const onCodeScanned = useCallback((codes: Code[]) => {
    if (isScanning.current || codes.length === 0) return;
    isScanning.current = true;
    const qrData = codes[0]?.value ?? '';
    Alert.alert(
      'QRコードを読み取りました',
      `内容: ${qrData}`,
      [
        {
          text: '続けてスキャン',
          onPress: () => {
            isScanning.current = false;
          },
        },
        {
          text: '閉じる',
          onPress: () => {
            isScanning.current = false;
            setIsScanningQR(false);
          },
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  }, []);

  const codeScanner = useMemo<CodeScanner | undefined>(() => {
    if (!visionCameraRuntime.isAvailable) {
      return undefined;
    }

    return {
      codeTypes: ['qr'],
      onCodeScanned,
    };
  }, [onCodeScanned, visionCameraRuntime]);

  const hasPermission = permissionStatus === 'granted';

  const requestPermission = useCallback(async () => {
    if (!visionCameraRuntime.isAvailable) {
      return;
    }

    const nextStatus = await visionCameraRuntime.requestCameraPermission();
    setPermissionStatus(nextStatus);
  }, [visionCameraRuntime]);

  const handleQRScanPress = async () => {
    if (!visionCameraRuntime.isAvailable) {
      Alert.alert(
        'カメラ機能を利用できません',
        'VisionCamera のネイティブモジュールが見つかりません。`cd ios && pod install` の後に iOS アプリを再ビルドしてください。'
      );
      return;
    }

    if (!hasPermission) {
      await requestPermission();
    }
    setIsScanningQR(true);
  };

  if (isScanningQR) {
    if (!hasPermission) {
      return (
        <View style={styles.container}>
          <Text style={styles.permissionText}>カメラの権限が必要です</Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={async () => {
              await requestPermission();
            }}
          >
            <Text style={styles.permissionButtonText}>権限を許可する</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.cameraContainer}>
        {/* Header */}
        <View style={styles.cameraHeader}>
          <TouchableOpacity onPress={() => setIsScanningQR(false)}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.cameraTitle}>QR 入場スキャン</Text>
          <View style={styles.spacer} />
        </View>
        {/* Camera */}
        {backDevice && CameraComponent ? (
          <CameraComponent
            style={styles.camera}
            device={backDevice}
            isActive={true}
            codeScanner={codeScanner}
          />
        ) : (
          <View style={styles.noCameraContainer}>
            <Text style={styles.noCameraText}>カメラデバイスが見つかりません</Text>
          </View>
        )}
        {/* Overlay */}
        <View style={styles.overlay}>
          <View style={styles.scanFrame}>
            {/* 四隅マーカー等は必要に応じて追加 */}
          </View>
          <Text style={styles.overlayText}>QRコードを枠内に合わせてください</Text>
        </View>
        {/* Footer */}
        <View style={styles.cameraFooter}>
          <Text style={styles.mockIndicator}>MOCK — API 未接続</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.menuContainer}>
      {!visionCameraRuntime.isAvailable ? (
        <View style={styles.unavailableNotice}>
          <Text style={styles.unavailableTitle}>カメラ機能は未初期化です</Text>
          <Text style={styles.unavailableDescription}>
            iOS ネイティブ側に VisionCamera が含まれていないため、再ビルドが必要です。
          </Text>
        </View>
      ) : null}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={handleQRScanPress}
      >
        <Text style={styles.menuIcon}>📷</Text>
        <View>
          <Text style={styles.menuTitle}>QR入場スキャン</Text>
          <Text style={styles.menuSubtitle}>入管システム（モック）</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  permissionText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 16,
  },
  permissionButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  permissionButtonText: {
    color: 'white',
  },
  menuContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  unavailableNotice: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fef3c7',
  },
  unavailableTitle: {
    color: '#92400e',
    fontSize: 15,
    fontWeight: '700',
  },
  unavailableDescription: {
    marginTop: 6,
    color: '#92400e',
    fontSize: 13,
    lineHeight: 18,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginBottom: 8,
  },
  menuIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  closeButton: {
    color: 'white',
    fontSize: 32,
  },
  cameraTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  camera: {
    flex: 1,
  },
  noCameraContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noCameraText: {
    color: 'white',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanFrame: {
    width: 256,
    height: 256,
    borderWidth: 4,
    borderColor: '#fbbf24',
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayText: {
    color: 'white',
    marginTop: 16,
  },
  cameraFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingVertical: 8,
  },
  spacer: {
    width: 32,
  },
  mockIndicator: {
    backgroundColor: '#fbbf24',
    color: 'black',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
});
