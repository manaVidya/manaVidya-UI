import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import {
  BookOpen,
  GraduationCap,
  Heart,
  LayoutDashboard,
  Signal,
  Languages,
  Gauge,
  type LucideIcon,
} from 'lucide-react';
import { staggerContainer } from '../../lib/motion';
import { SpotlightCard } from './SpotlightCard';
import './demoOverview.css';

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Punchier than the app-wide fadeIn/slideUp (lib/motion.ts) on purpose — this is a
// one-off marketing page meant to feel "stellar" on scroll, not the restrained motion
// used inside the authenticated app shell.
const revealUp: Variants = {
  hidden: { opacity: 0, y: 56, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const heroReveal: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const STATS = [
  { label: '4 portals, 1 login system' },
  { label: 'English + Telugu' },
  { label: 'Built for slow 3G' },
];

interface PortalCard {
  key: string;
  icon: LucideIcon;
  title: string;
  color: string;
  bullets: string[];
}

const PORTAL_CARDS: PortalCard[] = [
  {
    key: 'admin',
    icon: LayoutDashboard,
    title: 'Admin',
    color: '#00D4C8',
    bullets: [
      'Students, teachers, and staff — one directory',
      'Classes & sections, with subject-teacher assignments',
      'School-wide attendance, results, and reporting',
    ],
  },
  {
    key: 'teacher',
    icon: GraduationCap,
    title: 'Teacher',
    color: '#FFB300',
    bullets: [
      'Mark a class roster in under a minute',
      'Assignments, grading, and syllabus tracking',
      'Send notices straight to parents',
    ],
  },
  {
    key: 'parent',
    icon: Heart,
    title: 'Parent',
    color: '#FF3D68',
    bullets: [
      "See your child's attendance the same day",
      'Track results, timetable, and homework',
      'One login for every child you have in school',
    ],
  },
  {
    key: 'student',
    icon: BookOpen,
    title: 'Student',
    color: '#00C85B',
    bullets: [
      'Timetable, syllabus, and results in one place',
      'Submit assignments from a phone',
      'Digital ID card and hall tickets',
    ],
  },
];

const REALITIES = [
  {
    icon: Languages,
    title: 'Bilingual by design',
    body: 'Every screen works in English or Telugu — not translated as an afterthought, built in from the font stack up.',
  },
  {
    icon: Signal,
    title: 'Patchy network, no problem',
    body: 'Skeleton loading states instead of spinners, small payloads, and a UI that stays usable on a slow 3G connection.',
  },
  {
    icon: Gauge,
    title: 'Runs on low-end phones',
    body: 'No heavy animation libraries, no GPU-hungry effects — built to feel fast on the ₹6,000 Android phones most families actually own.',
  },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <Typography
      sx={{
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--portal-400)',
        mb: 1.5,
      }}
    >
      {children}
    </Typography>
  );
}

