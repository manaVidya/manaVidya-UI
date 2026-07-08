import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { VidyaJourney } from '../../features/journey/VidyaJourney';

export default function LandingPage() {
  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        component="header"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 32px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 2,
              background: 'linear-gradient(135deg, var(--portal-400), var(--portal-600))',
            }}
          />
          <Box component="span" sx={{ fontWeight: 700, fontSize: 17, color: '#fff' }}>
            ManaVidya
          </Box>
        </Box>
        <Button component={Link} to="/login" variant="contained" size="medium">
          Sign In
        </Button>
      </Box>

      <VidyaJourney />
    </Box>
  );
}
