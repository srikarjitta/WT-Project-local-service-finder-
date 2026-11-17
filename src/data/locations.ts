export interface CityLocation {
  city: string;
  state: string;
  popularLocalities: string[];
}

export const SUPPORTED_LOCATIONS: CityLocation[] = [
  {
    city: 'Khammam',
    state: 'Telangana',
    popularLocalities: ['Wyra Road', 'Mamillagudem', 'Church Compound', 'Rotary Nagar', 'Gandhi Chowk', 'Kaviraj Nagar'],
  },
  {
    city: 'Hyderabad',
    state: 'Telangana',
    popularLocalities: ['Hitec City', 'Jubilee Hills', 'Banjara Hills', 'Gachibowli', 'Kukatpally', 'Madhapur', 'Kondapur'],
  },
  {
    city: 'Bengaluru',
    state: 'Karnataka',
    popularLocalities: ['Indiranagar', 'Koramangala', 'HSR Layout', 'Whitefield', 'Jayanagar', 'Electronic City'],
  },
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    popularLocalities: ['Bandra West', 'Andheri East', 'Powai', 'Juhu', 'Colaba', 'Thane West'],
  },
  {
    city: 'Warangal',
    state: 'Telangana',
    popularLocalities: ['Hanamkonda', 'Kazipet', 'Subedari', 'Nayeem Nagar'],
  },
  {
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    popularLocalities: ['Benz Circle', 'MG Road', 'Governorpet', 'Poranki'],
  },
];

