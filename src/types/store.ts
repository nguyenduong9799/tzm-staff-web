
export type Store = {
    store_code: string;
    id: number;
    name: string;
    lat: string;
    address: string;
    type: number;
    is_available: boolean;
    time_slots: TimeSlot[];
}
// export interface Location {
//     location_id: number;
//     address: string;
//     lat: string;
//     long: string;
//     code: string;
// }

export type TimeSlot = {
    menu_id: number;
    from: string;
    to: string;
    arrive_time: string;
    available: boolean;
}




