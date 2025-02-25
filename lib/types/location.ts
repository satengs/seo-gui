export interface ILocation {
    id: string;
    name: string;
    canonical_name: string;
    country_code: string;
    target_type: string;
    reach: number;
    gps: [number, number];
    keys: string[];
}