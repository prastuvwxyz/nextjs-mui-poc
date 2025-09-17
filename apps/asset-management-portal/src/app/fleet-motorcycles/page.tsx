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
  MenuItem,
  Button,
  Avatar,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  ListItemText,
  Checkbox,
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
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams, GridActionsCellItem } from '@mui/x-data-grid';
import { Breadcrumbs } from '@electrum/ui';
import { motorcycles, statusCounts } from '@electrum/shared';
import type { Motorcycle } from '@electrum/shared';
import type { BreadcrumbItem } from '@electrum/ui';

const breadcrumbItems: BreadcrumbItem[] = [
  { label: 'Dashboard', path: '/' },
  { label: 'Fleet Motorcycles' },
];

const statusColors: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  AVAILABLE: 'warning',
  RENTED: 'success',
  RENTED_TO_PARTNER: 'success',
  IN_MAINTENANCE: 'error',
  HEAVY_DAMAGED: 'error',
  LOST: 'error',
  IN_INSPECTION: 'default',
  WRITE_OFF: 'default',
};

const statusLabels: Record<string, string> = {
  All: 'All',
  AVAILABLE: 'Available',
  RENTED: 'Rented',
  RENTED_TO_PARTNER: 'Rented to Partner',
  IN_MAINTENANCE: 'In Maintenance',
  HEAVY_DAMAGED: 'Heavy Damaged',
  LOST: 'Lost',
  IN_INSPECTION: 'In Inspection',
  WRITE_OFF: 'Write Off',
};

