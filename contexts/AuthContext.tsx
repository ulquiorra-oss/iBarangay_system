import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { mockResidents, setCurrentUser, getCurrentUser } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<boolean>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const currentUser = getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.log('Error checking auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockResidents.find(resident => resident.email === email);
      
      if (foundUser) {
        setUser(foundUser);
        setCurrentUser(foundUser);
        console.log('Login successful:', foundUser.firstName, foundUser.lastName);
        return true;
      } else {
        console.log('Login failed: User not found');
        return false;
      }
    } catch (error) {
      console.log('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
    console.log('User logged out');
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const existingUser = mockResidents.find(resident => resident.email === userData.email);
      
      if (existingUser) {
        console.log('Registration failed: User already exists');
        return false;
      }
      
      // Create new user (not Resident)
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'resident',
        barangayId: 'brgy-001',
        phoneNumber: userData.phoneNumber,
        address: userData.address,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Add to mock residents array (this will work because User is compatible with Resident base)
      mockResidents.push(newUser as any); // Use type assertion since we're adding to mock data
      setUser(newUser);
      setCurrentUser(newUser);
      
      console.log('Registration successful:', newUser.firstName, newUser.lastName);
      return true;
    } catch (error) {
      console.log('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};