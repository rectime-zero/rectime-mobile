export type NetworkConnectivity = 'online' | 'offline' | 'unknown';

export type NetworkConnectionType =
    | 'unknown'
    | 'none'
    | 'cellular'
    | 'wifi'
    | 'bluetooth'
    | 'ethernet'
    | 'wimax'
    | 'vpn'
    | 'other';

export type NetworkStatus = {
    connectivity: NetworkConnectivity;
    isConnected: boolean | null;
    isInternetReachable: boolean | null;
    connectionType: NetworkConnectionType;
};

export const UNKNOWN_NETWORK_STATUS: NetworkStatus = {
    connectivity: 'unknown',
    isConnected: null,
    isInternetReachable: null,
    connectionType: 'unknown',
};