export function DemoOverview() {
  return (
    <Box sx={{ color: '#fff' }}>
      {/* Hero — no gradient of its own; the page-wide flowing wash (DemoPage.tsx)
          shows through since this section has no solid/overlay background. */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          px: 3,
          pt: 12,
          pb: 8,
        }}
      >
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          animate="visible"
          style={{ maxWidth: 780, position: 'relative', zIndex: 1 }}
        >
          <motion.div variants={heroReveal}>
            <Chip
              label="Built for our schools"
              size="small"
              sx={{
                mb: 3,
                background: 'rgba(108,99,255,0.15)',
                color: '#BDB5FF',
                fontWeight: 600,
                border: '1px solid rgba(108,99,255,0.3)',
              }}
            />
          </motion.div>
          <motion.div variants={revealUp}>
            <Typography
              sx={{
                fontSize: { xs: 34, sm: 48, md: 58 },
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                mb: 2.5,
              }}
            >
              One platform for your whole school.
            </Typography>
          </motion.div>
          <motion.div variants={revealUp}>
            <Typography
              sx={{
                fontSize: { xs: 16, md: 19 },
                color: '#9A9BBF',
                lineHeight: 1.6,
                mb: 5,
                maxWidth: 620,
                mx: 'auto',
              }}
            >
              ManaVidya connects admins, teachers, parents, and students in one system — attendance,
              assignments, results, and notices, all in one place, in English or Telugu.
            </Typography>
          </motion.div>
          <motion.div variants={heroReveal}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ justifyContent: 'center' }}
            >
              <Button component={Link} to="/login" variant="contained" size="large">
                Sign In
              </Button>
              <Button
                onClick={() => scrollToId('portals')}
                variant="outlined"
                size="large"
                sx={{ borderColor: 'rgba(255,255,255,0.25)', color: '#fff' }}
              >
                See what it does
              </Button>
            </Stack>
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          animate="visible"
          style={{
            position: 'relative',
            marginTop: 64,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          {STATS.map((s) => (
            <motion.div
              key={s.label}
              variants={heroReveal}
              whileHover={{
                scale: 1.08,
                y: -3,
                boxShadow: '0 12px 28px -8px rgba(108,99,255,0.55)',
              }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ borderRadius: 999 }}
            >
              <Chip
                label={s.label}
                sx={{
                  background: 'rgba(255,255,255,0.06)',
                  color: '#E8E9F3',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontWeight: 500,
                  px: 1,
                  cursor: 'default',
                  '&:hover': { background: 'rgba(255,255,255,0.1)' },
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          style={{
            position: 'absolute',
            bottom: 28,
            left: '50%',
            x: '-50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 22,
              height: 34,
              borderRadius: 12,
              border: '2px solid rgba(255,255,255,0.3)',
              display: 'flex',
              justifyContent: 'center',
              paddingTop: 6,
            }}
          >
            <Box
              sx={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }}
            />
          </motion.div>
        </motion.div>
      </Box>

      {/* What it does */}
      <Box id="portals" sx={{ py: { xs: 10, md: 14 }, px: 3 }}>
        <Box sx={{ maxWidth: 1180, mx: 'auto' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={staggerContainer(0.1)}
          >
            <motion.div variants={heroReveal}>
              <SectionLabel>What it does</SectionLabel>
            </motion.div>
            <motion.div variants={revealUp}>
              <Typography
                sx={{
                  fontSize: { xs: 26, md: 36 },
                  fontWeight: 700,
                  mb: { xs: 6, md: 8 },
                  maxWidth: 640,
                }}
              >
                Four portals. One school, connected.
              </Typography>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer(0.12)}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 24,
            }}
          >
            {PORTAL_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div key={card.key} variants={revealUp}>
                  <SpotlightCard
                    accentColor={card.color}
                    style={{
                      padding: 24,
                      borderRadius: 16,
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.03)',
                    }}
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `${card.color}22`,
                        color: card.color,
                        mb: 2.5,
                      }}
                    >
                      <Icon size={22} />
                    </Box>
                    <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 1.5 }}>
                      {card.title}
                    </Typography>
                    <Stack spacing={1}>
                      {card.bullets.map((b) => (
                        <Typography
                          key={b}
                          sx={{ fontSize: 13.5, color: '#9A9BBF', lineHeight: 1.6 }}
                        >
                          {b}
                        </Typography>
                      ))}
                    </Stack>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </motion.div>
        </Box>
      </Box>

      {/* Built for the realities of rural schools — no background of its own either,
          same reason as the hero: let the page-wide wash flow through unbroken. */}
      <Box sx={{ py: { xs: 10, md: 14 }, px: 3 }}>
        <Box sx={{ maxWidth: 1180, mx: 'auto' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={staggerContainer(0.1)}
          >
            <motion.div variants={heroReveal}>
              <SectionLabel>Why it&apos;s built this way</SectionLabel>
            </motion.div>
            <motion.div variants={revealUp}>
              <Typography
                sx={{
                  fontSize: { xs: 26, md: 36 },
                  fontWeight: 700,
                  mb: { xs: 6, md: 8 },
                  maxWidth: 640,
                }}
              >
                Designed for the schools that need it most.
              </Typography>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer(0.15)}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 32,
            }}
          >
            {REALITIES.map((r) => {
              const Icon = r.icon;
              return (
                <motion.div key={r.title} variants={revealUp}>
                  <SpotlightCard
                    accentColor="#9D8FFF"
                    style={{
                      padding: 24,
                      borderRadius: 16,
                      border: '1px solid rgba(255,255,255,0.06)',
                      background: 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(108,99,255,0.15)',
                        color: '#9D8FFF',
                        mb: 2.5,
                      }}
                    >
                      <Icon size={22} />
                    </Box>
                    <Typography sx={{ fontSize: 17, fontWeight: 700, mb: 1 }}>{r.title}</Typography>
                    <Typography sx={{ fontSize: 14.5, color: '#9A9BBF', lineHeight: 1.7 }}>
                      {r.body}
                    </Typography>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
