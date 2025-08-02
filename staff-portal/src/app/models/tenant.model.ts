export interface Building {
  id: string;
  name: string;
  address: string;
  totalFloors: number;
  totalApartments: number;
}

export interface Apartment {
  apartmentNo: string;
  floor: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  buildingId: string;
  buildingName: string;
  apartmentNo: string;
  floor: number;
  leaseStartDate: Date;
  leaseEndDate?: Date;
  rentAmount: number;
  securityDeposit?: number;
  isActive: boolean;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
