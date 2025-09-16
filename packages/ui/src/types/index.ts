export interface MenuItem {
  id: string;
  label: string;
  icon?: any;
  path?: string;
  children?: MenuItem[];
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}