// filepath: c:\Users\Bolat\Documents\Learninverse\learninverse\src\app\pages\dashboard\layout.tsx
import Navbar from '../../../../components/navbar/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}