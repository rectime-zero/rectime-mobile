import React from 'react';
import {buildTicketQrValue} from '../../../domain/ticket/buildTicketQrValue';
import {generateTicketTotp} from '../../../domain/ticket/generateTicketTotp';
import {getRemainingSeconds} from '../../../domain/ticket/timeWindow';

const MOCK_SECRET = 'rectime-ticket-demo-secret';

export type UseTicketQrReturn = {
    qrValue: string | null;
    remainingSeconds: number;
    isLoading: boolean;
    isError: boolean;
    reload: () => Promise<void>;
};

function buildQrState(userId: string, timestamp: number) {
    const totpValue = generateTicketTotp(userId, MOCK_SECRET, timestamp);

    return {
        qrValue: buildTicketQrValue(userId, totpValue),
        remainingSeconds: getRemainingSeconds(timestamp),
    };
}

export function useTicketQr(userId: string): UseTicketQrReturn {
    const [state, setState] = React.useState(() => buildQrState(userId, Date.now()));

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setState(buildQrState(userId, Date.now()));
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [userId]);

    const reload = React.useCallback(async () => {
        setState(buildQrState(userId, Date.now()));
    }, [userId]);

    return {
        qrValue: state.qrValue,
        remainingSeconds: state.remainingSeconds,
        isLoading: false,
        isError: false,
        reload,
    };
}
