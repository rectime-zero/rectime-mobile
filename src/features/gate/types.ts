export type GateCheckInPayload = {
    qrData: string;
    scannedAt: string;
};

export type ScanStatus = 'idle' | 'scanning' | 'success' | 'error';

export type ScanResult = {
    status: ScanStatus;
    qrData?: string;
    message?: string;
};
