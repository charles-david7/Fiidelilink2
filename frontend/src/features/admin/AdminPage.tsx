import { Box, Card, CardContent, Typography, Chip, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/client';

export default function AdminPage() {
  const qc = useQueryClient();
  const { data: merchants = [] } = useQuery({ queryKey: ['admin', 'merchants'], queryFn: () => adminApi.getMerchants().then(r => r.data) });

  const approveMutation = useMutation({ mutationFn: adminApi.approve, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin'] }) });
  const suspendMutation = useMutation({ mutationFn: adminApi.suspend, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin'] }) });

  const statusColor: any = { active: 'success', pending: 'warning', suspended: 'error' };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>Administration</Typography>
      <Typography color="text.secondary" mb={3}>Gestion des enseignes du réseau FidéliLink</Typography>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <Table>
            <TableHead><TableRow sx={{ bgcolor: '#0D1B2A' }}>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Enseigne</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Catégorie</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Plan</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Statut</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {merchants.map((m: any) => (
                <TableRow key={m.id} hover>
                  <TableCell><Typography fontWeight={500}>{m.name}</Typography><Typography fontSize={12} color="text.secondary">{m.city}</Typography></TableCell>
                  <TableCell>{m.category || '—'}</TableCell>
                  <TableCell><Chip label={m.plan} size="small" /></TableCell>
                  <TableCell><Chip label={m.status} size="small" color={statusColor[m.status] || 'default'} /></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {m.status !== 'active' && (
                        <Button size="small" color="success" startIcon={<CheckCircle />} onClick={() => approveMutation.mutate(m.id)}>
                          Approuver
                        </Button>
                      )}
                      {m.status !== 'suspended' && (
                        <Button size="small" color="error" startIcon={<Cancel />} onClick={() => suspendMutation.mutate(m.id)}>
                          Suspendre
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
}