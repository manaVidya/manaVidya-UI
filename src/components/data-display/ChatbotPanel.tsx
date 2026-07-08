import { Box, Card, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send, MessageCircleQuestion } from 'lucide-react';
import { slideUp } from '../../lib/motion';
import { MOCK_CHATBOT_FAQS } from '../../lib/mockData';

export function ChatbotPanel({ heading = 'Chatbot Support' }: { heading?: string }) {
  const [draft, setDraft] = useState('');

  return (
    <motion.div variants={slideUp}>
      <Card sx={{ borderRadius: 3, background: 'var(--bg-surface-1)', p: 0, overflow: 'hidden' }}>
        <Box
          sx={{
            p: 2.5,
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <MessageCircleQuestion size={18} color="var(--portal-400)" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {heading}
          </Typography>
        </Box>

        <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {MOCK_CHATBOT_FAQS.map((faq) => (
            <Box key={faq.id}>
              <Box
                sx={{
                  alignSelf: 'flex-start',
                  maxWidth: '85%',
                  background: 'var(--bg-surface-2)',
                  borderRadius: '14px 14px 14px 4px',
                  p: 1.5,
                  mb: 0.75,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {faq.question}
                </Typography>
              </Box>
              <Box
                sx={{
                  alignSelf: 'flex-end',
                  maxWidth: '85%',
                  ml: 'auto',
                  background: 'var(--portal-500)',
                  color: 'var(--text-inverse)',
                  borderRadius: '14px 14px 4px 14px',
                  p: 1.5,
                }}
              >
                <Typography variant="body2">{faq.answer}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, p: 2, borderTop: '1px solid var(--border-subtle)' }}>
          <Box
            component="input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask a question…"
            sx={{
              flex: 1,
              border: '1px solid var(--border-default)',
              borderRadius: 2,
              px: 1.5,
              py: 1,
              background: 'var(--bg-surface-2)',
              color: 'var(--text-primary)',
              fontSize: 14,
              fontFamily: 'inherit',
              outline: 'none',
              '&:focus': { borderColor: 'var(--portal-500)' },
            }}
          />
          <Box
            component="button"
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              border: 'none',
              background: 'var(--portal-500)',
              color: 'var(--text-inverse)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Send size={16} />
          </Box>
        </Box>
      </Card>
    </motion.div>
  );
}
