import { Box } from '@mui/material';
import { VidyaJourney } from '../../features/journey/VidyaJourney';
import { FeatureShowcase } from '../../features/showcase/FeatureShowcase';
import { ClosingCTA } from '../../features/journey/ClosingCTA';
import { FloatingNav } from '../../features/public/FloatingNav';
import { SiteFooter } from '../../features/public/SiteFooter';

export default function LandingPage() {
  return (
    <Box sx={{ position: 'relative' }}>
      <FloatingNav />
      <VidyaJourney />
      <FeatureShowcase />
      <ClosingCTA />
      <SiteFooter />
    </Box>
  );
}
