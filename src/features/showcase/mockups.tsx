import { Avatar, Box, Chip, LinearProgress, Stack, Typography } from '@mui/material';
import { ShieldCheck, Users, GraduationCap, UserRound } from 'lucide-react';
import { PORTAL_PALETTES } from '../../theme/portalPalettes';

const row = { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as const;

export function PortalsMockup() {
  const portals = [
    { key: 'admin' as const, label: 'Admin', icon: ShieldCheck },
    { key: 'teacher' as const, label: 'Teacher', icon: Users },
    { key: 'student' as const, label: 'Student', icon: GraduationCap },
    { key: 'parent' as const, label: 'Parent', icon: UserRound },
  ];
  return (
    <Stack spacing={2.5}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
        {portals.map(({ key, label, icon: Icon }) => (
          <Box
            key={key}
            sx={{
              borderRadius: 2,
              p: 1.75,
              background: `linear-gradient(135deg, ${PORTAL_PALETTES[key][400]}22, ${PORTAL_PALETTES[key][600]}11)`,
              border: `1px solid ${PORTAL_PALETTES[key][500]}44`,
            }}
          >
            <Icon size={18} color={PORTAL_PALETTES[key][400]} />
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#E8E9F3', mt: 0.75 }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          p: 1.25,
          borderRadius: 2,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Avatar sx={{ width: 32, height: 32, fontSize: 13, bgcolor: PORTAL_PALETTES.teacher[500] }}>
          RK
        </Avatar>
        <Box>
          <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: '#E8E9F3' }}>
            Ramesh Kumar
          </Typography>
          <Typography sx={{ fontSize: 11, color: '#9A9BBF' }}>Teacher · also a Parent</Typography>
        </Box>
      </Box>
    </Stack>
  );
}

export function AttendanceMockup() {
  const students = [
    { name: 'Vidya Sharma', roll: '01', present: true },
    { name: 'Arjun Reddy', roll: '02', present: true },
    { name: 'Lakshmi Devi', roll: '03', present: false },
    { name: 'Kiran Kumar', roll: '04', present: true },
  ];
  return (
    <Stack spacing={1.75}>
      <Box sx={row}>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#E8E9F3' }}>
          Grade 5 · Section A
        </Typography>
        <Chip
          label="32/35 present"
          size="small"
          sx={{
            bgcolor: `${PORTAL_PALETTES.teacher[500]}22`,
            color: PORTAL_PALETTES.teacher[300],
            fontWeight: 700,
            fontSize: 11,
          }}
        />
      </Box>
      <Stack spacing={1}>
        {students.map((s) => (
          <Box
            key={s.roll}
            sx={{
              ...row,
              p: 1,
              borderRadius: 1.5,
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
              <Avatar sx={{ width: 26, height: 26, fontSize: 11 }}>{s.roll}</Avatar>
              <Typography sx={{ fontSize: 12.5, color: '#E8E9F3' }}>{s.name}</Typography>
            </Stack>
            <Chip
              label={s.present ? 'Present' : 'Absent'}
              size="small"
              sx={{
                fontSize: 10.5,
                height: 22,
                fontWeight: 700,
                bgcolor: s.present ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                color: s.present ? '#4ADE80' : '#F87171',
              }}
            />
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}

export function ResultsMockup() {
  const subjects = [
    { name: 'Mathematics', grade: 'A+', pct: 96 },
    { name: 'Science', grade: 'A', pct: 88 },
    { name: 'English', grade: 'A', pct: 85 },
    { name: 'Telugu', grade: 'B+', pct: 78 },
  ];
  return (
    <Stack spacing={1.75}>
      <Box sx={row}>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#E8E9F3' }}>
          Mid-Term Results
        </Typography>
        <Chip
          label="Published"
          size="small"
          sx={{
            bgcolor: `${PORTAL_PALETTES.admin[500]}22`,
            color: PORTAL_PALETTES.admin[300],
            fontWeight: 700,
            fontSize: 11,
          }}
        />
      </Box>
      <Stack spacing={1.25}>
        {subjects.map((s) => (
          <Box key={s.name}>
            <Box sx={{ ...row, mb: 0.5 }}>
              <Typography sx={{ fontSize: 12.5, color: '#E8E9F3' }}>{s.name}</Typography>
              <Typography
                sx={{ fontSize: 12.5, fontWeight: 800, color: PORTAL_PALETTES.admin[300] }}
              >
                {s.grade}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={s.pct}
              sx={{
                height: 5,
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.06)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: PORTAL_PALETTES.admin[400],
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}

export function HallTicketMockup() {
  const qrCells = Array.from({ length: 49 }, (_, i) => (i * 37) % 5 !== 0);
  return (
    <Box
      sx={{
        borderRadius: 2.5,
        p: 2.25,
        background: `linear-gradient(160deg, ${PORTAL_PALETTES.student[900]}, #0D0E17)`,
        border: `1px solid ${PORTAL_PALETTES.student[500]}33`,
      }}
    >
      <Box sx={{ ...row, mb: 2 }}>
        <Box>
          <Typography sx={{ fontSize: 10.5, color: '#9A9BBF', letterSpacing: '0.08em' }}>
            HALL TICKET
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 800, color: '#E8E9F3' }}>
            Mid-Term 2026
          </Typography>
        </Box>
        <Chip
          label="ADM2026001"
          size="small"
          sx={{
            fontSize: 10.5,
            bgcolor: `${PORTAL_PALETTES.student[500]}22`,
            color: PORTAL_PALETTES.student[300],
          }}
        />
      </Box>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '2px',
              width: 84,
              height: 84,
              bgcolor: '#fff',
              borderRadius: 1,
              p: 0.75,
            }}
          >
            {qrCells.map((filled, i) => (
              <Box key={i} sx={{ bgcolor: filled ? '#0D0E17' : 'transparent' }} />
            ))}
          </Box>
        </Box>
        <Stack spacing={0.5}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#E8E9F3' }}>
            Vidya Sharma
          </Typography>
          <Typography sx={{ fontSize: 11.5, color: '#9A9BBF' }}>Roll No. 01 · Grade 5-A</Typography>
          <Typography sx={{ fontSize: 11.5, color: '#9A9BBF' }}>Room 12 · 9:30 AM</Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

export function NotificationsMockup() {
  const items = [
    { title: 'Annual Sports Day — 15 August', time: '2h ago', unread: true },
    { title: 'Mid-Term results published', time: 'Yesterday', unread: true },
    { title: 'PTA meeting rescheduled to Friday', time: '2 days ago', unread: false },
    { title: 'Holiday notice — Independence Day', time: '3 days ago', unread: false },
  ];
  return (
    <Stack spacing={1}>
      <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#E8E9F3', mb: 0.5 }}>
        Announcements
      </Typography>
      {items.map((n) => (
        <Box
          key={n.title}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
            p: 1.1,
            borderRadius: 1.5,
            background: n.unread ? `${PORTAL_PALETTES.parent[500]}0F` : 'rgba(255,255,255,0.03)',
          }}
        >
          <Box
            sx={{
              mt: 0.6,
              width: 6,
              height: 6,
              borderRadius: '50%',
              flexShrink: 0,
              bgcolor: n.unread ? PORTAL_PALETTES.parent[400] : 'transparent',
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: 12, color: '#E8E9F3', lineHeight: 1.4 }}>
              {n.title}
            </Typography>
            <Typography sx={{ fontSize: 10.5, color: '#5C5D7A', mt: 0.25 }}>{n.time}</Typography>
          </Box>
        </Box>
      ))}
    </Stack>
  );
}
