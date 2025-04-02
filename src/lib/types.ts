
export interface LocationData {
  address: string;
  latitude: number | null;
  longitude: number | null;
  destinationAddress?: string;
  isEmergency: boolean;
  vehicleRegNumber: string;
  vehicleMake?: string;
  vehicleModel?: string;
}

export interface VehicleData {
  engineWorks: boolean;
  canMove: boolean;
  weight?: string;
  regNumber?: string;
  make?: string;
  model?: string;
}

export interface UserDetails {
  fullName: string;
  email: string;
  phoneNumber: string;
  serviceLength?: string;
}

export interface FormData {
  location: LocationData;
  vehicle: VehicleData;
  userDetails: UserDetails;
  orderId?: string;
}

export enum LocationOption {
  CURRENT = 'current',
  SEARCH = 'search',
  MANUAL = 'manual'
}

export enum FormStep {
  LOCATION = 0,
  VEHICLE = 1,
  USER_DETAILS = 2,
  CONFIRMATION = 3
}
