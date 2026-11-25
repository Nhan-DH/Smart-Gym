import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../mocks/services';

interface AuthContextType {
  user: User;
  role: UserRole;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('smartgym_user', JSON.stringify(user));
  }, [user]);

  const login = async (email: string) => {
    setIsLoading(true);
    try {
      const loggedUser = await authService.login(email);
      setUser(loggedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(authService.switchUser('MANAGER'));
  };

  const switchRole = (role: UserRole) => {
    const switched = authService.switchUser(role);
    setUser(switched);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user.role,
        login,
        logout,
        switchRole,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
