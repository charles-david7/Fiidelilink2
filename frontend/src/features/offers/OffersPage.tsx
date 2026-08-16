import { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, InputLabel, FormControl, Alert } from '@mui/material';
import { Add, LocalOffer } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { offersApi } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';

const typeLabels: any = { percent: '% Remise', fixed: 'Montant fixe', multiplier: 'Multiplicateur de points' };

export default function OffersPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [dialog, setDialog] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', type: 'percent', value: 10, isActive: true });
  const [error, setError] = useState('');

  const { data: offers = [] } = useQuery({ queryKey: ['offers'], queryFn: () => offersApi.getAll().then(r => r.data) });

  const createMutation = useMutation({
    mutationFn: () => offersApi.create(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['offers'] }); setDialog(false); setError(''); },
    onError: (e: any) => setError(e.response?.data?.message || 'Erreur'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => offersApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['offers'] }),
  });

  const typeColor: any = { percent: 'success', fixed: 'info', multiplier: 'warning' };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>Offres promotionnelles</Typography>
          <Typography color="text.secondary">
            {user?.role === 'merchant' ? 'Gérez vos offres et promotions' : 'Découvrez les offres du réseau'}
          </Typography>
        </Box>
        {user?.role === 'merchant' && (
          <Button variant="contained" startIcon={<Add />} onClick={() => setDialog(true)}>Nouvelle offre</Button>
        )}
      </Box>

      <Grid container spacing={2}>
        {offers.map((offer: any) => (
          <Grid item xs={12} sm={6} md={4} key={offer.id}>
            <Card sx={{ height: '100%', border: offer.isSponsored ? '2px solid #639922' : 'none' }}>
              <CardContent>
                {offer.isSponsored && <Chip label="Sponsorisé" size="small" color="primary" sx={{ mb: 1 }} />}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography fontWeight={600} fontSize={14}>{offer.title}</Typography>
                  <Chip label={offer.type === 'percent' ? `-${offer.value}%` : offer.type === 'multiplier' ? `×${offer.value}` : `${offer.value}€ off`}
                    size="small" color={typeColor[offer.type]} />
                </Box>
                {offer.description && <Typography color="text.secondary" fontSize={13} mb={1.5}>{offer.description}</Typography>}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                  <Chip label={offer.merchant?.name || 'Mon enseigne'} size="small" variant="outlined" />
                  <Chip label={typeLabels[offer.type]} size="small" />
                </Box>
                {user?.role === 'merchant' && offer.merchant?.userId === user?.id && (
                  <Button size="small" color="error" sx={{ mt: 1.5 }} onClick={() => deleteMutation.mutate(offer.id)}>
                    Supprimer
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
        {offers.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <LocalOffer sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              <Typography color="text.secondary">Aucune offre disponible</Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Créer une nouvelle offre</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField label="Titre de l'offre" fullWidth size="small" margin="normal" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          <TextField label="Description" fullWidth size="small" margin="normal" multiline rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <FormControl fullWidth size="small" margin="normal">
            <InputLabel>Type d'offre</InputLabel>
            <Select label="Type d'offre" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              <MenuItem value="percent">Remise en pourcentage (ex: -10%)</MenuItem>
              <MenuItem value="fixed">Remise fixe (ex: -5€)</MenuItem>
              <MenuItem value="multiplier">Multiplicateur de points (ex: ×2)</MenuItem>
            </Select>
          </FormControl>
          <TextField label={form.type === 'percent' ? 'Pourcentage (%)' : form.type === 'multiplier' ? 'Multiplicateur' : 'Montant (€)'}
            type="number" fullWidth size="small" margin="normal" value={form.value}
            onChange={e => setForm({...form, value: parseFloat(e.target.value)})} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(false)}>Annuler</Button>
          <Button variant="contained" onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.title}>
            {createMutation.isPending ? 'Création...' : 'Créer l offre'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}