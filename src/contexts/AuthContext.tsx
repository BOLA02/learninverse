'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, mockUsers, getStoredUser, setStoredUser, clearStoredUser } from '@/lib/utils';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  hasRole: (role: UserRole) => boolean;
  isAdmin: boolean;
  isStudent: boolean;
  isTeacher: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock authentication - in real app, this would be an API call
    const foundUser = mockUsers.find(u => u.email === email);

    if (foundUser && password) { // Accept any password for demo
      const updatedUser = {
        ...foundUser,
        lastLogin: new Date().toISOString().split('T')[0]
      };

      setUser(updatedUser);
      setStoredUser(updatedUser);
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    clearStoredUser();
    // Force redirect to login with logout flag
    if (typeof window !== 'undefined') {
      window.location.href = '/login?logout=true';
    }
  };

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false;
    
    const roleHierarchy: Record<UserRole, number> = {
      student: 1,
      teacher: 2,
      admin: 3,
      super_admin: 4
    };
    
    return roleHierarchy[user.role] >= roleHierarchy[role];
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    hasRole,
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    isStudent: user?.role === 'student',
    isTeacher: user?.role === 'teacher'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
