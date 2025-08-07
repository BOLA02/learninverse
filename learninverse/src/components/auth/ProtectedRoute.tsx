'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/utils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'student',
  redirectTo = '/login'
}) => {
  const { user, isLoading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(redirectTo);
        return;
      }

      if (requiredRole && !hasRole(requiredRole)) {
        // Redirect based on user role
        if (user.role === 'student') {
          router.push('/pages/dashboard');
        } else if (user.role === 'teacher') {
          router.push('/teacher/dashboard');
        } else if (user.role === 'admin' || user.role === 'super_admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/login');
        }
        return;
      }
    }
  }, [user, isLoading, hasRole, requiredRole, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || (requiredRole && !hasRole(requiredRole))) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
