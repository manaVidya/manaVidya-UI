import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { ChatbotPanel } from '../../components/data-display/ChatbotPanel';

export default function ParentChatbotPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Chatbot Support"
        subtitle="Quick answers about attendance, fees, and school events."
      />
      <ChatbotPanel heading="Chatbot Support" />
    </PageContainer>
  );
}
