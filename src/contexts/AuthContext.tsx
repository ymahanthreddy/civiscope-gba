import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'citizen';
  department?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo credentials
const DEMO_USERS: { [key: string]: { password: string; user: User } } = {
  admin: {
    password: 'admin123',
    user: {
      id: 'admin-1',
      username: 'admin',
      name: 'Commissioner Office',
      role: 'admin',
      department: 'BBMP Administration',
    },
  },
  officer: {
    password: 'officer123',
    user: {
      id: 'officer-1',
      username: 'officer',
      name: 'Rajesh Kumar',
      role: 'admin',
      department: 'Sanitation',
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    const credentials = DEMO_USERS[username.toLowerCase()];
    if (credentials && credentials.password === password) {
      setUser(credentials.user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
