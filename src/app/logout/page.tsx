'use client';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const LogoutPage = () => {
  const { logout } = useAuth();

  useEffect(() => {
    // Clear all stored data and redirect to login
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('loggedIn');
      // Clear any other stored data
      localStorage.clear();
      // Redirect to login
      window.location.href = '/login?logout=true';
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Logging out...</p>
      </div>
    </div>
  );
};

export default LogoutPage;
