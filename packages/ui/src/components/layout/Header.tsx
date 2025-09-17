'use client';

import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Avatar,
  Badge,
  InputBase,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const DRAWER_WIDTH = 280;

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

interface HeaderProps {
  onMobileMenuClick?: () => void;
}

export default function Header({ onMobileMenuClick }: HeaderProps) {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: {
          xs: '100%',
          lg: `calc(100% - ${DRAWER_WIDTH}px)`
        },
        ml: { xs: 0, lg: `${DRAWER_WIDTH}px` },
        backgroundColor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        borderBottom: '1px solid #e2e8f0',
        top: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1000,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          minHeight: { xs: 56, sm: 64 }, // Ensure consistent height
          paddingLeft: { xs: 3, sm: 3 },
          paddingRight: { xs: 1, sm: 3 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Mobile menu button - Enhanced for iPhone 14 Pro */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMobileMenuClick}
            sx={{
              display: { xs: 'block', lg: 'none' },
              mr: 1,
              // Clean professional styling
              minWidth: 44,
              minHeight: 44,
              padding: 1,
              color: 'text.primary',
              backgroundColor: 'transparent',
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              '&:active': {
                backgroundColor: 'action.selected',
              },
              // Ensure icon visibility on iOS Safari
              '& .MuiSvgIcon-root': {
                fontSize: '1.50rem',
                color: 'text.primary',
                opacity: 1,
                visibility: 'visible',
              }
            }}
            aria-label="Open navigation menu"
            data-testid="mobile-menu-button"
          >
            <MenuIcon
              sx={{
                color: 'text.primary',
                fontSize: '1.50rem',
                opacity: 1,
                visibility: 'visible',
              }}
            />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Search sx={{ display: { xs: 'none', sm: 'block' } }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>

          <IconButton
            size="large"
            color="inherit"
            sx={{
              minWidth: 44,
              minHeight: 44,
              color: 'text.primary',
              '& .MuiSvgIcon-root': {
                fontSize: '1.50rem',
                color: 'text.primary',
              },
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }}
            aria-label="Notifications"
          >
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton
            size="large"
            color="inherit"
            sx={{
              minWidth: 44,
              minHeight: 44,
              color: 'text.primary',
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }}
            aria-label="Account menu"
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
              }}
            >
              <AccountIcon />
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}