import React from 'react';
import {Alert} from 'react-native';
import {type ScanResult} from '../types';

type UseScanSessionReturn = {
    currentResult: ScanResult;
    handleScan: (qrValue: string) => void;
    clearResult: () => void;
};

const IDLE_RESULT: ScanResult = {
    status: 'idle',
};

export function useScanSession(): UseScanSessionReturn {
    const [currentResult, setCurrentResult] = React.useState<ScanResult>(IDLE_RESULT);

    const clearResult = React.useCallback(() => {
        setCurrentResult(IDLE_RESULT);
    }, []);

    const handleScan = React.useCallback((qrValue: string) => {
        setCurrentResult({
            status: 'success',
            qrData: qrValue,
            message: 'モック環境で QR を読み取りました。',
        });

        Alert.alert('QRコードを読み取りました', `内容: ${qrValue}`);
    }, []);

    return {
        currentResult,
        handleScan,
        clearResult,
    };
}
