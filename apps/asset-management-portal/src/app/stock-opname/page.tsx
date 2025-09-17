'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Chip,
  Button,
  LinearProgress,
  Tooltip,
  IconButton,
  Divider,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FileDownload as ExportIcon,
  Visibility as ViewIcon,
  CameraAlt as CameraIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams, GridActionsCellItem } from '@mui/x-data-grid';
import { Breadcrumbs } from '@electrum/ui';
import type { BreadcrumbItem } from '@electrum/ui';

const breadcrumbItems: BreadcrumbItem[] = [
  { label: 'Dashboard', path: '/' },
  { label: 'Stock Opname' },
];

interface StockOpname {
  id: string;
  assetType: string;
  createdAt: string;
  type: string;
  percentage: number;
  location: string;
  totalAssets: number;
  completedAssets: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'PENDING';
}

const mockStockOpnameData: StockOpname[] = [
  {
    id: 'OPN-ASSET-001',
    assetType: 'Motorcycle',
    createdAt: '2024-09-16T10:30:00Z',
    type: 'Weekly 10%',
    percentage: 10,
    location: 'WH-PI',
    totalAssets: 150,
    completedAssets: 45,
    status: 'IN_PROGRESS',
  },
  {
    id: 'OPN-ASSET-002',
    assetType: 'Battery',
    createdAt: '2024-09-16T08:15:00Z',
    type: 'Weekly 5%',
    percentage: 5,
    location: 'WH-PI',
    totalAssets: 80,
    completedAssets: 12,
    status: 'IN_PROGRESS',
  },
  {
    id: 'OPN-ASSET-003',
    assetType: 'Motorcycle',
    createdAt: '2024-09-15T14:15:00Z',
    type: 'Monthly Full',
    percentage: 100,
    location: 'WH-JKT',
    totalAssets: 200,
    completedAssets: 200,
    status: 'COMPLETED',
  },
  {
    id: 'OPN-ASSET-004',
    assetType: 'Battery',
    createdAt: '2024-09-15T11:30:00Z',
    type: 'Weekly 10%',
    percentage: 10,
    location: 'WH-SBY',
    totalAssets: 60,
    completedAssets: 60,
    status: 'COMPLETED',
  },
  {
    id: 'OPN-ASSET-005',
    assetType: 'Spare Part',
    createdAt: '2024-09-14T16:45:00Z',
    type: 'Weekly 5%',
    percentage: 5,
    location: 'WH-PI',
    totalAssets: 40,
    completedAssets: 8,
    status: 'IN_PROGRESS',
  },
  {
    id: 'OPN-ASSET-006',
    assetType: 'BSS',
    createdAt: '2024-09-14T09:20:00Z',
    type: 'Monthly Full',
    percentage: 100,
    location: 'WH-JKT',
    totalAssets: 5,
    completedAssets: 5,
    status: 'COMPLETED',
  },
  {
    id: 'OPN-ASSET-007',
    assetType: 'Motorcycle',
    createdAt: '2024-09-13T16:20:00Z',
    type: 'Monthly Full',
    percentage: 100,
    location: 'WH-PI',
    totalAssets: 300,
    completedAssets: 0,
    status: 'PENDING',
  },
  {
    id: 'OPN-ASSET-008',
    assetType: 'Battery',
    createdAt: '2024-09-12T13:10:00Z',
    type: 'Weekly 10%',
    percentage: 10,
    location: 'WH-SBY',
    totalAssets: 45,
    completedAssets: 35,
    status: 'IN_PROGRESS',
  },
];

const statusColors: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  COMPLETED: 'success',
  IN_PROGRESS: 'warning',
  PENDING: 'default',
};

const statusLabels: Record<string, string> = {
  COMPLETED: 'Completed',
  IN_PROGRESS: 'In Progress',
  PENDING: 'Pending',
};

