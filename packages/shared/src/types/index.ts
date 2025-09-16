export interface Motorcycle {
  licensePlate: string;
  vin: string;
  ccu_number: string;
  stockStatus: 'AVAILABLE' | 'RENTED' | 'RENTED_TO_PARTNER' | 'IN_MAINTENANCE' | 'HEAVY_DAMAGED' | 'LOST' | 'IN_INSPECTION' | 'WRITE_OFF';
  model: 'H1' | 'H3' | 'H5';
  color: 'Midnight Blue' | 'Tiffany Blue';
  sku: string;
  productionYear: string;
  ownerType: 'FIXED_ASSET' | 'ROU_ASSET';
  ownerName: string;
  location: 'WH-PI' | 'WH-BKS' | 'WH-SBY';
}

export interface FilterOptions {
  status: string[];
  brand: string[];
  location: string[];
  priceRange: [number, number];
  dateRange: [string, string];
}