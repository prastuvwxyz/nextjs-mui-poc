'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Chip,
  Divider,
  IconButton,
  Paper,
  FormHelperText,
  Alert,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  CameraAlt as CameraIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { Breadcrumbs } from '@electrum/ui';
import type { BreadcrumbItem } from '@electrum/ui';

interface InspectionForm {
  // Asset Information
  assetType: 'motorcycle' | 'sparepart' | 'battery' | 'bss';
  assetId: string;
  licensePlate?: string; // Only for motorcycle
  model: string;
  productionYear?: string; // Only for motorcycle
  color?: string; // Only for motorcycle
  serialNumber?: string; // For sparepart, battery, bss

  // Motorcycle specific
  vin?: string;
  engineCondition?: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | '';
  bodyCondition?: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | '';
  tireCondition?: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | '';
  brakeCondition?: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | '';
  engineStarts?: boolean;
  lightsWorking?: boolean;
  hornWorking?: boolean;
  speedometerWorking?: boolean;
  hasRegistration?: boolean;
  hasInsurance?: boolean;
  hasManual?: boolean;

  // Battery specific
  batteryVoltage?: string;
  batteryCapacity?: string;
  chargingCycles?: string;

  // Spare part specific
  partNumber?: string;
  compatibility?: string;
  manufacturer?: string;

  // BSS specific
  stationId?: string;
  numberOfSlots?: string;
  powerSupply?: 'WORKING' | 'FAULTY' | '';
  networkConnection?: 'CONNECTED' | 'DISCONNECTED' | '';

  // Common fields
  physicalCondition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | '';
  functionalStatus: 'WORKING' | 'PARTIAL' | 'NOT_WORKING' | '';

  // Issues & Notes
  damageNotes: string;
  missingParts: string;
  additionalNotes: string;

  // Inspection Result
  overallCondition: 'PASS' | 'CONDITIONAL' | 'FAIL' | '';
  recommendedAction: string;
}

