import React from 'react';
import {UNKNOWN_NETWORK_STATUS, type NetworkStatus} from '../domain/network';
import {fetchCurrentNetworkStatus, observeNetworkStatus} from '../infrastructure/network';

export function useNetworkStatus(): NetworkStatus {
    const [networkStatus, setNetworkStatus] = React.useState<NetworkStatus>(UNKNOWN_NETWORK_STATUS);

    React.useEffect(() => {
        let isMounted = true;

        const unsubscribe = observeNetworkStatus(status => {
            if (isMounted) {
                setNetworkStatus(status);
            }
        });

        fetchCurrentNetworkStatus()
            .then(status => {
                if (isMounted) {
                    setNetworkStatus(status);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setNetworkStatus(UNKNOWN_NETWORK_STATUS);
                }
            });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    return networkStatus;
}
