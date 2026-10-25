import { PageScreen } from '@/features/navigation/page-screen';
import { tabs } from '@/features/navigation/tree';

export default function Page() {
  return <PageScreen node={tabs[1]} />;
}
