import {type NetworkStatus} from '../../domain/network';
import {type NetworkStatusSnapshot} from './networkStatusSnapshot';

function resolveConnectivity(snapshot: NetworkStatusSnapshot): NetworkStatus['connectivity'] {
    if (snapshot.isInternetReachable === true) {
        return 'online';
    }

    if (snapshot.type === 'none' || snapshot.isConnected === false || snapshot.isInternetReachable === false) {
        return 'offline';
    }

    return 'unknown';
}

export function mapNetworkStatusSnapshot(snapshot: NetworkStatusSnapshot): NetworkStatus {
    return {
        connectivity: resolveConnectivity(snapshot),
        isConnected: snapshot.isConnected,
        isInternetReachable: snapshot.isInternetReachable,
        connectionType: snapshot.type,
    };
}
