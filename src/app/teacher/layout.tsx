import { ReactNode } from 'react';

interface TeacherLayoutProps {
  children: ReactNode;
}

export default function TeacherRootLayout({ children }: TeacherLayoutProps) {
  return children;
}
