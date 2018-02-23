import {Image} from './image';

export interface Property {
	user_id: string,
    location: string,
    common: string,
    street_address: string,
    near_to: string[],
    nsfas: boolean,
    prepaid_elec: boolean,
    laundry: boolean,
    parking: boolean,
    dP: Image,
    images: Image[],
    wifi: boolean,
    prop_id: string,
    timeStamp: number
}
