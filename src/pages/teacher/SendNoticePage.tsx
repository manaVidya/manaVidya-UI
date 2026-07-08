import { useState } from 'react';
import { Box, Button, Card, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { slideUp } from '../../lib/motion';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { NotificationListCard } from '../../components/data-display/NotificationListCard';
import { MOCK_NOTIFICATIONS } from '../../lib/mockData';

export default function SendNoticePage() {
  const [draft, setDraft] = useState('');

  return (
    <PageContainer>
      <PageHeader title="Send Notice" subtitle="To all guardians of Class 5-A." />

      <motion.div variants={slideUp}>
        <Card sx={{ borderRadius: 3, background: 'var(--bg-surface-1)', p: 2.5, mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Compose a notice
          </Typography>
          <Box
            component="textarea"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="e.g. Tomorrow's science trip is confirmed — please send lunch boxes."
            rows={3}
            sx={{
              width: '100%',
              border: '1px solid var(--border-default)',
              borderRadius: 2,
              background: 'var(--bg-surface-2)',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              fontSize: 14,
              p: 1.5,
              mb: 1.5,
              outline: 'none',
              resize: 'vertical',
              '&:focus': { borderColor: 'var(--portal-500)' },
            }}
          />
          <Button variant="contained">Send to Class 5-A</Button>
        </Card>
      </motion.div>

      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
        Previously sent
      </Typography>
      <NotificationListCard items={MOCK_NOTIFICATIONS} />
    </PageContainer>
  );
}
