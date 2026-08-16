import { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Chip, Button, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Event, Add, CheckCircle } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';

export default function EventsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [dialog, setDialog] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', eventDate: '', location: '', totalSlots: 0, normalPrice: 0, memberPrice: 0, isFree: true });
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);
  const [error, setError] = useState('');

  const { data: events = [] } = useQuery({ queryKey: ['events'], queryFn: () => eventsApi.getAll().then(r => r.data) });

  const registerMutation = useMutation({
    mutationFn: (id: string) => eventsApi.register(id),
    onSuccess: (_, id) => setRegisteredIds(prev => [...prev, id]),
    onError: (e: any) => alert(e.response?.data?.message || 'Erreur lors de l inscription'),
  });

  const createMutation = useMutation({
    mutationFn: () => eventsApi.create({ ...form, isFree: form.memberPrice === 0 }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['events'] }); setDialog(false); setError(''); },
    onError: (e: any) => setError(e.response?.data?.message || 'Erreur'),
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>Événements</Typography>
          <Typography color="text.secondary">Événements exclusifs des enseignes partenaires</Typography>
        </Box>
        {user?.role === 'merchant' && (
          <Button variant="contained" startIcon={<Add />} onClick={() => setDialog(true)}>Créer un événement</Button>
        )}
      </Box>

      <Grid container spacing={2}>
        {events.map((ev: any) => {
          const registered = registeredIds.includes(ev.id);
          const full = ev.totalSlots > 0 && ev.registeredCount >= ev.totalSlots;
          return (
            <Grid item xs={12} sm={6} md={4} key={ev.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography fontWeight={600} fontSize={14}>{ev.title}</Typography>
                    <Chip label={ev.isFree ? 'Gratuit' : `${ev.memberPrice}€ membre`} size="small"
                      color={ev.isFree ? 'success' : 'primary'} />
                  </Box>
                  {ev.description && <Typography color="text.secondary" fontSize={13} mb={1.5}>{ev.description}</Typography>}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
                    <Typography fontSize={13}><strong>📅</strong> {new Date(ev.eventDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</Typography>
                    {ev.location && <Typography fontSize={13}><strong>📍</strong> {ev.location}</Typography>}
                    {ev.totalSlots > 0 && <Typography fontSize={13}><strong>👥</strong> {ev.registeredCount}/{ev.totalSlots} inscrits</Typography>}
                  </Box>
                  <Chip label={ev.merchant?.name} size="small" variant="outlined" sx={{ mb: 1.5 }} />
                  {user?.role === 'client' && (
                    <Button variant={registered ? 'outlined' : 'contained'} fullWidth size="small"
                      disabled={full || registered} startIcon={registered ? <CheckCircle /> : undefined}
                      onClick={() => registerMutation.mutate(ev.id)}>
                      {registered ? 'Inscrit ✓' : full ? 'Complet' : 'S inscrire'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
        {events.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Event sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              <Typography color="text.secondary">Aucun événement à venir</Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Créer un événement</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField label="Titre" fullWidth size="small" margin="normal" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          <TextField label="Description" fullWidth size="small" margin="normal" multiline rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <TextField label="Date et heure" type="datetime-local" fullWidth size="small" margin="normal" required
            value={form.eventDate} onChange={e => setForm({...form, eventDate: e.target.value})} InputLabelProps={{ shrink: true }} />
          <TextField label="Lieu" fullWidth size="small" margin="normal" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
            <TextField label="Nombre de places (0 = illimité)" type="number" size="small" value={form.totalSlots} onChange={e => setForm({...form, totalSlots: parseInt(e.target.value)})} />
            <TextField label="Prix membre (€, 0 = gratuit)" type="number" size="small" value={form.memberPrice} onChange={e => setForm({...form, memberPrice: parseFloat(e.target.value)})} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(false)}>Annuler</Button>
          <Button variant="contained" onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.title || !form.eventDate}>
            {createMutation.isPending ? 'Création...' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}