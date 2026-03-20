export type FacilityType = 'toilet' | 'entrance' | 'exit' | 'info' | 'trash' | 'waiting';

export type Facility = {
    id: string;
    type: FacilityType;
    name: string;
    latitude: number;
    longitude: number;
    description?: string;
};

export type MapCopy = {
    title: string;
    body: string;
    placeTitle: string;
    permissionRequired: string;
    currentLocationLoading: string;
    unavailableTitle: string;
    unavailableBody: string;
};

export type MapLocation = {
    latitude: number;
    longitude: number;
};
