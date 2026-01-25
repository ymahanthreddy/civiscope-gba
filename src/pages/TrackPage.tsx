import { Layout } from '@/components/layout/Layout';
import { IssueTracker } from '@/components/track/IssueTracker';

export default function TrackPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <IssueTracker />
      </div>
    </Layout>
  );
}
