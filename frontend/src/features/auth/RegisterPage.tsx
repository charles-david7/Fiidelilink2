import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Stars } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', role: 'client' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try { await register(form); navigate('/app'); }
    catch (err: any) { setError(err.response?.data?.message || 'Erreur lors de l\'inscription'); }
    finally { setLoading(false); }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0D1B2A', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{ bgcolor: 'primary.main', p: 1, borderRadius: 1.5 }}><Stars sx={{ color: 'white', fontSize: 22 }} /></Box>
            <Typography variant="h5" fontWeight={700}>FidéliLink</Typography>
          </Box>
          <Typography variant="h6" fontWeight={600} gutterBottom>Créer un compte</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 1 }}>
              <TextField label="Prénom" size="small" required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
              <TextField label="Nom" size="small" required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
            </Box>
            <TextField label="Email" type="email" fullWidth size="small" required margin="normal" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <TextField label="Mot de passe" type="password" fullWidth size="small" required margin="normal" value={form.password} onChange={e => setForm({...form, password: e.target.value})} helperText="Minimum 8 caractères" />
            <FormControl fullWidth size="small" margin="normal">
              <InputLabel>Je suis...</InputLabel>
              <Select label="Je suis..." value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                <MenuItem value="client">Un client</MenuItem>
                <MenuItem value="merchant">Un commerçant</MenuItem>
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, py: 1.2 }} disabled={loading}>
              {loading ? 'Création...' : 'Créer mon compte'}
            </Button>
          </form>
          <Typography align="center" fontSize={14} sx={{ mt: 2 }} color="text.secondary">
            Déjà un compte ? <Link to="/login" style={{ color: '#639922', fontWeight: 600 }}>Connexion</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}