import type { FC } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { motion, useReducedMotion, useTransform, type MotionValue } from 'framer-motion';
import { ShieldCheck, ClipboardCheck, Award, QrCode, Bell, type LucideIcon } from 'lucide-react';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { slideUp } from '../../lib/motion';
import { PORTAL_PALETTES, type PortalKey } from '../../theme/portalPalettes';
import { DeviceFrame } from './DeviceFrame';
import {
  PortalsMockup,
  AttendanceMockup,
  ResultsMockup,
  HallTicketMockup,
  NotificationsMockup,
} from './mockups';

interface Feature {
  id: string;
  portal: PortalKey;
  icon: LucideIcon;
  eyebrow: string;
  headline: string;
  subtext: string;
  path: string;
  Mockup: FC;
}

const FEATURES: Feature[] = [
  {
    id: 'portals',
    portal: 'public',
    icon: ShieldCheck,
    eyebrow: 'Access',
    headline: 'One login, every portal.',
    subtext:
      "Admins, teachers, parents, and students each get a portal built for what they need — and one account can hold more than one role, like a teacher who's also a parent.",
    path: '/login',
    Mockup: PortalsMockup,
  },
  {
    id: 'attendance',
    portal: 'teacher',
    icon: ClipboardCheck,
    eyebrow: 'Attendance',
    headline: 'Marked in seconds, seen instantly.',
    subtext:
      'Teachers mark a class roster in under a minute. Parents see it the same day — no phone calls, no paper registers.',
    path: '/teacher/attendance',
    Mockup: AttendanceMockup,
  },
  {
    id: 'results',
    portal: 'admin',
    icon: Award,
    eyebrow: 'Results',
    headline: 'Every mark, entered once.',
    subtext:
      'Teachers enter marks, admins publish them, and results reach students and parents the moment they go live.',
    path: '/admin/exams/results',
    Mockup: ResultsMockup,
  },
  {
    id: 'hall-tickets',
    portal: 'student',
    icon: QrCode,
    eyebrow: 'Exams',
    headline: 'Hall tickets, done digitally.',
    subtext:
      'Every student gets a verifiable hall ticket with their photo, roll number, and exam schedule — generated in bulk, not typed one by one.',
    path: '/student/exams',
    Mockup: HallTicketMockup,
  },
  {
    id: 'notifications',
    portal: 'parent',
    icon: Bell,
    eyebrow: 'Communication',
    headline: 'Announcements that actually reach parents.',
    subtext:
      "No missed notices. Every announcement lands directly in a parent's portal and phone, the moment it's sent.",
    path: '/parent/notifications',
    Mockup: NotificationsMockup,
  },
];

const BAND = 1 / FEATURES.length;

/** Single useTransform call per invocation (no branching hook calls) — see the
 * explicit, unrolled call-site list in FeatureShowcase for why this matters. */
function useFeatureOpacity(index: number, progress: MotionValue<number>) {
  const start = index * BAND;
  const end = start + BAND;
  const fadeInEnd = start + BAND * 0.15;
  const fadeOutStart = end - BAND * 0.15;
  const isFirst = index === 0;
  const isLast = index === FEATURES.length - 1;

  const input = isFirst
    ? [0, fadeOutStart, end]
    : isLast
      ? [start, fadeInEnd, 1]
      : [start, fadeInEnd, fadeOutStart, end];
  const output = isFirst ? [1, 1, 0] : isLast ? [0, 1, 1] : [0, 1, 1, 0];

  return useTransform(progress, input, output);
}

function FeatureCopy({ feature }: { feature: Feature }) {
  return (
    <>
      <Chip
        icon={<feature.icon size={14} />}
        label={feature.eyebrow.toUpperCase()}
        size="small"
        sx={{
          mb: 2,
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: '0.08em',
          bgcolor: `${PORTAL_PALETTES[feature.portal][500]}1F`,
          color: PORTAL_PALETTES[feature.portal][300],
          '& .MuiChip-icon': { color: PORTAL_PALETTES[feature.portal][300] },
        }}
      />
      <Typography
        sx={{
          fontSize: { xs: 26, md: 34 },
          fontWeight: 800,
          color: '#E8E9F3',
          lineHeight: 1.2,
          mb: 1.5,
        }}
      >
        {feature.headline}
      </Typography>
      <Typography sx={{ fontSize: 16, lineHeight: 1.7, color: '#9A9BBF', maxWidth: 460 }}>
        {feature.subtext}
      </Typography>
    </>
  );
}

/** Static stacked fallback for prefers-reduced-motion — no scroll-pinning, just a fade-in per row. */
function FeatureShowcaseReduced() {
  return (
    <Box
      id="features"
      component="section"
      sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 3, md: 6 }, py: 12 }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {FEATURES.map((feature) => (
          <motion.div
            key={feature.id}
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            style={{ display: 'grid' }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '0.95fr 1.05fr' },
                gap: { xs: 4, md: 8 },
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <DeviceFrame accentColor={PORTAL_PALETTES[feature.portal][400]} path={feature.path}>
                  <feature.Mockup />
                </DeviceFrame>
              </Box>
              <Box>
                <FeatureCopy feature={feature} />
              </Box>
            </Box>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
}

/** Full pinned scrollytelling version — sticky device frame cross-fades as feature copy scrolls past. */
function FeatureShowcaseFull() {
  const { containerRef, smoothProgress } = useScrollProgress();

  // Rules of Hooks: FEATURES has a fixed length, so these are unrolled
  // explicitly rather than called inside FEATURES.map(...).
  const opacities = [
    useFeatureOpacity(0, smoothProgress),
    useFeatureOpacity(1, smoothProgress),
    useFeatureOpacity(2, smoothProgress),
    useFeatureOpacity(3, smoothProgress),
    useFeatureOpacity(4, smoothProgress),
  ];

  return (
    <Box
      id="features"
      component="section"
      ref={containerRef}
      sx={{
        position: 'relative',
        height: { xs: 'auto', md: `${FEATURES.length * 100}vh` },
        py: { xs: 10, md: 0 },
      }}
    >
      <Box
        sx={{
          position: { xs: 'static', md: 'sticky' },
          top: 0,
          height: { xs: 'auto', md: '100vh' },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '0.95fr 1.05fr' },
          gap: { xs: 8, md: 10 },
          alignItems: 'center',
          maxWidth: 1240,
          mx: 'auto',
          px: { xs: 3, md: 6 },
        }}
      >
        {/* Pinned device frame — cross-fades between mockups as you scroll */}
        <Box
          sx={{ position: 'relative', minHeight: 420, display: 'flex', justifyContent: 'center' }}
        >
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.id}
              style={{
                opacity: opacities[i],
                position: 'absolute',
                inset: 0,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <DeviceFrame accentColor={PORTAL_PALETTES[feature.portal][400]} path={feature.path}>
                <feature.Mockup />
              </DeviceFrame>
            </motion.div>
          ))}
        </Box>

        {/* Scrolling feature copy */}
        <Box sx={{ display: { xs: 'flex', md: 'block' }, flexDirection: 'column', gap: 10 }}>
          {FEATURES.map((feature) => (
            <Box
              key={feature.id}
              sx={{ minHeight: { xs: 'auto', md: '100vh' }, display: 'flex', alignItems: 'center' }}
            >
              <motion.div
                variants={slideUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
              >
                <FeatureCopy feature={feature} />
              </motion.div>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export function FeatureShowcase() {
  const shouldReduceMotion = useReducedMotion();
  return shouldReduceMotion ? <FeatureShowcaseReduced /> : <FeatureShowcaseFull />;
}
