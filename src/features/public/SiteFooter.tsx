import { Box, Link as MuiLink, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Mail, School } from 'lucide-react';

/** `transparentBg` lets a page behind it (e.g. the demo page's fixed gradient wash)
 *  show through instead of this footer's own solid fill. */
export function SiteFooter({ transparentBg = false }: { transparentBg?: boolean }) {
  return (
    <Box
      id="contact"
      component="footer"
      sx={{
        borderTop: '1px solid var(--border-subtle)',
        background: transparentBg ? 'transparent' : '#09090F',
        pt: { xs: 8, md: 10 },
        pb: 5,
        px: { xs: 3, md: 6 },
      }}
    >
      <Box
        sx={{
          maxWidth: 1240,
          mx: 'auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: 6,
          mb: 6,
        }}
      >
        <Box sx={{ maxWidth: 320 }}>
          <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', mb: 1.5 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--portal-400), var(--portal-600))',
              }}
            >
              <School size={16} color="#fff" strokeWidth={2.25} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: 17, color: '#fff' }}>ManaVidya</Typography>
          </Stack>
          <Typography sx={{ fontSize: 14, color: '#9A9BBF', lineHeight: 1.7 }}>
            The school management platform built for schools like yours — one connected system for
            admins, teachers, parents, and students.
          </Typography>
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#5C5D7A',
              mb: 1.5,
            }}
          >
            CONTACT
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Mail size={15} color="#9A9BBF" />
            <MuiLink
              href="mailto:hello@manavidya.in"
              sx={{ fontSize: 14, color: '#9A9BBF', '&:hover': { color: '#fff' } }}
            >
              hello@manavidya.in
            </MuiLink>
          </Stack>
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#5C5D7A',
              mb: 1.5,
            }}
          >
            PRODUCT
          </Typography>
          <Stack spacing={1}>
            <MuiLink
              component={Link}
              to="/login"
              sx={{ fontSize: 14, color: '#9A9BBF', '&:hover': { color: '#fff' } }}
            >
              Sign In
            </MuiLink>
          </Stack>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1240, mx: 'auto', pt: 3, borderTop: '1px solid var(--border-subtle)' }}>
        <Typography sx={{ fontSize: 12.5, color: '#5C5D7A', textAlign: 'center' }}>
          © {new Date().getFullYear()} ManaVidya. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
