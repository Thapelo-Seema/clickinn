import {Image} from './image';
import {Property} from './property';

export interface Apartment {
room_type: string ,
price: number ,
deposit: number ,
dP: Image,
images: Image[],
description: string ,
prop_id: string ,
apart_id: string,
timeStamp:  number,
available: boolean,
occupiedBy: string,
property: Property 
}
