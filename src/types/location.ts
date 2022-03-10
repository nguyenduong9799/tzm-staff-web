export interface Destination {
  destination_location_id: number;
  destination_id: number;
  name: string;
}

export interface Location {
  destination_id: number;
  address: string;
  lat: string;
  long: string;
  area_id: number;
  code: string;
  locations: Destination[];
}
