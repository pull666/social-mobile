import { PageScreen } from '@/features/navigation/page-screen';
import { findPage } from '@/features/navigation/tree';

export default function Page() {
  return <PageScreen node={findPage('n067')!} />;
}
