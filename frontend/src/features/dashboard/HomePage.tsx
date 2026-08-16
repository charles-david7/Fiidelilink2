import { Box, Grid, Card, CardContent, Typography, Chip, Avatar, Button, Divider } from '@mui/material';
import { Stars, Store, TrendingUp, LocalOffer } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { loyaltyApi, offersApi, transactionsApi } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const levelColors: any = { bronze: '#CD7F32', argent: '#A8A9AD', or: '#FFD700' };
const levelMin: any = { bronze: 0, argent: 200, or: 500 };
const levelNext: any = { bronze: 200, argent: 500, or: 999 };

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: balances = [] } = useQuery({ queryKey: ['loyalty', 'balances'], queryFn: () => loyaltyApi.getBalances().then(r => r.data) });
  const { data: offers = [] } = useQuery({ queryKey: ['offers'], queryFn: () => offersApi.getAll().then(r => r.data) });
  const { data: transactions = [] } = useQuery({ queryKey: ['transactions', 'my'], queryFn: () => transactionsApi.getMy().then(r => r.data) });

  const level = user?.loyaltyLevel || 'bronze';
  const pts = user?.universalPoints || 0;
  const nextLevel = levelNext[level];
  const progress = Math.min(100, ((pts - levelMin[level]) / (nextLevel - levelMin[level])) * 100);

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Bonjour, {user?.firstName} 👋
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Voici votre tableau de bord FidéliLink
      </Typography>

      <Grid container spacing={2.5} mb={3}>
        {/* PU Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #639922 0%, #4a7018 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography fontSize={13} sx={{ opacity: 0.85 }}>Points Universels</Typography>
                  <Typography variant="h3" fontWeight={700}>{pts}</Typography>
                  <Typography fontSize={12} sx={{ opacity: 0.75 }}>utilisables partout dans le réseau</Typography>
                </Box>
                <Stars sx={{ fontSize: 40, opacity: 0.4 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Level Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography fontWeight={600}>Niveau fidélité</Typography>
                <Chip label={level} size="small" sx={{ bgcolor: levelColors[level], color: 'white', fontWeight: 600 }} />
              </Box>
              <Box sx={{ height: 8, bgcolor: '#e5e7eb', borderRadius: 4, overflow: 'hidden', mb: 1 }}>
                <Box sx={{ height: '100%', width: `${progress}%`, bgcolor: levelColors[level], borderRadius: 4, transition: 'width 0.5s' }} />
              </Box>
              <Typography fontSize={12} color="text.secondary">
                {level !== 'or' ? `${pts} / ${nextLevel} PU pour passer ${level === 'bronze' ? 'Argent' : 'Or'}` : 'Niveau maximum atteint 🏆'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Enseignes suivies */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography fontWeight={600} gutterBottom>Mes enseignes ({balances.length})</Typography>
              {balances.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography color="text.secondary" fontSize={13} mb={1}>Aucune enseigne suivie</Typography>
                  <Button size="small" variant="outlined" onClick={() => navigate('/app/merchants')}>Découvrir</Button>
                </Box>
              ) : (
                balances.slice(0, 3).map((b: any) => (
                  <Box key={b.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 26, height: 26, bgcolor: 'primary.light', fontSize: 11 }}>
                        {b.merchant?.name?.[0]}
                      </Avatar>
                      <Typography fontSize={13}>{b.merchant?.name}</Typography>
                    </Box>
                    <Chip label={`${b.balance} PE`} size="small" color="primary" variant="outlined" />
                  </Box>
                ))
              )}
              {balances.length > 3 && (
                <Typography fontSize={12} color="text.secondary" sx={{ mt: 0.5 }}>
                  +{balances.length - 3} autre(s)
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Offres */}
      <Typography variant="h6" fontWeight={600} gutterBottom>Offres en cours</Typography>
      <Grid container spacing={2} mb={3}>
        {offers.slice(0, 3).map((offer: any) => (
          <Grid item xs={12} sm={6} md={4} key={offer.id}>
            <Card sx={{ height: '100%', border: offer.isSponsored ? '2px solid #639922' : '1px solid #e5e7eb' }}>
              <CardContent>
                {offer.isSponsored && <Chip label="Sponsorisé" size="small" color="primary" sx={{ mb: 1 }} />}
                <Typography fontWeight={600} fontSize={14} gutterBottom>{offer.title}</Typography>
                <Typography color="text.secondary" fontSize={13} mb={1.5}>{offer.description}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip label={offer.merchant?.name} size="small" variant="outlined" />
                  <Chip label={offer.type === 'percent' ? `-${offer.value}%` : offer.type === 'multiplier' ? `x${offer.value}` : `${offer.value}€`}
                    size="small" color="success" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dernières transactions */}
      {transactions.length > 0 && (
        <>
          <Typography variant="h6" fontWeight={600} gutterBottom>Activité récente</Typography>
          <Card>
            <CardContent sx={{ p: 0 }}>
              {transactions.slice(0, 5).map((tx: any, i: number) => (
                <Box key={tx.id}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                    <Box>
                      <Typography fontWeight={500} fontSize={14}>{tx.merchant?.name}</Typography>
                      <Typography color="text.secondary" fontSize={12}>
                        {new Date(tx.createdAt).toLocaleDateString('fr-FR')} — {tx.amount}€
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography color="primary.main" fontWeight={600} fontSize={13}>+{tx.merchantPoints} PE</Typography>
                      <Typography color="text.secondary" fontSize={11}>+{tx.universalPoints} PU</Typography>
                    </Box>
                  </Box>
                  {i < Math.min(transactions.length, 5) - 1 && <Divider />}
                </Box>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
}