import { Box, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { School } from 'lucide-react';

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** Floating pill nav, fixed above the page. Transparent over the hero photo,
 * gains a glass background + shadow once the page has scrolled past it. */
export function FloatingNav() {
  const { scrollY } = useScroll();
  const dockOpacity = useTransform(scrollY, [0, 80], [0, 1]);
  const dockShadow = useTransform(
    scrollY,
    [0, 80],
    ['0 0 0 rgba(0,0,0,0)', '0 8px 32px rgba(0,0,0,0.35)'],
  );

  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        top: { xs: 12, md: 20 },
        left: 0,
        right: 0,
        zIndex: 300,
        display: 'flex',
        justifyContent: 'center',
        px: 2,
        pointerEvents: 'none',
      }}
    >
      <motion.div
        style={{
          position: 'relative',
          borderRadius: 999,
          pointerEvents: 'auto',
          maxWidth: '100%',
          boxShadow: dockShadow,
        }}
      >
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 999,
            background: 'var(--nav-glass-bg)',
            backdropFilter: 'blur(20px)',
            opacity: dockOpacity,
            zIndex: -1,
          }}
        />

        <Stack
          direction="row"
          sx={{
            position: 'relative',
            alignItems: 'center',
            gap: { xs: 1.5, sm: 3 },
            borderRadius: 999,
            pl: 2.5,
            pr: 1,
            py: 1,
            border: '1px solid var(--border-default)',
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 26,
                height: 26,
                borderRadius: 1.5,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--portal-400), var(--portal-600))',
              }}
            >
              <School size={15} color="#fff" strokeWidth={2.25} />
            </Box>
            <Box
              component="span"
              sx={{
                fontWeight: 700,
                fontSize: 15,
                color: '#fff',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              ManaVidya
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={2.5}
            sx={{ alignItems: 'center', display: { xs: 'none', sm: 'flex' } }}
          >
            <Box
              component="button"
              onClick={() => scrollToId('features')}
              sx={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.75)',
                '&:hover': { color: '#fff' },
              }}
            >
              Features
            </Box>
            <Box
              component="button"
              onClick={() => scrollToId('contact')}
              sx={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.75)',
                '&:hover': { color: '#fff' },
              }}
            >
              Contact
            </Box>
          </Stack>

          <Button
            component={Link}
            to="/login"
            variant="contained"
            size="small"
            sx={{ borderRadius: 999, px: 2.5 }}
          >
            Sign In
          </Button>
        </Stack>
      </motion.div>
    </Box>
  );
}
