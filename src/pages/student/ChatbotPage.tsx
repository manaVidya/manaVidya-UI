import { PageContainer } from '../../components/data-display/PageContainer';
import { PageHeader } from '../../components/data-display/PageHeader';
import { ChatbotPanel } from '../../components/data-display/ChatbotPanel';

export default function StudentChatbotPage() {
  return (
    <PageContainer>
      <PageHeader
        title="AI Study Assistant"
        subtitle="Ask about your syllabus, assignments, or exam schedule."
      />
      <ChatbotPanel heading="AI Study Assistant" />
    </PageContainer>
  );
}
