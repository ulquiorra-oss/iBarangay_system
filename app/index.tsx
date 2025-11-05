
import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { barangayColors } from '../constants/Colors';

export default function RootIndex() {
  const { user, isLoading } = useAuth();

  console.log('RootIndex - User:', user?.firstName, 'Role:', user?.role, 'Loading:', isLoading);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: barangayColors.background }}>
        <ActivityIndicator size="large" color={barangayColors.primary} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/welcome" />;
  }

  if (user.role === 'resident') {
    return <Redirect href="/(resident)/dashboard" />;
  }

  if (user.role === 'admin') {
    return <Redirect href="/(admin)/dashboard" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
