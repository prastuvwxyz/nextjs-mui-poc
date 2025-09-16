import {
  Dashboard as DashboardIcon,
  Moped as MotorcycleIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import type { MenuItem } from '@electrum/ui';

export const assetManagementMenuItems: MenuItem[] = [
  {
    id: 'overview',
    label: 'OVERVIEW',
    children: [
      { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon, path: '/' },
    ],
  },
  {
    id: 'assets',
    label: 'ASSETS',
    children: [
      { id: 'fleet-motorcycles', label: 'Fleet Motorcycles', icon: MotorcycleIcon, path: '/fleet-motorcycles' },
      { id: 'stock-opname', label: 'Stock Opname', icon: InventoryIcon, path: '/stock-opname' },
    ],
  },
];