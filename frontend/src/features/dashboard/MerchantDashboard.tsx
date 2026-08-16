import { Box, Grid, Card, CardContent, Typography, Chip, Button, Alert } from '@mui/material';
import { Store, QrCode, LocalOffer, People, BarChart } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { merchantsApi, offersApi, transactionsApi } from '../../api/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { QRCodeSVG } from 'qrcode.react';

export default function MerchantDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: dashboard } = useQuery({ queryKey: ['merchant', 'dashboard'], queryFn: () => merchantsApi.getDashboard().then(r => r.data) });
  const { data: offers = [] } = useQuery({ queryKey: ['offers', 'my'], queryFn: () => offersApi.getAll().then(r => r.data) });
  const { data: transactions = [] } = useQuery({ queryKey: ['transactions', 'merchant'], queryFn: () => transactionsApi.getMerchant().then(r => r.data) });

  if (!dashboard?.merchant) {
    return (
      <Box>
        <Typography variant="h5" fontWeight={700} gutterBottom>Bienvenue !</Typography>
        <Alert severity="info" sx={{ mb: 2 }}>Vous n avez pas encore d'enseigne configurée.</Alert>
        <Button variant="contained" onClick={() => navigate('/app/merchants')}>Créer mon enseigne</Button>
      </Box>
    );
  }

  const { merchant, stats } = dashboard;
  const statusColor: any = { active: 'success', pending: 'warning', suspended: 'error' };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>{merchant.name}</Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
            <Chip label={merchant.plan} size="small" color="primary" />
            <Chip label={merchant.status} size="small" color={statusColor[merchant.status] || 'default'} />
          </Box>
        </Box>
        <Button variant="contained" startIcon={<QrCode />} onClick={() => navigate('/app/scan')}>
          Scanner un client
        </Button>
      </Box>

      {merchant.status === 'pending' && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Votre enseigne est en attente de validation par un administrateur.
        </Alert>
      )}

      <Grid container spacing={2.5} mb={3}>
        {[
          { label: 'Abonnés', value: stats.followers, icon: <People />, color: '#639922' },
          { label: 'Scans total', value: stats.totalScans, icon: <QrCode />, color: '#1A56DB' },
          { label: 'Offres actives', value: offers.filter((o: any) => o.isActive).length, icon: <LocalOffer />, color: '#D97706' },
          { label: 'Transactions', value: transactions.length, icon: <BarChart />, color: '#059669' },
        ].map((stat) => (
          <Grid item xs={6} md={3} key={stat.label}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
                <Box sx={{ color: stat.color, mb: 0.5 }}>{stat.icon}</Box>
                <Typography variant="h4" fontWeight={700} color={stat.color}>{stat.value}</Typography>
                <Typography fontSize={13} color="text.secondary">{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography fontWeight={600} gutterBottom>QR Code Caisse</Typography>
              <Typography color="text.secondary" fontSize={13} mb={2}>
                Affichez ce QR code en caisse. Vos clients le scannent pour gagner des points.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 2 }}>
                <QRCodeSVG value={`FIDELILINK:MERCHANT:${merchant.id}`} size={160} />
              </Box>
              <Typography align="center" fontSize={11} color="text.secondary" mt={1}>{merchant.id}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography fontWeight={600} gutterBottom>Offres récentes</Typography>
              {offers.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography color="text.secondary" fontSize={13} mb={1}>Aucune offre créée</Typography>
                  <Button size="small" variant="outlined" onClick={() => navigate('/app/offers')}>Créer une offre</Button>
                </Box>
              ) : (
                offers.slice(0, 4).map((o: any) => (
                  <Box key={o.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid #f1f5f9' }}>
                    <Typography fontSize={13} fontWeight={500}>{o.title}</Typography>
                    <Chip label={o.isActive ? 'Active' : 'Inactive'} size="small" color={o.isActive ? 'success' : 'default'} />
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}