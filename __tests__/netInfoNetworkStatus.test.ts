import {mapNetworkStatusSnapshot} from '../src/infrastructure/network/networkStatusMapper';

describe('mapNetworkStatusSnapshot', () => {
    it('maps internet reachable state to online', () => {
        expect(
            mapNetworkStatusSnapshot({
                type: 'wifi',
                isConnected: true,
                isInternetReachable: true,
            }),
        ).toEqual({
            connectivity: 'online',
            isConnected: true,
            isInternetReachable: true,
            connectionType: 'wifi',
        });
    });

    it('maps disconnected state to offline', () => {
        expect(
            mapNetworkStatusSnapshot({
                type: 'none',
                isConnected: false,
                isInternetReachable: false,
            }),
        ).toEqual({
            connectivity: 'offline',
            isConnected: false,
            isInternetReachable: false,
            connectionType: 'none',
        });
    });

    it('keeps indeterminate state as unknown', () => {
        expect(
            mapNetworkStatusSnapshot({
                type: 'unknown',
                isConnected: null,
                isInternetReachable: null,
            }),
        ).toEqual({
            connectivity: 'unknown',
            isConnected: null,
            isInternetReachable: null,
            connectionType: 'unknown',
        });
    });
});
