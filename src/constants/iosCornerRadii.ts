export type IOSCornerEntry = {
    radius: number;
};

const dynamicIslandRadius = {radius: 55} as const satisfies IOSCornerEntry;
const notchRadius = {radius: 48} as const satisfies IOSCornerEntry;
const ipadProRadius = {radius: 18} as const satisfies IOSCornerEntry;
const squareRadius = {radius: 0} as const satisfies IOSCornerEntry;

const iosCornerRadiiBySignature: Record<string, IOSCornerEntry> = {
    '1125x2436@3': notchRadius,
    '1242x2688@3': notchRadius,
    '828x1792@2': notchRadius,
    '1080x2340@3': notchRadius,
    '1170x2532@3': notchRadius,
    '1179x2556@3': dynamicIslandRadius,
    '1179x2556@2': dynamicIslandRadius,
    '1179x2556@1': dynamicIslandRadius,
    '1170x2532@2': notchRadius,
    '1284x2778@3': notchRadius,
    '1290x2796@3': dynamicIslandRadius,
    '1320x2868@3': dynamicIslandRadius,
    '1206x2622@3': dynamicIslandRadius,
    '1488x2266@2': notchRadius,
    '1640x2360@2': ipadProRadius,
    '1668x2388@2': ipadProRadius,
    '1668x2420@2': ipadProRadius,
    '2048x2732@2': ipadProRadius,
    '1536x2048@2': squareRadius,
    '1620x2160@2': squareRadius,
};

export function createIOSSignature(width: number, height: number, scale: number) {
    const longEdge = Math.max(width, height);
    const shortEdge = Math.min(width, height);

    return `${shortEdge}x${longEdge}@${scale}`;
}

export function getIOSCornerEntry(signature: string) {
    return iosCornerRadiiBySignature[signature];
}
