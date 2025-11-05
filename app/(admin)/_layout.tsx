
import React from 'react';
import { Stack } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Redirect } from 'expo-router';

export default function AdminLayout() {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return <Redirect href="/(auth)/welcome" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="document-management" />
      <Stack.Screen name="payment-verification" />
      <Stack.Screen name="resident-management" />
      <Stack.Screen name="announcement-management" />
      <Stack.Screen name="directory-management" />
      <Stack.Screen name="reports" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
