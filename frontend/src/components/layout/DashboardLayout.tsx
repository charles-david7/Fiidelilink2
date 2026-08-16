import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Typography, IconButton, Avatar,
  Chip, Divider, useTheme, useMediaQuery, Menu, MenuItem
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard, Store, LocalOffer, Stars,
  Event, QrCode, Person, AdminPanelSettings, Logout, ChevronLeft
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const DRAWER_WIDTH = 240;

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const navItems = [
    { label: 'Tableau de bord', icon: <Dashboard />, path: '/app' },
    { label: 'Enseignes', icon: <Store />, path: '/app/merchants' },
    { label: 'Offres', icon: <LocalOffer />, path: '/app/offers' },
    { label: 'Mes Points', icon: <Stars />, path: '/app/loyalty' },
    { label: 'Événements', icon: <Event />, path: '/app/events' },
    ...(user?.role === 'merchant' ? [{ label: 'Scanner', icon: <QrCode />, path: '/app/scan' }] : []),
    ...(user?.role === 'admin' ? [{ label: 'Admin', icon: <AdminPanelSettings />, path: '/app/admin' }] : []),
  ];

  const levelColors: any = { bronze: '#CD7F32', argent: '#A8A9AD', or: '#FFD700' };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'secondary.main' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 32, height: 32, bgcolor: 'primary.main', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Stars sx={{ color: 'white', fontSize: 18 }} />
        </Box>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, fontSize: 18 }}>
          FidéliLink
        </Typography>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: 'rgba(255,255,255,0.07)', borderRadius: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: 14 }}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </Avatar>
          <Box>
            <Typography sx={{ color: 'white', fontSize: 13, fontWeight: 600 }}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Chip label={user?.loyaltyLevel || 'bronze'} size="small"
              sx={{ height: 18, fontSize: 10, bgcolor: levelColors[user?.loyaltyLevel || 'bronze'], color: 'white', mt: 0.3 }} />
          </Box>
        </Box>
        {user?.role === 'client' && (
          <Box sx={{ mt: 1.5, p: 1.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2, textAlign: 'center' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Points Universels</Typography>
            <Typography sx={{ color: 'primary.light', fontSize: 22, fontWeight: 700 }}>
              {user?.universalPoints} PU
            </Typography>
          </Box>
        )}
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <List sx={{ flex: 1, px: 1, py: 1 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.3 }}>
              <ListItemButton
                onClick={() => { navigate(item.path); if (isMobile) setMobileOpen(false); }}
                sx={{
                  borderRadius: 2, color: active ? 'white' : 'rgba(255,255,255,0.6)',
                  bgcolor: active ? 'primary.main' : 'transparent',
                  '&:hover': { bgcolor: active ? 'primary.dark' : 'rgba(255,255,255,0.08)', color: 'white' },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 36, '& svg': { fontSize: 20 } }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 600 : 400 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <List sx={{ px: 1, py: 1 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/app/profile')} sx={{ borderRadius: 2, color: 'rgba(255,255,255,0.6)', '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: 'white' } }}>
            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}><Person sx={{ fontSize: 20 }} /></ListItemIcon>
            <ListItemText primary="Mon profil" primaryTypographyProps={{ fontSize: 14 }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={logout} sx={{ borderRadius: 2, color: 'rgba(255,255,255,0.6)', '&:hover': { bgcolor: 'rgba(255,0,0,0.15)', color: '#ff6b6b' } }}>
            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}><Logout sx={{ fontSize: 20 }} /></ListItemIcon>
            <ListItemText primary="Déconnexion" primaryTypographyProps={{ fontSize: 14 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {isMobile && (
        <AppBar position="fixed" sx={{ bgcolor: 'secondary.main', boxShadow: 'none', zIndex: (t) => t.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton color="inherit" onClick={() => setMobileOpen(!mobileOpen)} edge="start" sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
            <Stars sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>FidéliLink</Typography>
          </Toolbar>
        </AppBar>
      )}

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer variant={isMobile ? 'temporary' : 'permanent'} open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', border: 'none' } }}>
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{
        flexGrow: 1, p: 3, mt: { xs: 7, md: 0 },
        maxWidth: `calc(100vw - ${isMobile ? 0 : DRAWER_WIDTH}px)`,
        minHeight: '100vh', bgcolor: 'background.default'
      }}>
        <Outlet />
      </Box>
    </Box>
  );
}