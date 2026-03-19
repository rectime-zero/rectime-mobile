import NetInfo, {type NetInfoState} from '@react-native-community/netinfo';
import {type NetworkConnectionType, type NetworkStatus} from '../../domain/network';
import {mapNetworkStatusSnapshot} from './networkStatusMapper';

export type NetworkStatusListener = (status: NetworkStatus) => void;

function normalizeConnectionType(type: NetInfoState['type']): NetworkConnectionType {
    switch (type) {
        case 'none':
        case 'cellular':
        case 'wifi':
        case 'bluetooth':
        case 'ethernet':
        case 'wimax':
        case 'vpn':
        case 'other':
            return type;
        case 'unknown':
        default:
            return 'unknown';
    }
}

export function mapNetInfoStateToNetworkStatus(state: NetInfoState): NetworkStatus {
    return mapNetworkStatusSnapshot({
        type: normalizeConnectionType(state.type),
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
    });
}

export async function fetchCurrentNetworkStatus(): Promise<NetworkStatus> {
    const state = await NetInfo.fetch();
    return mapNetInfoStateToNetworkStatus(state);
}

export function observeNetworkStatus(listener: NetworkStatusListener) {
    return NetInfo.addEventListener(state => {
        listener(mapNetInfoStateToNetworkStatus(state));
    });
}
