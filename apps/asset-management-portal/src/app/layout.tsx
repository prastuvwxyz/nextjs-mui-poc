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

      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        /* Fix for Chrome DevTools mobile simulation */
        html, body {
          height: 100% !important;
          overflow-x: hidden !important;
          -webkit-overflow-scrolling: touch !important;
        }

        /* Ensure proper viewport on mobile */
        @media screen and (max-width: 768px) {
          body {
            height: 100vh !important;
            overflow-y: auto !important;
          }
        }

        /* iPhone 14 Pro specific fixes for Safari/Chrome */
        @media screen and (max-width: 430px) and (-webkit-device-pixel-ratio: 3) {
          /* Ensure header appears properly */
          .MuiAppBar-root {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 1201 !important;
          }

          /* Ensure sidebar appears above header when open */
          .MuiDrawer-root .MuiDrawer-paper {
            z-index: 1300 !important;
          }

          /* FORCE VISIBLE - Fix for invisible icons on iOS Safari */
          .MuiIconButton-root .MuiSvgIcon-root {
            color: rgba(0, 0, 0, 0.87) !important;
            opacity: 1 !important;
            visibility: visible !important;
          }

          /* Menu icon specific override */
          svg[data-testid="MenuIcon"] {
            color: rgba(0, 0, 0, 0.87) !important;
            fill: rgba(0, 0, 0, 0.87) !important;
          }
        }

        /* General mobile Safari fixes */
        @supports (-webkit-touch-callout: none) {
          .MuiIconButton-root {
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
            -webkit-touch-callout: none;
            -webkit-user-select: none;
          }
        }

        /* CRITICAL: General mobile fixes for all devices below lg breakpoint (1200px) */
        @media screen and (max-width: 1199px) {
          /* FORCE hamburger menu visibility with highest priority */
          .MuiIconButton-root[aria-label="Open navigation menu"] {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: relative !important;
            z-index: 9999 !important;
          }

          /* FORCE icon visibility inside hamburger button */
          .MuiIconButton-root[aria-label="Open navigation menu"] .MuiSvgIcon-root {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            color: rgba(0, 0, 0, 0.87) !important;
            font-size: 1.5rem !important;
          }

          /* Ensure proper z-index layering on mobile */
          .MuiDrawer-root .MuiDrawer-paper {
            z-index: 1300 !important;
          }

          .MuiBackdrop-root {
            z-index: 1250 !important;
          }

          /* Ensure header stays below sidebar and spans full width */
          .MuiAppBar-root {
            z-index: 1200 !important;
            width: 100% !important;
            margin-left: 0 !important;
          }

          /* Hide permanent sidebar on mobile */
          .MuiDrawer-root[class*="permanent"] {
            display: none !important;
          }

          /* Dark mode override */
          @media (prefers-color-scheme: dark) {
            .MuiIconButton-root[aria-label="Open navigation menu"] .MuiSvgIcon-root {
              color: rgba(255, 255, 255, 0.87) !important;
            }
          }
        }

        /* Desktop specific adjustments */
        @media screen and (min-width: 1200px) {
          /* Hide hamburger menu on desktop */
          .MuiIconButton-root[aria-label="Open navigation menu"] {
            display: none !important;
          }

          /* Ensure permanent sidebar is visible */
          .MuiDrawer-root[class*="permanent"] {
            display: block !important;
          }

          /* Header positioning for desktop with sidebar */
          .MuiAppBar-root {
            width: calc(100% - 280px) !important;
            margin-left: 280px !important;
          }
        }
      `;

      document.head.appendChild(style);
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