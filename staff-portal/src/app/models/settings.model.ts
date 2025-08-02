export interface BuildingSettings {
  id: string;
  buildingName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  numberOfFloors: number;
  numberOfUnits: number;
  logoUrl?: string;
  contactEmail: string;
  contactPhone: string;
  emergencyPhone: string;
  updatedAt: Date;
  updatedBy: string;
}
