'use client';

import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import { theme, Sidebar, Header } from '@electrum/ui';
import { assetManagementMenuItems } from '@/config/menuItems';

const DRAWER_WIDTH = 280;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleMobileMenuClick = () => {
    setMobileOpen(true);
  };

  const handleMobileClose = () => {
    setMobileOpen(false);
  };

  // Check if current page is an auth page (sign-in, sign-up, etc.)
  const isAuthPage = pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up') || pathname?.startsWith('/auth');

  return (
    <html lang="en">
      <head>
        <title>Asset Management Portal</title>
        <meta name="description" content="Comprehensive asset management solution for tracking and managing organizational assets" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1976d2" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Asset Portal" />
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {isAuthPage ? (
            // Render auth pages without sidebar and header
            children
          ) : (
            // Render dashboard layout with sidebar and header
            <Box sx={{
              display: 'flex',
            }}>
              <Sidebar
                currentPath={pathname}
                onNavigate={handleNavigation}
                menuItems={assetManagementMenuItems}
                mobileOpen={mobileOpen}
                onMobileClose={handleMobileClose}
              />
              <Header onMobileMenuClick={handleMobileMenuClick} />
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  p: { xs: 2, sm: 3 },
                  mt: { xs: 7, sm: 8 },
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {children}
              </Box>
            </Box>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}