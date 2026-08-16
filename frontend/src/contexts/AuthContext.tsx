import { createContext, useContext, useState, ReactNode } from 'react';
import { authApi } from '../api/client';

interface User {
  id: string; email: string; firstName: string; lastName: string;
  role: 'client' | 'merchant' | 'admin'; universalPoints: number; loyaltyLevel: string;
}

interface AuthCtx {
  user: User | null; isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthCtx>({} as AuthCtx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const s = localStorage.getItem('fl_user');
    return s ? JSON.parse(s) : null;
  });

  const saveAuth = (data: any) => {
    localStorage.setItem('fl_token', data.access_token);
    localStorage.setItem('fl_refresh', data.refresh_token);
    localStorage.setItem('fl_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async (email: string, password: string) => {
    const { data } = await authApi.login(email, password);
    saveAuth(data);
  };

  const register = async (formData: any) => {
    const { data } = await authApi.register(formData);
    saveAuth(data);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = '/login';
  };

  const updateUser = (data: Partial<User>) => {
    const updated = { ...user!, ...data };
    localStorage.setItem('fl_user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);