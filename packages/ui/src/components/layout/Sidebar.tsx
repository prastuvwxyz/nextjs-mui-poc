'use client';

import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ShoppingCart as EcommerceIcon,
  Analytics as AnalyticsIcon,
  AccountBalance as BankingIcon,
  BookOnline as BookingIcon,
  Folder as FileIcon,
  School as CourseIcon,
  People as UserIcon,
  Inventory as ProductIcon,
  ShoppingBasket as OrderIcon,
  Receipt as InvoiceIcon,
  Article as BlogIcon,
  Work as JobIcon,
  Tour as TourIcon,
  FolderOpen as FileManagerIcon,
  Mail as MailIcon,
  DirectionsBike as MotorcycleIcon,
  ExpandLess,
  ExpandMore,
  Inventory2 as AssetsIcon,
  BusinessCenter as AssetIcon,
} from '@mui/icons-material';
import type { MenuItem } from '@/types';

const DRAWER_WIDTH = 280;

const menuItems: MenuItem[] = [
  {
    id: 'overview',
    label: 'OVERVIEW',
    children: [
      { id: 'app', label: 'App', icon: DashboardIcon, path: '/' },
      { id: 'ecommerce', label: 'Ecommerce', icon: EcommerceIcon, path: '/ecommerce' },
      { id: 'analytics', label: 'Analytics', icon: AnalyticsIcon, path: '/analytics' },
      { id: 'banking', label: 'Banking', icon: BankingIcon, path: '/banking' },
      { id: 'booking', label: 'Booking', icon: BookingIcon, path: '/booking' },
      { id: 'file', label: 'File', icon: FileIcon, path: '/file' },
      { id: 'course', label: 'Course', icon: CourseIcon, path: '/course' },
    ],
  },
  {
    id: 'management',
    label: 'MANAGEMENT',
    children: [
      { id: 'user', label: 'User', icon: UserIcon, path: '/user' },
      { id: 'product', label: 'Product', icon: ProductIcon, path: '/product' },
      {
        id: 'assets',
        label: 'Assets',
        icon: AssetsIcon,
        children: [
          { id: 'motorcycle-stocks', label: 'Motorcycle Stocks', icon: MotorcycleIcon, path: '/assets/motorcycle-stocks' },
        ],
      },
      { id: 'order', label: 'Order', icon: OrderIcon, path: '/order' },
      { id: 'invoice', label: 'Invoice', icon: InvoiceIcon, path: '/invoice' },
      { id: 'blog', label: 'Blog', icon: BlogIcon, path: '/blog' },
      { id: 'job', label: 'Job', icon: JobIcon, path: '/job' },
      { id: 'tour', label: 'Tour', icon: TourIcon, path: '/tour' },
      { id: 'file-manager', label: 'File manager', icon: FileManagerIcon, path: '/file-manager' },
      { id: 'mail', label: 'Mail', icon: MailIcon, path: '/mail' },
    ],
  },
];

interface SidebarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
  menuItems?: MenuItem[];
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ currentPath = '', onNavigate, menuItems: customMenuItems, mobileOpen = false, onMobileClose }: SidebarProps) {
  const [openItems, setOpenItems] = useState<string[]>(['assets']);

  const handleToggle = (itemId: string) => {
    setOpenItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleNavigation = (path: string) => {
    onNavigate?.(path);
    // Close mobile drawer after navigation
    onMobileClose?.();
  };

  const isSelected = (path: string) => currentPath === path;

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openItems.includes(item.id);
    const Icon = item.icon as React.ComponentType<any>;

    if (level === 0 && hasChildren && !item.path) {
      // Section header
      return (
        <Box key={item.id} sx={{ mt: level === 0 ? 2 : 0 }}>
          <Typography
            variant="overline"
            sx={{
              px: 2,
              py: 1,
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'text.secondary',
              letterSpacing: '0.5px',
            }}
          >
            {item.label}
          </Typography>
          {item.children?.map(child => renderMenuItem(child, level + 1))}
        </Box>
      );
    }

    return (
      <Box key={item.id}>
        <ListItem disablePadding sx={{ px: 1 }}>
          <ListItemButton
            selected={item.path ? isSelected(item.path) : false}
            onClick={() => {
              if (hasChildren) {
                handleToggle(item.id);
              } else if (item.path) {
                handleNavigation(item.path);
              }
            }}
            sx={{
              borderRadius: 1,
              pl: level * 2 + 1,
              minHeight: 44,
            }}
          >
            {Icon && (
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Icon sx={{ fontSize: 20 }} />
              </ListItemIcon>
            )}
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            />
            {hasChildren && (
              isOpen ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItemButton>
        </ListItem>
        {hasChildren && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children?.map(child => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  const drawerContent = (
    <>
      <Box sx={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        px: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: (theme) => `0 4px 14px 0 ${theme.palette.primary.main}39`,
            }}
          >
            <AssetIcon sx={{ color: 'primary.contrastText', fontSize: '1.4rem' }} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: 40 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.1, fontSize: '1.1rem' }}>
              Electrum
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.1, fontSize: '0.75rem' }}>
              Asset Management Portal
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ overflow: 'auto', flex: 1 }}>
        <List component="nav" sx={{ px: 1, py: 0 }}>
          {(customMenuItems || menuItems).map(item => renderMenuItem(item))}
        </List>
      </Box>
    </>
  );

  return (
    <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            backgroundColor: 'background.paper',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            backgroundColor: 'background.paper',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}