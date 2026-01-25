import { Layout } from '@/components/layout/Layout';
import { ReportForm } from '@/components/report/ReportForm';

export default function ReportPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <ReportForm />
      </div>
    </Layout>
  );
}
