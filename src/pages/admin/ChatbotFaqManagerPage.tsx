import { Box, Card, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { slideUp } from '../../lib/motion';
import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { MOCK_CHATBOT_FAQS } from '../../lib/mockData';

export default function ChatbotFaqManagerPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Chatbot FAQ Manager"
        subtitle="Answers the assistant gives to parents and students."
        action={<Button variant="contained">Add FAQ</Button>}
      />
      <motion.div variants={slideUp}>
        <Card sx={{ borderRadius: 3, background: 'var(--bg-surface-1)', p: 1 }}>
          {MOCK_CHATBOT_FAQS.map((faq, i) => (
            <Box
              key={faq.id}
              sx={{
                p: 2,
                borderBottom:
                  i < MOCK_CHATBOT_FAQS.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {faq.question}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {faq.answer}
              </Typography>
            </Box>
          ))}
        </Card>
      </motion.div>
    </PageContainer>
  );
}
