
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { mockResidents, mockAdmins, setCurrentUser, getCurrentUser } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: 'resident' | 'admin') => Promise<boolean>;
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
  role: 'resident' | 'admin';
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
    // Check if user is already logged in (in a real app, this would check AsyncStorage or secure storage)
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

  const login = async (email: string, password: string, role: 'resident' | 'admin'): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let foundUser: User | undefined;
      
      if (role === 'resident') {
        foundUser = mockResidents.find(resident => resident.email === email);
      } else {
        foundUser = mockAdmins.find(admin => admin.email === email);
      }
      
      if (foundUser) {
        // In a real app, you would verify the password here
        setUser(foundUser);
        setCurrentUser(foundUser);
        console.log('Login successful:', foundUser.firstName, foundUser.lastName, foundUser.role);
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if user already exists
      const existingResident = mockResidents.find(resident => resident.email === userData.email);
      const existingAdmin = mockAdmins.find(admin => admin.email === userData.email);
      
      if (existingResident || existingAdmin) {
        console.log('Registration failed: User already exists');
        return false;
      }
      
      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        barangayId: 'brgy-001',
        phoneNumber: userData.phoneNumber,
        address: userData.address,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      if (userData.role === 'resident') {
        const newResident = {
          ...newUser,
          role: 'resident' as const,
          verificationStatus: 'pending' as const,
        };
        mockResidents.push(newResident);
        setUser(newResident);
        setCurrentUser(newResident);
      } else {
        const newAdmin = {
          ...newUser,
          role: 'admin' as const,
          position: 'Staff',
          permissions: ['manage_documents'] as const,
        };
        mockAdmins.push(newAdmin);
        setUser(newAdmin);
        setCurrentUser(newAdmin);
      }
      
      console.log('Registration successful:', newUser.firstName, newUser.lastName, newUser.role);
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
