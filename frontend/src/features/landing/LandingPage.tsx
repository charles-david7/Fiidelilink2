import { Box, Container, Typography, Button, Grid, Card, CardContent, Chip } from '@mui/material';
import { Stars, Store, QrCode, SwapHoriz, Notifications, BarChart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const features = [
  { icon: <QrCode />, title: 'Scan QR universel', desc: 'Un scan en caisse suffit. Les points s attribuent instantanément en 80% PE + 20% PU.' },
  { icon: <Stars />, title: 'Points dual PE/PU', desc: 'Points Enseigne pour fidéliser, Points Universels pour explorer tout le réseau.' },
  { icon: <Store />, title: 'Réseau mutualisé', desc: 'Chaque enseigne partenaire profite de l audience de tout le réseau.' },
  { icon: <SwapHoriz />, title: 'Conversion PE → PU', desc: 'Convertissez vos points enseigne en points universels avec taux transparent.' },
  { icon: <Notifications />, title: 'Abonnements enseignes', desc: 'Suivez vos enseignes préférées et recevez leurs offres en priorité.' },
  { icon: <BarChart />, title: 'Analytics commerçant', desc: 'Tableau de bord complet : abonnés, scans, offres actives, tendances.' },
];

const plans = [
  { name: 'Starter', price: '0€', period: '/mois', features: ['1 enseigne', '100 scans/mois', 'Stats basiques', 'Accès réseau'], highlight: false },
  { name: 'Pro', price: '29€', period: '/mois', features: ['Scans illimités', 'Offres & événements', 'Abonnés enseigne', 'Analytics avancé'], highlight: true },
  { name: 'Business', price: '79€', period: '/mois', features: ['Multi-enseignes', 'API publique', 'Account manager', 'SLA 99.5%'], highlight: false },
];

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <Box>
      {/* Nav */}
      <Box sx={{ bgcolor: '#0D1B2A', py: 2, px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Stars sx={{ color: '#639922', fontSize: 28 }} />
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>FidéliLink</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} onClick={() => navigate('/login')}>Connexion</Button>
          <Button variant="contained" color="primary" onClick={() => navigate('/register')}>S inscrire</Button>
        </Box>
      </Box>

      {/* Hero */}
      <Box sx={{ bgcolor: '#0D1B2A', py: { xs: 8, md: 12 }, textAlign: 'center', px: 2 }}>
        <Chip label="Plateforme SaaS de fidélisation mutualisée" sx={{ bgcolor: 'rgba(99,153,34,0.15)', color: '#7ab52a', mb: 3, px: 2 }} />
        <Typography variant="h2" sx={{ color: 'white', fontWeight: 800, mb: 2, fontSize: { xs: 36, md: 52 } }}>
          Un seul programme,<br />
          <Box component="span" sx={{ color: '#639922' }}>toutes vos enseignes</Box>
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: 18, maxWidth: 540, mx: 'auto', mb: 4, lineHeight: 1.7 }}>
          FidéliLink démocratise la fidélisation pour les PME. Vos clients cumulent des points dans tout le réseau, vous fidélisez mieux.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="contained" size="large" onClick={() => navigate('/register')} sx={{ px: 4, py: 1.5, fontSize: 16 }}>
            Rejoindre le réseau
          </Button>
          <Button variant="outlined" size="large" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', px: 4, py: 1.5, fontSize: 16 }} onClick={() => navigate('/login')}>
            Voir la démo
          </Button>
        </Box>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" mb={6}>Tout ce dont vous avez besoin</Typography>
        <Grid container spacing={3}>
          {features.map((f) => (
            <Grid item xs={12} sm={6} md={4} key={f.title}>
              <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
                <CardContent>
                  <Box sx={{ width: 44, height: 44, bgcolor: '#f0fdf4', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#639922', mb: 2 }}>
                    {f.icon}
                  </Box>
                  <Typography fontWeight={600} mb={1}>{f.title}</Typography>
                  <Typography color="text.secondary" fontSize={14} lineHeight={1.6}>{f.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Pricing */}
      <Box sx={{ bgcolor: '#f8fafc', py: 10 }}>
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={2}>Tarifs simples et transparents</Typography>
          <Typography textAlign="center" color="text.secondary" mb={6}>Commencez gratuitement, évoluez selon vos besoins</Typography>
          <Grid container spacing={3}>
            {plans.map((p) => (
              <Grid item xs={12} md={4} key={p.name}>
                <Card sx={{ height: '100%', border: p.highlight ? '2px solid #639922' : 'none', position: 'relative' }}>
                  {p.highlight && <Chip label="Le plus populaire" size="small" color="primary" sx={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }} />}
                  <CardContent sx={{ textAlign: 'center', pt: 3 }}>
                    <Typography fontWeight={700} fontSize={18} mb={1}>{p.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', mb: 2 }}>
                      <Typography variant="h3" fontWeight={800} color={p.highlight ? 'primary.main' : 'text.primary'}>{p.price}</Typography>
                      <Typography color="text.secondary" ml={0.5}>{p.period}</Typography>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      {p.features.map(f => (
                        <Typography key={f} fontSize={14} py={0.5} sx={{ borderBottom: '1px solid #f1f5f9' }}>✓ {f}</Typography>
                      ))}
                    </Box>
                    <Button variant={p.highlight ? 'contained' : 'outlined'} fullWidth onClick={() => navigate('/register')}>
                      {p.name === 'Starter' ? 'Commencer gratuitement' : `Choisir ${p.name}`}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#0D1B2A', py: 4, textAlign: 'center' }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
          © 2025 FidéliLink — PLJ DATA · Charles · Tous droits réservés
        </Typography>
      </Box>
    </Box>
  );
}