'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  LinearProgress,
  IconButton,
  Paper,
} from '@mui/material';
import {
  CameraAlt as CameraIcon,
  ArrowBack as BackIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { Breadcrumbs } from '@electrum/ui';
import type { BreadcrumbItem } from '@electrum/ui';

export default function ScannerPage() {
  const params = useParams();
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [hasCamera, setHasCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const opnameId = params.id as string;

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Dashboard', path: '/' },
    { label: 'Stock Opname', path: '/stock-opname' },
    { label: `${opnameId}`, path: `/stock-opname/${opnameId}` },
    { label: 'Scanner' },
  ];

  // Mock asset data for scanning result - will be random
  const getRandomAssetData = () => {
    const assetTypes = [
      {
        assetType: 'motorcycle',
        assetId: 'MH3JF4120LK123456',
        licensePlate: 'B-1234-ABC',
        displayName: 'VARIO-150'
      },
      {
        assetType: 'battery',
        assetId: 'BAT-48V-001',
        licensePlate: '',
        displayName: 'Lithium Battery 48V'
      },
      {
        assetType: 'sparepart',
        assetId: 'SP-BP-001',
        licensePlate: '',
        displayName: 'Brake Pad Set'
      },
      {
        assetType: 'bss',
        assetId: 'BSS-STN-001',
        licensePlate: '',
        displayName: 'BSS Station Type A'
      }
    ];

    return assetTypes[Math.floor(Math.random() * assetTypes.length)];
  };

  const [mockAssetData] = useState(getRandomAssetData());

  useEffect(() => {
    // Initialize camera
    initializeCamera();

    return () => {
      // Cleanup camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setHasCamera(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCamera(false);
    }
  };

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);

    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Auto redirect after 5 seconds
          setTimeout(() => {
            redirectToAssetDetail();
          }, 1000);
          return 100;
        }
        return prev + 20; // 5 second total (100/20 = 5 intervals)
      });
    }, 1000);
  };

  const redirectToAssetDetail = () => {
    const { assetType, assetId } = mockAssetData;
    router.push(`/stock-opname/${opnameId}/asset/${assetType}/${assetId}`);
  };

  const handleBack = () => {
    router.back();
  };

  const handleManualRedirect = () => {
    redirectToAssetDetail();
  };

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <BackIcon />
        </IconButton>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
          }}
        >
          Asset Scanner
        </Typography>
      </Box>

      <Card sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Scan Asset for Opname: {opnameId}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Point your camera at the asset QR code or use manual scan
            </Typography>
          </Box>

          {/* Camera View */}
          <Paper
            elevation={3}
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: 600,
              margin: '0 auto',
              aspectRatio: '16/9',
              backgroundColor: '#000',
              borderRadius: 2,
              overflow: 'hidden',
              mb: 3,
            }}
          >
            {hasCamera ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: 'white',
                }}
              >
                <CameraIcon sx={{ fontSize: 60, mb: 2, opacity: 0.7 }} />
                <Typography variant="body1">
                  Camera not available
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Please allow camera access or use manual scan
                </Typography>
              </Box>
            )}

            {/* Scanning Overlay */}
            {isScanning && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                {scanProgress < 100 ? (
                  <>
                    <CircularProgress
                      size={60}
                      sx={{ mb: 2, color: 'primary.main' }}
                    />
                    <Typography variant="h6" gutterBottom>
                      Scanning Asset...
                    </Typography>
                    <Box sx={{ width: '60%', mb: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={scanProgress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(255,255,255,0.3)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>
                    <Typography variant="caption">
                      {scanProgress}% Complete
                    </Typography>
                  </>
                ) : (
                  <>
                    <CheckIcon sx={{ fontSize: 60, mb: 2, color: 'success.main' }} />
                    <Typography variant="h6" gutterBottom>
                      Asset Detected!
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {mockAssetData.displayName}
                    </Typography>
                    <Typography variant="caption" display="block">
                      Type: {mockAssetData.assetType.toUpperCase()}
                    </Typography>
                    <Typography variant="caption" display="block">
                      Asset ID: {mockAssetData.assetId}
                    </Typography>
                    {mockAssetData.licensePlate && (
                      <Typography variant="caption" display="block">
                        License: {mockAssetData.licensePlate}
                      </Typography>
                    )}
                    <Typography variant="caption" sx={{ mt: 2, opacity: 0.8 }}>
                      Redirecting to inspection form...
                    </Typography>
                  </>
                )}
              </Box>
            )}

            {/* Scan Frame Overlay */}
            {hasCamera && !isScanning && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 200,
                  height: 200,
                  border: '2px solid',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -2,
                    left: -2,
                    right: -2,
                    bottom: -2,
                    border: '2px solid transparent',
                    borderTop: '2px solid',
                    borderLeft: '2px solid',
                    borderColor: 'primary.main',
                    borderRadius: 2,
                    borderBottomColor: 'transparent',
                    borderRightColor: 'transparent',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: -2,
                    left: -2,
                    right: -2,
                    bottom: -2,
                    border: '2px solid transparent',
                    borderBottom: '2px solid',
                    borderRight: '2px solid',
                    borderColor: 'primary.main',
                    borderRadius: 2,
                    borderTopColor: 'transparent',
                    borderLeftColor: 'transparent',
                  },
                }}
              />
            )}
          </Paper>

          {/* Action Buttons */}
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: 'center',
          }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<CameraIcon />}
              onClick={startScan}
              disabled={isScanning}
              sx={{
                minWidth: { xs: '100%', sm: 200 },
                py: 1.5,
              }}
            >
              {isScanning ? 'Scanning...' : 'Start Scan'}
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={handleManualRedirect}
              disabled={isScanning}
              sx={{
                minWidth: { xs: '100%', sm: 200 },
                py: 1.5,
              }}
            >
              Manual Scan (Demo)
            </Button>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              textAlign: 'center',
              mt: 2
            }}
          >
            For demo purposes, scanning will automatically redirect after 5 seconds
          </Typography>
        </CardContent>
      </Card>
    </>
  );
}