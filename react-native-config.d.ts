declare module 'react-native-config' {
    export interface NativeConfig {
        MAPBOX_ACCESS_TOKEN?: string;
    }

    const Config: NativeConfig;
    export default Config;
}
