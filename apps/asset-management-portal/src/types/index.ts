export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType;
  path?: string;
  children?: MenuItem[];
}

export interface MotorcycleStock {
  id: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  status: 'Available' | 'In Use' | 'Maintenance' | 'Sold';
  location: string;
  price: number;
  dateAdded: string;
  engineCapacity?: string;
  color?: string;
  mileage?: number;
  lastMaintenance?: string;
  nextMaintenance?: string;
  owner?: string;
  notes?: string;
}

export interface FilterOptions {
  status: string[];
  brand: string[];
  location: string[];
  priceRange: [number, number];
  dateRange: [string, string];
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}