import { useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip, Button, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Slider } from '@mui/material';
import { Stars, SwapHoriz, Warning } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loyaltyApi } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';

export default function LoyaltyPage() {
  const { user, updateUser } = useAuth();
  const qc = useQueryClient();
  const [convertDialog, setConvertDialog] = useState<{ open: boolean; balance: any }>({ open: false, balance: null });
  const [peAmount, setPeAmount] = useState(10);
  const [step, setStep] = useState(1); // 1=form, 2=warning, 3=confirm
  const [error, setError] = useState('');

  const { data: balances = [] } = useQuery({ queryKey: ['loyalty', 'balances'], queryFn: () => loyaltyApi.getBalances().then(r => r.data) });

  const convertMutation = useMutation({
    mutationFn: () => loyaltyApi.convert(convertDialog.balance?.merchantId, peAmount),
    onSuccess: (res) => {
      const data = res.data;
      if (data.success) {
        updateUser({ universalPoints: (user?.universalPoints || 0) + data.puGained });
        qc.invalidateQueries({ queryKey: ['loyalty', 'balances'] });
        setConvertDialog({ open: false, balance: null });
        setStep(1);
      } else {
        setError('Solde PE insuffisant');
      }
    }
  });

  const openConvert = (balance: any) => {
    setPeAmount(Math.min(10, balance.balance));
    setStep(1); setError('');
    setConvertDialog({ open: true, balance });
  };

  const puGained = Math.floor(peAmount * 0.7);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>Mes Points</Typography>
          <Typography color="text.secondary">Gérez vos Points Enseigne et Universels</Typography>
        </Box>
        <Card sx={{ bgcolor: 'primary.main', color: 'white', minWidth: 180 }}>
          <CardContent sx={{ py: 1.5, textAlign: 'center' }}>
            <Typography fontSize={12} sx={{ opacity: 0.85 }}>Points Universels</Typography>
            <Typography variant="h4" fontWeight={700}>{user?.universalPoints || 0} PU</Typography>
          </CardContent>
        </Card>
      </Box>

      <Typography variant="h6" fontWeight={600} gutterBottom>Points Enseigne (PE)</Typography>
      <Grid container spacing={2}>
        {balances.length === 0 && (
          <Grid item xs={12}>
            <Alert severity="info">Vous n avez pas encore de Points Enseigne. Scannez votre carte chez une enseigne partenaire !</Alert>
          </Grid>
        )}
        {balances.map((b: any) => (
          <Grid item xs={12} sm={6} md={4} key={b.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography fontWeight={600}>{b.merchant?.name}</Typography>
                    <Typography color="text.secondary" fontSize={13}>{b.merchant?.category}</Typography>
                  </Box>
                  <Chip label={`${b.balance} PE`} color="primary" fontWeight={700} />
                </Box>
                <Box sx={{ height: 6, bgcolor: '#e5e7eb', borderRadius: 3, mb: 1.5, overflow: 'hidden' }}>
                  <Box sx={{ height: '100%', width: `${Math.min(100, (b.balance / 100) * 100)}%`, bgcolor: '#639922', borderRadius: 3 }} />
                </Box>
                <Button size="small" variant="outlined" startIcon={<SwapHoriz />} onClick={() => openConvert(b)}
                  disabled={b.balance < 1} fullWidth>
                  Convertir en PU
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Convert Dialog */}
      <Dialog open={convertDialog.open} onClose={() => setConvertDialog({ open: false, balance: null })} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SwapHoriz color="primary" />
          Convertir des PE en PU
        </DialogTitle>
        <DialogContent>
          {step === 1 && (
            <Box>
              <Typography color="text.secondary" fontSize={14} mb={2}>
                Chez <strong>{convertDialog.balance?.merchant?.name}</strong> — Solde actuel : <strong>{convertDialog.balance?.balance} PE</strong>
              </Typography>
              <Typography fontSize={13} gutterBottom>Combien de PE voulez-vous convertir ?</Typography>
              <Slider value={peAmount} min={1} max={convertDialog.balance?.balance || 1}
                onChange={(_, v) => setPeAmount(v as number)} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography color="error.main" fontWeight={700}>{peAmount} PE</Typography>
                  <Typography fontSize={12} color="text.secondary">Points perdus</Typography>
                </Box>
                <Typography color="text.secondary" sx={{ alignSelf: 'center' }}>→</Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography color="primary.main" fontWeight={700}>{puGained} PU</Typography>
                  <Typography fontSize={12} color="text.secondary">Points gagnés</Typography>
                </Box>
              </Box>
              <Typography align="center" fontSize={12} color="warning.main" mt={1}>
                Taux : 10 PE = 7 PU (perte de 30%)
              </Typography>
            </Box>
          )}
          {step === 2 && (
            <Alert severity="warning" icon={<Warning />}>
              <Typography fontWeight={600} mb={1}>⚠️ Attention avant de confirmer !</Typography>
              <Typography fontSize={13}>
                En convertissant <strong>{peAmount} PE</strong> chez {convertDialog.balance?.merchant?.name}, vous perdrez vos avantages exclusifs liés à cette enseigne.
              </Typography>
              <Typography fontSize={13} mt={1} fontWeight={500}>
                Cette action est <strong>irréversible</strong>.
              </Typography>
            </Alert>
          )}
          {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setConvertDialog({ open: false, balance: null }); setStep(1); }}>Annuler</Button>
          {step === 1 && <Button variant="outlined" color="warning" onClick={() => setStep(2)}>Continuer</Button>}
          {step === 2 && (
            <Button variant="contained" color="error" onClick={() => convertMutation.mutate()} disabled={convertMutation.isPending}>
              {convertMutation.isPending ? 'Conversion...' : 'Confirmer la perte de mes avantages'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}