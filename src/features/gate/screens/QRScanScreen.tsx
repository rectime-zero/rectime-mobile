import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ScanCamera} from '../components/ScanCamera';
import {useScanSession} from '../hooks/useScanSession';
import {useNavigation} from '../../../navigation/useNavigation';

export const QRScanScreen = () => {
  const {pop} = useNavigation();
  const {currentResult, handleScan, clearResult} = useScanSession();

  const isResultVisible = currentResult.status !== 'idle';

  const handleContinue = React.useCallback(() => {
    clearResult();
  }, [clearResult]);

  return (
    <View style={styles.cameraContainer}>
      <View style={styles.cameraHeader}>
        <TouchableOpacity onPress={() => pop()}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.cameraTitle}>QR 入場スキャン</Text>
        <View style={styles.spacer} />
      </View>

      <ScanCamera disabled={isResultVisible} onScan={handleScan} />

      {isResultVisible ? (
        <View style={styles.resultOverlay}>
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>読み取り結果</Text>
            <Text style={styles.resultValue}>{currentResult.qrData}</Text>
            {currentResult.message ? <Text style={styles.resultMessage}>{currentResult.message}</Text> : null}
            <TouchableOpacity style={styles.resultButton} onPress={handleContinue}>
              <Text style={styles.resultButtonText}>続けて認証する</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <View style={styles.cameraFooter}>
        <Text style={styles.mockIndicator}>MOCK — API 未接続</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  resultOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  resultCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 18,
    backgroundColor: 'rgba(17, 24, 39, 0.94)',
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  resultLabel: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  resultValue: {
    marginTop: 10,
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  resultMessage: {
    marginTop: 10,
    color: '#d1d5db',
    fontSize: 13,
    lineHeight: 18,
  },
  resultButton: {
    marginTop: 16,
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: '#fbbf24',
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  resultButtonText: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '800',
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
