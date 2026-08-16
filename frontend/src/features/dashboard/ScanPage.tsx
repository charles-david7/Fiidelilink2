import { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert, Chip, Divider } from '@mui/material';
import { QrCode, CheckCircle } from '@mui/icons-material';
import { transactionsApi, merchantsApi } from '../../api/client';
import { useQuery } from '@tanstack/react-query';

export default function ScanPage() {
  const [merchantId, setMerchantId] = useState('');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { data: myMerchant } = useQuery({ queryKey: ['merchant', 'profile'], queryFn: () => merchantsApi.getMyMerchant().then(r => r.data) });

  const handleScan = async () => {
    setError(''); setResult(null); setLoading(true);
    try {
      const targetId = merchantId || myMerchant?.id;
      if (!targetId) { setError('Aucune enseigne trouvée'); return; }
      const { data } = await transactionsApi.scan(targetId, parseFloat(amount));
      setResult(data);
      setAmount('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du scan');
    } finally { setLoading(false); }
  };

  return (
    <Box maxWidth={500}>
      <Typography variant="h5" fontWeight={700} gutterBottom>Scanner un achat</Typography>
      <Typography color="text.secondary" mb={3}>
        Entrez le montant de l'achat pour attribuer les points PE et PU au client.
      </Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <QrCode color="primary" />
            <Typography fontWeight={600}>Attribution de points</Typography>
          </Box>

          <TextField label="ID Client (QR scanné)" fullWidth size="small" value={merchantId}
            onChange={e => setMerchantId(e.target.value)} sx={{ mb: 2 }}
            helperText="Laissez vide pour utiliser votre enseigne" />

          <TextField label="Montant de l'achat (€)" type="number" fullWidth size="small"
            value={amount} onChange={e => setAmount(e.target.value)}
            inputProps={{ min: 0.01, step: 0.01 }} />

          {amount && parseFloat(amount) > 0 && (
            <Box sx={{ mt: 2, p: 1.5, bgcolor: '#f0fdf4', borderRadius: 2, border: '1px solid #bbf7d0' }}>
              <Typography fontSize={13} color="text.secondary" mb={0.5}>Points qui seront attribués :</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box>
                  <Typography fontWeight={700} color="primary.main">{Math.floor(parseFloat(amount) * 0.8)} PE</Typography>
                  <Typography fontSize={11} color="text.secondary">Points Enseigne (80%)</Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography fontWeight={700} color="#1A56DB">{Math.floor(parseFloat(amount) * 0.2)} PU</Typography>
                  <Typography fontSize={11} color="text.secondary">Points Universels (20%)</Typography>
                </Box>
              </Box>
            </Box>
          )}

          <Button variant="contained" fullWidth sx={{ mt: 2, py: 1.2 }} onClick={handleScan}
            disabled={loading || !amount}>
            {loading ? 'Attribution...' : 'Attribuer les points'}
          </Button>
        </CardContent>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {result && (
        <Alert severity="success" icon={<CheckCircle />}>
          <Typography fontWeight={600}>{result.message}</Typography>
          <Typography fontSize={13} mt={0.5}>Transaction enregistrée avec succès</Typography>
        </Alert>
      )}
    </Box>
  );
}