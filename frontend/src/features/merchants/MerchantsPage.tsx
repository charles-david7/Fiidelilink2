import { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Chip, Button, Avatar, TextField, InputAdornment } from '@mui/material';
import { Store, Favorite, FavoriteBorder, Search } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { merchantsApi, subscriptionsApi } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';

export default function MerchantsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const { data: merchants = [] } = useQuery({ queryKey: ['merchants'], queryFn: () => merchantsApi.getAll().then(r => r.data) });
  const { data: following = [] } = useQuery({ queryKey: ['subscriptions', 'following'], queryFn: () => subscriptionsApi.getFollowing().then(r => r.data) });

  const followMutation = useMutation({
    mutationFn: (merchantId: string) => subscriptionsApi.follow(merchantId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subscriptions', 'following'] }),
  });

  const isFollowing = (id: string) => following.some((m: any) => m.id === id);
  const filtered = merchants.filter((m: any) => m.name.toLowerCase().includes(search.toLowerCase()) || m.category?.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>Enseignes partenaires</Typography>
      <Typography color="text.secondary" mb={3}>Découvrez et suivez les commerces du réseau FidéliLink</Typography>

      <TextField fullWidth size="small" placeholder="Rechercher une enseigne..." value={search} onChange={e => setSearch(e.target.value)}
        InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
        sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        {filtered.map((m: any) => (
          <Grid item xs={12} sm={6} md={4} key={m.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: 'primary.light', color: 'white' }}>{m.name[0]}</Avatar>
                    <Box>
                      <Typography fontWeight={600} fontSize={14}>{m.name}</Typography>
                      <Chip label={m.category || 'Commerce'} size="small" variant="outlined" sx={{ height: 18, fontSize: 11 }} />
                    </Box>
                  </Box>
                  {user?.role === 'client' && (
                    <Button size="small" onClick={() => followMutation.mutate(m.id)}
                      sx={{ minWidth: 36, p: 0.5, color: isFollowing(m.id) ? 'error.main' : 'text.secondary' }}>
                      {isFollowing(m.id) ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                    </Button>
                  )}
                </Box>
                {m.description && (
                  <Typography color="text.secondary" fontSize={13} mb={1.5} sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {m.description}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {m.city && <Chip label={m.city} size="small" />}
                  {m.plan && <Chip label={m.plan} size="small" color={m.plan === 'pro' ? 'primary' : 'default'} />}
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mt: 1.5 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography fontWeight={700} color="primary.main" fontSize={16}>{m.followerCount}</Typography>
                    <Typography fontSize={11} color="text.secondary">abonnés</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography fontWeight={700} color="secondary.main" fontSize={16}>{m.totalScans}</Typography>
                    <Typography fontSize={11} color="text.secondary">scans</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {filtered.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Store sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              <Typography color="text.secondary">Aucune enseigne trouvée</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}