export default function StockOpnamePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchTerm, setSearchTerm] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const filteredData = useMemo(() => {
    const filtered = mockStockOpnameData.filter(item => {
      const matchesSearch =
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.assetType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });

    // Sort by asset type priority: Motorcycle first, then Battery, then others
    return filtered.sort((a, b) => {
      const getPriority = (assetType: string) => {
        switch (assetType.toLowerCase()) {
          case 'motorcycle': return 1;
          case 'battery': return 2;
          case 'spare part': return 3;
          case 'bss': return 4;
          default: return 5;
        }
      };

      const priorityA = getPriority(a.assetType);
      const priorityB = getPriority(b.assetType);

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // If same priority, sort by created date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [searchTerm]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateProgress = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Opname ID',
      flex: 0.15,
      minWidth: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'assetType',
      headerName: 'Asset Type',
      flex: 0.15,
      minWidth: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => {
        const getAssetTypeColor = (assetType: string) => {
          switch (assetType.toLowerCase()) {
            case 'motorcycle': return 'primary';
            case 'battery': return 'success';
            case 'spare part': return 'info';
            case 'bss': return 'warning';
            default: return 'default';
          }
        };

        const getAssetTypeIcon = (assetType: string) => {
          switch (assetType.toLowerCase()) {
            case 'motorcycle': return '🏍️';
            case 'battery': return '🔋';
            case 'spare part': return '🔧';
            case 'bss': return '🔌';
            default: return '📦';
          }
        };

        return (
          <Chip
            label={`${getAssetTypeIcon(params.value)} ${params.value}`}
            color={getAssetTypeColor(params.value) as any}
            size="small"
            variant="outlined"
            sx={{
              fontWeight: 500,
              fontSize: '0.75rem',
              minWidth: 100,
            }}
          />
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 0.2,
      minWidth: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {formatDate(params.value)}
        </Typography>
      ),
    },
    {
      field: 'type',
      headerName: 'Opname Type',
      flex: 0.15,
      minWidth: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          color="primary"
          size="small"
          variant="outlined"
          sx={{
            fontWeight: 500,
            fontSize: '0.75rem',
          }}
        />
      ),
    },
    {
      field: 'location',
      headerName: 'Location',
      flex: 0.12,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'progress',
      headerName: 'Progress',
      flex: 0.18,
      minWidth: 140,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => {
        const completed = params.row.completedAssets;
        const total = params.row.totalAssets;
        const progress = calculateProgress(completed, total);

        return (
          <Box sx={{ width: '100%', px: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                {completed}/{total}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  backgroundColor: progress === 100 ? 'success.main' : 'primary.main',
                },
              }}
            />
          </Box>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.12,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={statusLabels[params.value as string] || params.value}
          color={statusColors[params.value as string]}
          size="small"
          sx={{
            fontWeight: 500,
            fontSize: '0.75rem',
            minWidth: 80,
          }}
        />
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      flex: 0.15,
      minWidth: 120,
      headerAlign: 'center',
      align: 'center',
      getActions: (params: any) => {
        const actions = [
          <GridActionsCellItem
            key="view"
            icon={
              <Tooltip title="View Details" arrow>
                <ViewIcon sx={{ fontSize: 18 }} />
              </Tooltip>
            }
            label="View Details"
            onClick={() => handleViewDetails(params.row)}
            showInMenu={false}
          />
        ];

        // Only show scanner action for non-completed opnames
        if (params.row.status !== 'COMPLETED') {
          actions.push(
            <GridActionsCellItem
              key="scanner"
              icon={
                <Tooltip title="Open Scanner" arrow>
                  <CameraIcon sx={{ fontSize: 18 }} />
                </Tooltip>
              }
              label="Scanner"
              onClick={() => handleOpenScanner(params.row)}
              showInMenu={false}
            />
          );
        }

        return actions;
      },
    },
  ];

  const handleViewDetails = (opname: StockOpname) => {
    console.log('View details for opname:', opname);
    // TODO: Navigate to details page
  };

  const handleOpenScanner = (opname: StockOpname) => {
    console.log('Open scanner for opname:', opname);
    window.location.href = `/stock-opname/${opname.id}/scan`;
  };

  const handleCreateOpname = () => {
    console.log('Create new stock opname');
    // TODO: Implement create functionality
  };

  const handleExport = () => {
    console.log('Export stock opname data');
    // TODO: Implement export functionality
  };

  // Helper functions for mobile list
  const getAssetTypeColor = (assetType: string) => {
    switch (assetType.toLowerCase()) {
      case 'motorcycle': return 'primary';
      case 'battery': return 'success';
      case 'spare part': return 'info';
      case 'bss': return 'warning';
      default: return 'default';
    }
  };

  const getAssetTypeIcon = (assetType: string) => {
    switch (assetType.toLowerCase()) {
      case 'motorcycle': return '🏍️';
      case 'battery': return '🔋';
      case 'spare part': return '🔧';
      case 'bss': return '🔌';
      default: return '📦';
    }
  };

  // Mobile List Component
  const MobileStockOpnameList = () => {
    const startIndex = paginationModel.page * paginationModel.pageSize;
    const endIndex = startIndex + paginationModel.pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return (
      <Box>
        {paginatedData.map((opname) => {
          const progress = calculateProgress(opname.completedAssets, opname.totalAssets);

          return (
            <Card
              key={opname.id}
              sx={{
                mb: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
                transition: 'box-shadow 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: '0 8px 25px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.05)',
                },
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: 'primary.main', mb: 0.5, fontSize: '1.1rem' }}
                    >
                      {opname.id}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={`${getAssetTypeIcon(opname.assetType)} ${opname.assetType}`}
                        color={getAssetTypeColor(opname.assetType) as any}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 500, fontSize: '0.75rem' }}
                      />
                      <Chip
                        label={statusLabels[opname.status] || opname.status}
                        color={statusColors[opname.status]}
                        size="small"
                        sx={{ fontWeight: 500, fontSize: '0.75rem' }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleViewDetails(opname)}
                      sx={{ p: 1 }}
                    >
                      <ViewIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                    {opname.status !== 'COMPLETED' && (
                      <IconButton
                        size="small"
                        onClick={() => handleOpenScanner(opname)}
                        sx={{ p: 1 }}
                      >
                        <CameraIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    )}
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={2}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Created At
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {formatDate(opname.createdAt)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Type
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {opname.type}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Location
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                        {opname.location}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Assets
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {opname.completedAssets}/{opname.totalAssets}
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Progress
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {progress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          backgroundColor: progress === 100 ? 'success.main' : 'primary.main',
                        },
                      }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          );
        })}

        {/* Mobile Pagination Controls */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Typography variant="body2" color="text.secondary">
            {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              disabled={paginationModel.page === 0}
              onClick={() => setPaginationModel(prev => ({ ...prev, page: prev.page - 1 }))}
            >
              Previous
            </Button>
            <Button
              size="small"
              variant="outlined"
              disabled={endIndex >= filteredData.length}
              onClick={() => setPaginationModel(prev => ({ ...prev, page: prev.page + 1 }))}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />

      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 600,
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
          mb: { xs: 2, sm: 3 }
        }}
      >
        Stock Opname
      </Typography>

      <Card sx={{
        mt: 3,
        mb: { xs: 3, md: 0 },
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        boxShadow: {
          xs: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
          md: '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)'
        },
        transition: 'box-shadow 0.3s ease-in-out',
        '&:hover': {
          boxShadow: '0 8px 25px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.05)',
        },
      }}>
        <CardContent>
          {/* Header Actions */}
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', lg: 'center' },
            mb: 3,
            gap: 2
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              alignItems: { xs: 'stretch', sm: 'center' },
              flex: 1
            }}>
              <TextField
                placeholder="Search opname ID, type, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  maxWidth: { xs: '100%', sm: 300, md: 400 },
                  minWidth: { xs: '100%', sm: 200 }
                }}
                size="small"
                fullWidth
              />
            </Box>

            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1,
              width: { xs: '100%', lg: 'auto' }
            }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ExportIcon />}
                onClick={handleExport}
                sx={{
                  minWidth: { xs: '100%', sm: 'auto' },
                  whiteSpace: 'nowrap'
                }}
              >
                Export
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleCreateOpname}
                sx={{
                  minWidth: { xs: '100%', sm: 'auto' },
                  whiteSpace: 'nowrap'
                }}
              >
                Create Opname
              </Button>
            </Box>
          </Box>

          {/* Responsive Data Display */}
          {isMobile ? (
            <MobileStockOpnameList />
          ) : (
            <>
              {/* Desktop Data Table */}
              <Box sx={{
                width: '100%',
                overflowX: 'auto',
                overflowY: 'hidden',
                WebkitOverflowScrolling: 'touch',
                scrollBehavior: 'smooth',
                '&::-webkit-scrollbar': {
                  height: 6,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'transparent',
                  borderRadius: 3,
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderRadius: 3,
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.5)',
                  }
                },
                willChange: 'scroll-position',
                transform: 'translateZ(0)',
              }}>
                <DataGrid
                  rows={filteredData}
                  columns={columns}
                  getRowId={(row: StockOpname) => row.id}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  pageSizeOptions={[5, 10, 25]}
                  disableRowSelectionOnClick
                  hideFooterSelectedRowCount
                  disableColumnFilter
                  disableColumnMenu
                  disableDensitySelector
                  sx={{
                    border: 'none',
                    minWidth: 'max-content',
                    width: '100%',
                    '& .MuiDataGrid-main': {
                      overflow: 'visible',
                    },
                    '& .MuiDataGrid-virtualScroller': {
                      overflow: 'auto',
                      WebkitOverflowScrolling: 'touch',
                      scrollBehavior: 'smooth',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: 'grey.50',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      fontWeight: 600,
                      position: 'sticky',
                      top: 0,
                      zIndex: 2,
                      transform: 'translateZ(0)',
                    },
                    '& .MuiDataGrid-cell': {
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      transition: 'background-color 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                    },
                    '& .MuiDataGrid-cell[data-field="id"]': {
                      justifyContent: 'center',
                    },
                    '& .MuiDataGrid-cell[data-field="assetType"]': {
                      justifyContent: 'center',
                    },
                    '& .MuiDataGrid-cell[data-field="createdAt"]': {
                      justifyContent: 'center',
                    },
                    '& .MuiDataGrid-cell[data-field="type"]': {
                      justifyContent: 'center',
                    },
                    '& .MuiDataGrid-cell[data-field="location"]': {
                      justifyContent: 'center',
                    },
                    '& .MuiDataGrid-cell[data-field="progress"]': {
                      justifyContent: 'center',
                    },
                    '& .MuiDataGrid-cell[data-field="status"]': {
                      justifyContent: 'center',
                    },
                    '& .MuiDataGrid-cell[data-field="actions"]': {
                      justifyContent: 'center',
                    },
                    '& .MuiDataGrid-row': {
                      transition: 'background-color 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                    },
                    '& .MuiDataGrid-footerContainer': {
                      borderTop: '1px solid',
                      borderColor: 'divider',
                      backgroundColor: 'background.paper',
                      position: 'sticky',
                      bottom: 0,
                      zIndex: 2,
                    },
                    '& .MuiDataGrid-virtualScrollerContent': {
                      minWidth: 'max-content',
                    },
                  }}
                />
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}