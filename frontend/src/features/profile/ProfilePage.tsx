import { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert, Chip, Divider } from '@mui/material';
import { Person, Security } from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import { usersApi } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const [form, setForm] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const updateMutation = useMutation({
    mutationFn: () => usersApi.update(form),
    onSuccess: (res) => { updateUser(form); setSuccess('Profil mis à jour'); setError(''); },
    onError: (e: any) => setError(e.response?.data?.message || 'Erreur'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => usersApi.delete(),
    onSuccess: () => logout(),
  });

  const levelColors: any = { bronze: '#CD7F32', argent: '#A8A9AD', or: '#FFD700' };

  return (
    <Box maxWidth={600}>
      <Typography variant="h5" fontWeight={700} gutterBottom>Mon profil</Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ width: 56, height: 56, bgcolor: 'primary.main', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h5" color="white" fontWeight={700}>{user?.firstName?.[0]}{user?.lastName?.[0]}</Typography>
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={600}>{user?.firstName} {user?.lastName}</Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                <Chip label={user?.role} size="small" />
                <Chip label={user?.loyaltyLevel} size="small" sx={{ bgcolor: levelColors[user?.loyaltyLevel || 'bronze'], color: 'white' }} />
              </Box>
            </Box>
          </Box>

          <Typography color="text.secondary" fontSize={13} mb={1}>{user?.email}</Typography>
          <Typography color="primary.main" fontWeight={600}>{user?.universalPoints} Points Universels</Typography>

          <Divider sx={{ my: 2 }} />

          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
            <TextField label="Prénom" size="small" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
            <TextField label="Nom" size="small" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
          </Box>
          <Button variant="contained" onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </CardContent>
      </Card>

      <Card sx={{ border: '1px solid #fee2e2' }}>
        <CardContent>
          <Typography fontWeight={600} color="error.main" gutterBottom>Zone de danger</Typography>
          <Typography color="text.secondary" fontSize={14} mb={2}>
            La suppression de votre compte est définitive et irréversible (conformité RGPD — droit à l'oubli).
          </Typography>
          <Button variant="outlined" color="error" onClick={() => { if (confirm('Êtes-vous sûr ? Cette action est irréversible.')) deleteMutation.mutate(); }}>
            Supprimer mon compte
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}