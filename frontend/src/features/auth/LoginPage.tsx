import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, Divider, Chip } from '@mui/material';
import { Stars } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const TEST_ACCOUNTS = [
  { label: 'Admin', email: 'admin@fidelilink.fr', password: 'Admin2025!', color: '#DC2626' },
  { label: 'Commerçant', email: 'martin@boulangerie.fr', password: 'Merchant2025!', color: '#D97706' },
  { label: 'Client', email: 'sophie@test.fr', password: 'Client2025!', color: '#059669' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(email, password);
      navigate('/app');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally { setLoading(false); }
  };

  const quickLogin = (acc: typeof TEST_ACCOUNTS[0]) => {
    setEmail(acc.email); setPassword(acc.password);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0D1B2A', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{ bgcolor: 'primary.main', p: 1, borderRadius: 1.5 }}>
              <Stars sx={{ color: 'white', fontSize: 22 }} />
            </Box>
            <Typography variant="h5" fontWeight={700}>FidéliLink</Typography>
          </Box>
          <Typography variant="h6" fontWeight={600} gutterBottom>Connexion</Typography>
          <Typography color="text.secondary" fontSize={14} mb={3}>
            Connectez-vous à votre espace FidéliLink
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField label="Email" type="email" fullWidth value={email} onChange={e => setEmail(e.target.value)}
              required margin="normal" size="small" />
            <TextField label="Mot de passe" type="password" fullWidth value={password} onChange={e => setPassword(e.target.value)}
              required margin="normal" size="small" />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, py: 1.2 }} disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <Divider sx={{ my: 3 }}><Typography fontSize={12} color="text.secondary">Comptes de test</Typography></Divider>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {TEST_ACCOUNTS.map(acc => (
              <Chip key={acc.label} label={acc.label} onClick={() => quickLogin(acc)} size="small"
                sx={{ bgcolor: acc.color, color: 'white', cursor: 'pointer', '&:hover': { opacity: 0.85 } }} />
            ))}
          </Box>

          <Typography align="center" fontSize={14} sx={{ mt: 3 }} color="text.secondary">
            Pas encore de compte ?{' '}
            <Link to="/register" style={{ color: '#639922', fontWeight: 600 }}>Inscription</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}