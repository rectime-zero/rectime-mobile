import {type NetworkConnectionType} from '../../domain/network';

export type NetworkStatusSnapshot = {
    type: NetworkConnectionType;
    isConnected: boolean | null;
    isInternetReachable: boolean | null;
};