export default function FleetMotorcyclesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  // Get unique values for filters
  const uniqueModels = Array.from(new Set(motorcycles.map(item => item.model)));
  const uniqueLocations = Array.from(new Set(motorcycles.map(item => item.location)));

  const filteredData = useMemo(() => {
    return motorcycles.filter(item => {
      const matchesSearch =
        item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vin.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'All' || item.stockStatus === selectedStatus;
      const matchesModel = selectedModels.length === 0 || selectedModels.includes(item.model);
      const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(item.location);

      return matchesSearch && matchesStatus && matchesModel && matchesLocation;
    });
  }, [searchTerm, selectedStatus, selectedModels, selectedLocations]);

  const columns: GridColDef[] = [
    {
      field: 'licensePlate',
      headerName: 'License Plate',
      flex: 0.2, // Responsive flex for horizontal scrolling
      minWidth: 140,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'model',
      headerName: 'Model & SKU',
      flex: 0.16, // More space for complex content
      minWidth: 120,
      headerAlign: 'center',
      align: 'left',
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip
          title={`Model: ${params.row.model} | SKU: ${params.row.sku}`}
          arrow
          placement="top"
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'help' }}>
            <Avatar
              sx={{
                width: 28,
                height: 28,
                bgcolor: 'primary.main',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {params.row.model}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                {params.row.model}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  display: 'block',
                }}
              >
                {params.row.sku}
              </Typography>
            </Box>
          </Box>
        </Tooltip>
      ),
    },
    {
      field: 'productionYear',
      headerName: 'Year',
      flex: 0.1, // Small flex for year
      minWidth: 70,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'color',
      headerName: 'Color',
      flex: 0.15, // Medium flex for color
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title={params.value} arrow placement="top">
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              cursor: 'help',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {params.value}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'location',
      headerName: 'Location',
      flex: 0.12, // Small-medium flex
      minWidth: 90,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'ownerName',
      headerName: 'Owner',
      flex: 0.15, // Medium flex for owner name
      minWidth: 110,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title={`Owner: ${params.value}`} arrow placement="top">
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              cursor: 'help',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {params.value}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'stockStatus',
      headerName: 'Status',
      flex: 0.18, // More space for status chips
      minWidth: 130,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip
          title={`Status: ${statusLabels[params.value as string] || params.value}`}
          arrow
          placement="top"
        >
          <Chip
            label={statusLabels[params.value as string] || params.value}
            color={params.value === 'WRITE_OFF' ? 'default' : statusColors[params.value as string]}
            size="small"
            sx={{
              fontWeight: 500,
              fontSize: '0.75rem',
              height: 24,
              minWidth: 90,
              cursor: 'help',
              ...(params.value === 'WRITE_OFF' && {
                backgroundColor: '#000000',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#333333',
                }
              }),
              '& .MuiChip-label': {
                px: 1.5,
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }
            }}
          />
        </Tooltip>
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      flex: 0.15, // Actions flex
      minWidth: 120,
      headerAlign: 'center',
      align: 'center',
      getActions: (params: any) => [
        <GridActionsCellItem
          key="view"
          icon={<ViewIcon sx={{ fontSize: 18 }} />}
          label="View"
          onClick={() => handleViewMotorcycle(params.row)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon sx={{ fontSize: 18 }} />}
          label="Edit"
          onClick={() => handleEditMotorcycle(params.row)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon sx={{ fontSize: 18 }} />}
          label="Delete"
          onClick={() => handleDeleteMotorcycle(params.row)}
          showInMenu={false}
        />,
      ],
    },
  ];

  const handleStatusFilter = useCallback((status: string) => {
    setSelectedStatus(status);
    setPaginationModel(prev => ({ ...prev, page: 0 }));
  }, []);

  const handleModelChange = useCallback((event: any) => {
    const value = event.target.value;
    setSelectedModels(typeof value === 'string' ? value.split(',') : value);
    setPaginationModel(prev => ({ ...prev, page: 0 }));
  }, []);

  const handleLocationChange = useCallback((event: any) => {
    const value = event.target.value;
    setSelectedLocations(typeof value === 'string' ? value.split(',') : value);
    setPaginationModel(prev => ({ ...prev, page: 0 }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedStatus('All');
    setSelectedModels([]);
    setSelectedLocations([]);
    setSearchTerm('');
    setPaginationModel(prev => ({ ...prev, page: 0 }));
  }, []);

  const handleViewMotorcycle = (motorcycle: Motorcycle) => {
    console.log('View motorcycle:', motorcycle);
    // TODO: Implement view functionality
  };

  const handleEditMotorcycle = (motorcycle: Motorcycle) => {
    console.log('Edit motorcycle:', motorcycle);
    // TODO: Implement edit functionality
  };

  const handleDeleteMotorcycle = (motorcycle: Motorcycle) => {
    console.log('Delete motorcycle:', motorcycle);
    // TODO: Implement delete functionality
  };

  // Mobile List Component
  const MobileMotorcycleList = () => {
    const startIndex = paginationModel.page * paginationModel.pageSize;
    const endIndex = startIndex + paginationModel.pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return (
      <Box>
        {paginatedData.map((motorcycle) => (
          <Card
            key={motorcycle.licensePlate}
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
                    {motorcycle.licensePlate}
                  </Typography>
                  <Chip
                    label={statusLabels[motorcycle.stockStatus] || motorcycle.stockStatus}
                    color={motorcycle.stockStatus === 'WRITE_OFF' ? 'default' : statusColors[motorcycle.stockStatus]}
                    size="small"
                    sx={{
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      height: 24,
                      ...(motorcycle.stockStatus === 'WRITE_OFF' && {
                        backgroundColor: '#000000',
                        color: '#ffffff',
                      }),
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleViewMotorcycle(motorcycle)}
                    sx={{ p: 1 }}
                  >
                    <ViewIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleEditMotorcycle(motorcycle)}
                    sx={{ p: 1 }}
                  >
                    <EditIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteMotorcycle(motorcycle)}
                    sx={{ p: 1 }}
                  >
                    <DeleteIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: 'primary.main',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                    }}
                  >
                    {motorcycle.model}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {motorcycle.model}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      SKU: {motorcycle.sku}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Year
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {motorcycle.productionYear}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Color
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {motorcycle.color}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Location
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                      {motorcycle.location}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Owner
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {motorcycle.ownerName}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}

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
        Fleet Motorcycles
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
                  placeholder="Search license plate, model, SKU..."
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

                <FormControl
                  size="small"
                  sx={{
                    minWidth: { xs: '100%', sm: 120 },
                    maxWidth: { xs: '100%', sm: 150 }
                  }}
                >
                  <InputLabel>Model</InputLabel>
                  <Select
                    multiple
                    value={selectedModels}
                    onChange={handleModelChange}
                    input={<OutlinedInput label="Model" />}
                    renderValue={(selected) =>
                      selected.length === 0 ? 'All Models' :
                      selected.length === 1 ? selected[0] :
                      `${selected.length} selected`
                    }
                  >
                    {uniqueModels.map((model) => (
                      <MenuItem key={model} value={model}>
                        <Checkbox checked={selectedModels.indexOf(model) > -1} />
                        <ListItemText primary={model} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl
                  size="small"
                  sx={{
                    minWidth: { xs: '100%', sm: 140 },
                    maxWidth: { xs: '100%', sm: 160 }
                  }}
                >
                  <InputLabel>Location</InputLabel>
                  <Select
                    multiple
                    value={selectedLocations}
                    onChange={handleLocationChange}
                    input={<OutlinedInput label="Location" />}
                    renderValue={(selected) =>
                      selected.length === 0 ? 'All Locations' :
                      selected.length === 1 ? selected[0] :
                      `${selected.length} selected`
                    }
                  >
                    {uniqueLocations.map((location) => (
                      <MenuItem key={location} value={location}>
                        <Checkbox checked={selectedLocations.indexOf(location) > -1} />
                        <ListItemText primary={location} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={clearAllFilters}
                  disabled={
                    selectedStatus === 'All' &&
                    selectedModels.length === 0 &&
                    selectedLocations.length === 0 &&
                    searchTerm === ''
                  }
                  sx={{
                    minWidth: { xs: '100%', sm: 'auto' },
                    whiteSpace: 'nowrap'
                  }}
                >
                  Clear Filters
                </Button>
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
                  sx={{
                    minWidth: { xs: '100%', sm: 'auto' },
                    whiteSpace: 'nowrap'
                  }}
                >
                  Add Motorcycle
                </Button>
              </Box>
            </Box>

            {/* Status Tabs */}
            <Box sx={{
              display: 'flex',
              gap: { xs: 0.5, sm: 1 },
              mb: 3,
              flexWrap: 'wrap',
              '& .MuiChip-root': {
                fontSize: { xs: '0.7rem', sm: '0.8125rem' },
                height: { xs: 28, sm: 32 },
              }
            }}>
              {Object.entries(statusCounts).map(([status, count]) => (
                <Chip
                  key={status}
                  label={`${statusLabels[status] || status} (${count})`}
                  onClick={() => handleStatusFilter(status)}
                  color={selectedStatus === status ?
                    (status === 'All' ? 'primary' : statusColors[status] || 'default') :
                    'default'
                  }
                  variant={selectedStatus === status ? 'filled' : 'outlined'}
                  size="small"
                  sx={{
                    fontWeight: 500,
                    cursor: 'pointer',
                    ...(selectedStatus === status && status === 'WRITE_OFF' && {
                      backgroundColor: '#000000',
                      color: '#ffffff',
                      '&:hover': {
                        backgroundColor: '#333333',
                      }
                    }),
                    ...((selectedStatus !== status || status !== 'WRITE_OFF') && {
                      '&:hover': {
                        backgroundColor: selectedStatus !== status ? 'action.hover' : undefined,
                      }
                    })
                  }}
                />
              ))}
            </Box>

            {/* Responsive Data Display */}
            {isMobile ? (
              <MobileMotorcycleList />
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
                    getRowId={(row: Motorcycle) => row.licensePlate}
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
                      '& .MuiDataGrid-cell[data-field="licensePlate"]': {
                        justifyContent: 'center',
                      },
                      '& .MuiDataGrid-cell[data-field="productionYear"]': {
                        justifyContent: 'center',
                      },
                      '& .MuiDataGrid-cell[data-field="color"]': {
                        justifyContent: 'left',
                      },
                      '& .MuiDataGrid-cell[data-field="location"]': {
                        justifyContent: 'center',
                      },
                      '& .MuiDataGrid-cell[data-field="ownerName"]': {
                        justifyContent: 'left',
                      },
                      '& .MuiDataGrid-cell[data-field="stockStatus"]': {
                        justifyContent: 'center',
                      },
                      '& .MuiDataGrid-cell[data-field="actions"]': {
                        justifyContent: 'center',
                      },
                      '& .MuiDataGrid-cell[data-field="model"]': {
                        justifyContent: 'flex-start',
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