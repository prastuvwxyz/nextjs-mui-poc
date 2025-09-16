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

  // Add CSS immediately and ensure it persists across reloads
  useEffect(() => {
    const styleId = 'mobile-fixes-css';

    // Function to apply styles
    const applyStyles = () => {
      // Remove existing style if it exists
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };

    // Apply styles immediately
    applyStyles();

    // Also apply on window resize to handle Chrome DevTools responsive mode
    const handleResize = () => {
      setTimeout(applyStyles, 50); // Small delay to ensure DOM is ready
    };

    window.addEventListener('resize', handleResize);

    // Apply after a brief delay to ensure all components are mounted
    const timeoutId = setTimeout(applyStyles, 100);

    // Cleanup function
    return () => {
      const styleElement = document.getElementById(styleId);
      if (styleElement) {
        styleElement.remove();
      }
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

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
              height: '100vh',
              // Fix for Chrome mobile dimensions viewport issues
              minHeight: { xs: '100vh', md: 'auto' },
              maxHeight: { xs: '100vh', md: 'none' },
              overflow: 'hidden', // Prevent double scrollbars
            }}>
              <Sidebar
                currentPath={pathname}
                onNavigate={handleNavigation}
                menuItems={assetManagementMenuItems}
                mobileOpen={mobileOpen}
                onMobileClose={handleMobileClose}
              />
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  p: { xs: 2, sm: 3 },
                  pb: { xs: 6, sm: 3 },
                  width: {
                    xs: '100%',
                    lg: `calc(100% - ${DRAWER_WIDTH}px)`
                  },
                  mt: { xs: 7, sm: 8 },
                  minWidth: 0,
                  // Simplified scrolling - remove height constraints
                  overflow: 'auto',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                <Header onMobileMenuClick={handleMobileMenuClick} />
                {children}
              </Box>
            </Box>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}