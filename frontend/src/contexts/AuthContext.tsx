import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, getErrorMessage } from '@/lib/api';
import type { AuthUser } from '@/types';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await api.get('/users/profile');
      setUser(response.data.data);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/users/profile');
        setUser(response.data.data);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      setUser(response.data.data);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      await api.post('/auth/register', { email, password, name });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      setUser(response.data.data);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const resendOtp = async (email: string) => {
    try {
      await api.post('/auth/resend-otp', { email });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    try {
      await api.post('/auth/reset-password', { email, otp, newPassword });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        verifyOtp,
        resendOtp,
        forgotPassword,
        resetPassword,
        refreshUser,
      }}
    >
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