export default function AssetInspectionPage() {
  const params = useParams();
  const router = useRouter();

  const opnameId = params.id as string;
  const assetType = params.asset_type as string;
  const assetId = params.asset_id as string;

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Dashboard', path: '/' },
    { label: 'Stock Opname', path: '/stock-opname' },
    { label: `${opnameId}`, path: `/stock-opname/${opnameId}` },
    { label: 'Asset Inspection' },
  ];

  const getInitialFormData = (): InspectionForm => {
    const baseData: InspectionForm = {
      assetType: assetType as 'motorcycle' | 'sparepart' | 'battery' | 'bss',
      assetId: assetId || '',
      model: '',
      physicalCondition: 'GOOD',
      functionalStatus: 'WORKING',
      damageNotes: 'Minor scratches on the surface, overall in good condition.',
      missingParts: 'None observed',
      additionalNotes: 'Asset is in good working order and ready for operation.',
      overallCondition: 'PASS',
      recommendedAction: 'Asset is suitable for continued use. Schedule regular maintenance as per standard procedure.',
    };

    switch (assetType) {
      case 'motorcycle':
        return {
          ...baseData,
          model: 'VARIO-150',
          licensePlate: 'B-1234-ABC',
          productionYear: '2023',
          color: 'Red',
          vin: assetId || 'MH3JF4120LK123456',
          engineCondition: 'GOOD',
          bodyCondition: 'EXCELLENT',
          tireCondition: 'GOOD',
          brakeCondition: 'EXCELLENT',
          engineStarts: true,
          lightsWorking: true,
          hornWorking: true,
          speedometerWorking: true,
          hasRegistration: true,
          hasInsurance: true,
          hasManual: true,
        };
      case 'battery':
        return {
          ...baseData,
          model: 'Lithium Battery 48V',
          serialNumber: assetId || 'BAT-001',
          batteryVoltage: '48V',
          batteryCapacity: '20Ah',
          chargingCycles: '500',
          damageNotes: 'Battery terminals show minor corrosion, cleaned during inspection.',
          additionalNotes: 'Battery voltage and capacity within acceptable range. Charging cycles still below maximum threshold.',
        };
      case 'sparepart':
        return {
          ...baseData,
          model: 'Brake Pad Set',
          serialNumber: assetId || 'SP-001',
          partNumber: 'BP-VARIO-001',
          compatibility: 'VARIO 150/125',
          manufacturer: 'Honda',
          damageNotes: 'Packaging slightly damaged but part is intact.',
          additionalNotes: 'Spare part is genuine OEM and compatible with specified motorcycle models.',
        };
      case 'bss':
        return {
          ...baseData,
          model: 'BSS Station Type A',
          stationId: assetId || 'BSS-001',
          numberOfSlots: '8',
          powerSupply: 'WORKING',
          networkConnection: 'CONNECTED',
          physicalCondition: 'EXCELLENT',
          functionalStatus: 'WORKING',
          damageNotes: 'Station exterior shows normal wear from weather exposure.',
          additionalNotes: 'All charging slots functional. Network connectivity stable. Station ready for deployment.',
        };
      default:
        return baseData;
    }
  };

  const [formData, setFormData] = useState<InspectionForm>(getInitialFormData());

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (field: keyof InspectionForm) => (event: any) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'EXCELLENT': return 'success';
      case 'GOOD': return 'info';
      case 'FAIR': return 'warning';
      case 'POOR': return 'error';
      default: return 'default';
    }
  };

  const getOverallConditionIcon = (condition: string) => {
    switch (condition) {
      case 'PASS': return <CheckIcon sx={{ color: 'success.main' }} />;
      case 'CONDITIONAL': return <WarningIcon sx={{ color: 'warning.main' }} />;
      case 'FAIL': return <ErrorIcon sx={{ color: 'error.main' }} />;
      default: return null;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Auto redirect after showing success
      setTimeout(() => {
        router.push('/stock-opname');
      }, 2000);
    }, 1500);
  };

  const handleBack = () => {
    router.back();
  };

  if (submitSuccess) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
        textAlign: 'center'
      }}>
        <CheckIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Inspection Completed!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Asset inspection has been saved successfully.
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Redirecting to Stock Opname list...
        </Typography>
      </Box>
    );
  }

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
          Asset Inspection
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Asset Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Asset Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Asset Type"
                    value={formData.assetType.toUpperCase()}
                    disabled
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Model"
                    value={formData.model}
                    onChange={handleInputChange('model')}
                    size="small"
                  />
                </Grid>

                {/* Motorcycle specific fields */}
                {formData.assetType === 'motorcycle' && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="License Plate"
                        value={formData.licensePlate || ''}
                        onChange={handleInputChange('licensePlate')}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Production Year"
                        value={formData.productionYear || ''}
                        onChange={handleInputChange('productionYear')}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Color"
                        value={formData.color || ''}
                        onChange={handleInputChange('color')}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="VIN"
                        value={formData.vin || ''}
                        onChange={handleInputChange('vin')}
                        size="small"
                      />
                    </Grid>
                  </>
                )}

                {/* Battery specific fields */}
                {formData.assetType === 'battery' && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Serial Number"
                        value={formData.serialNumber || ''}
                        onChange={handleInputChange('serialNumber')}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Voltage"
                        value={formData.batteryVoltage || ''}
                        onChange={handleInputChange('batteryVoltage')}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Capacity"
                        value={formData.batteryCapacity || ''}
                        onChange={handleInputChange('batteryCapacity')}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Charging Cycles"
                        value={formData.chargingCycles || ''}
                        onChange={handleInputChange('chargingCycles')}
                        size="small"
                      />
                    </Grid>
                  </>
                )}

                {/* Spare part specific fields */}
                {formData.assetType === 'sparepart' && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Serial Number"
                        value={formData.serialNumber || ''}
                        onChange={handleInputChange('serialNumber')}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Part Number"
                        value={formData.partNumber || ''}
                        onChange={handleInputChange('partNumber')}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Manufacturer"
                        value={formData.manufacturer || ''}
                        onChange={handleInputChange('manufacturer')}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Compatibility"
                        value={formData.compatibility || ''}
                        onChange={handleInputChange('compatibility')}
                        size="small"
                      />
                    </Grid>
                  </>
                )}

                {/* BSS specific fields */}
                {formData.assetType === 'bss' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Station ID"
                        value={formData.stationId || ''}
                        onChange={handleInputChange('stationId')}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Number of Slots"
                        value={formData.numberOfSlots || ''}
                        onChange={handleInputChange('numberOfSlots')}
                        size="small"
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Condition Assessment */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Condition Assessment
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                {/* Common condition fields */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Physical Condition</InputLabel>
                    <Select
                      value={formData.physicalCondition}
                      onChange={handleInputChange('physicalCondition')}
                      label="Physical Condition"
                    >
                      <MenuItem value="EXCELLENT">Excellent</MenuItem>
                      <MenuItem value="GOOD">Good</MenuItem>
                      <MenuItem value="FAIR">Fair</MenuItem>
                      <MenuItem value="POOR">Poor</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Functional Status</InputLabel>
                    <Select
                      value={formData.functionalStatus}
                      onChange={handleInputChange('functionalStatus')}
                      label="Functional Status"
                    >
                      <MenuItem value="WORKING">Working</MenuItem>
                      <MenuItem value="PARTIAL">Partial</MenuItem>
                      <MenuItem value="NOT_WORKING">Not Working</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Motorcycle specific conditions */}
                {formData.assetType === 'motorcycle' && (
                  <>
                    {[
                      { field: 'engineCondition', label: 'Engine Condition' },
                      { field: 'bodyCondition', label: 'Body Condition' },
                      { field: 'tireCondition', label: 'Tire Condition' },
                      { field: 'brakeCondition', label: 'Brake Condition' },
                    ].map(({ field, label }) => (
                      <Grid item xs={12} sm={6} key={field}>
                        <FormControl fullWidth size="small">
                          <InputLabel>{label}</InputLabel>
                          <Select
                            value={formData[field as keyof InspectionForm] || ''}
                            onChange={handleInputChange(field as keyof InspectionForm)}
                            label={label}
                          >
                            <MenuItem value="EXCELLENT">Excellent</MenuItem>
                            <MenuItem value="GOOD">Good</MenuItem>
                            <MenuItem value="FAIR">Fair</MenuItem>
                            <MenuItem value="POOR">Poor</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    ))}
                  </>
                )}

                {/* BSS specific conditions */}
                {formData.assetType === 'bss' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Power Supply</InputLabel>
                        <Select
                          value={formData.powerSupply || ''}
                          onChange={handleInputChange('powerSupply')}
                          label="Power Supply"
                        >
                          <MenuItem value="WORKING">Working</MenuItem>
                          <MenuItem value="FAULTY">Faulty</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Network Connection</InputLabel>
                        <Select
                          value={formData.networkConnection || ''}
                          onChange={handleInputChange('networkConnection')}
                          label="Network Connection"
                        >
                          <MenuItem value="CONNECTED">Connected</MenuItem>
                          <MenuItem value="DISCONNECTED">Disconnected</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </>
                )}
              </Grid>

              {/* Condition Summary */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Condition Summary:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.physicalCondition && (
                    <Chip
                      label={`Physical: ${formData.physicalCondition}`}
                      color={getConditionColor(formData.physicalCondition) as any}
                      size="small"
                    />
                  )}
                  {formData.functionalStatus && (
                    <Chip
                      label={`Functional: ${formData.functionalStatus}`}
                      color={formData.functionalStatus === 'WORKING' ? 'success' :
                             formData.functionalStatus === 'PARTIAL' ? 'warning' : 'error'}
                      size="small"
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Functional Tests - Asset Type Specific */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {formData.assetType === 'motorcycle' ? 'Functional Tests' :
                 formData.assetType === 'bss' ? 'System Tests' :
                 'Status Checks'}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={1}>
                {/* Motorcycle tests */}
                {formData.assetType === 'motorcycle' && (
                  <>
                    {[
                      { field: 'engineStarts', label: 'Engine Starts' },
                      { field: 'lightsWorking', label: 'Lights Working' },
                      { field: 'hornWorking', label: 'Horn Working' },
                      { field: 'speedometerWorking', label: 'Speedometer Working' },
                    ].map(({ field, label }) => (
                      <Grid item xs={12} key={field}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData[field as keyof InspectionForm] as boolean || false}
                              onChange={handleInputChange(field as keyof InspectionForm)}
                            />
                          }
                          label={label}
                        />
                      </Grid>
                    ))}
                  </>
                )}

                {/* Battery/Spare part generic checks */}
                {(formData.assetType === 'battery' || formData.assetType === 'sparepart') && (
                  <Grid item xs={12}>
                    <Alert severity="info">
                      For {formData.assetType} assets, refer to physical and functional condition above.
                    </Alert>
                  </Grid>
                )}

                {/* BSS specific tests */}
                {formData.assetType === 'bss' && (
                  <Grid item xs={12}>
                    <Alert severity="info">
                      BSS system status is evaluated through Power Supply and Network Connection above.
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Documentation - Only for motorcycles */}
        {formData.assetType === 'motorcycle' && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Documentation
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={1}>
                  {[
                    { field: 'hasRegistration', label: 'Has Registration' },
                    { field: 'hasInsurance', label: 'Has Insurance' },
                    { field: 'hasManual', label: 'Has Manual' },
                  ].map(({ field, label }) => (
                    <Grid item xs={12} key={field}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData[field as keyof InspectionForm] as boolean || false}
                            onChange={handleInputChange(field as keyof InspectionForm)}
                          />
                        }
                        label={label}
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Issues & Notes */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Issues & Notes
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Damage Notes"
                    multiline
                    rows={3}
                    value={formData.damageNotes}
                    onChange={handleInputChange('damageNotes')}
                    placeholder="Describe any visible damage..."
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Missing Parts"
                    multiline
                    rows={3}
                    value={formData.missingParts}
                    onChange={handleInputChange('missingParts')}
                    placeholder="List any missing parts..."
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Additional Notes"
                    multiline
                    rows={3}
                    value={formData.additionalNotes}
                    onChange={handleInputChange('additionalNotes')}
                    placeholder="Any additional observations..."
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Inspection Result */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Inspection Result
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Overall Condition</InputLabel>
                    <Select
                      value={formData.overallCondition}
                      onChange={handleInputChange('overallCondition')}
                      label="Overall Condition"
                      startAdornment={getOverallConditionIcon(formData.overallCondition)}
                    >
                      <MenuItem value="PASS">Pass</MenuItem>
                      <MenuItem value="CONDITIONAL">Conditional</MenuItem>
                      <MenuItem value="FAIL">Fail</MenuItem>
                    </Select>
                    <FormHelperText>
                      Final assessment of the asset condition
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="Recommended Action"
                    value={formData.recommendedAction}
                    onChange={handleInputChange('recommendedAction')}
                    placeholder="What action should be taken based on this inspection?"
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>

              {formData.overallCondition && (
                <Alert
                  severity={
                    formData.overallCondition === 'PASS' ? 'success' :
                    formData.overallCondition === 'CONDITIONAL' ? 'warning' : 'error'
                  }
                  sx={{ mt: 2 }}
                >
                  Asset condition marked as: <strong>{formData.overallCondition}</strong>
                  {formData.recommendedAction && (
                    <> - {formData.recommendedAction}</>
                  )}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={isSubmitting ? null : <SaveIcon />}
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.overallCondition}
              sx={{ minWidth: 150 }}
            >
              {isSubmitting ? 'Saving...' : 'Save Inspection'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}