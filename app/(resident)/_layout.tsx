
import React from 'react';
import { Stack } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Redirect } from 'expo-router';

export default function ResidentLayout() {
  const { user } = useAuth();

  if (!user || user.role !== 'resident') {
    return <Redirect href="/(auth)/welcome" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="documents" />
      <Stack.Screen name="payments" />
      <Stack.Screen name="requests" />
      <Stack.Screen name="announcements" />
      <Stack.Screen name="directory" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="emergency" />
    </Stack>
  );
}
