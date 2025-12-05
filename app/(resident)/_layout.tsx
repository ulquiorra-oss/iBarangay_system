import React, { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function ResidentLayout() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== 'resident') {
      router.replace('/(auth)/welcome');
    }
  }, [user]);

  // Don't render anything if not authenticated
  if (!user || user.role !== 'resident') {
    return null;
  }

  return (
    <Stack>
      {/* Dashboard */}
      <Stack.Screen
        name="dashboard"
        options={{
          headerShown: false,
        }}
      />

      {/* My Documents - ADD THIS */}
      <Stack.Screen
        name="mydocuments"
        options={{
          headerShown: false,
        }}
      />

      {/* Documents */}
      <Stack.Screen
        name="documents"
        options={{
          headerShown: false,
        }}
      />

      {/* Payments */}
      <Stack.Screen
        name="payments"
        options={{
          headerShown: false,
        }}
      />

      {/* Requests */}
      <Stack.Screen
        name="requests"
        options={{
          headerShown: false,
        }}
      />

      {/* Announcements */}
      <Stack.Screen
        name="announcements"
        options={{
          headerShown: false,
        }}
      />

      {/* Directory */}
      <Stack.Screen
        name="directory"
        options={{
          headerShown: false,
        }}
      />

      {/* Profile */}
      <Stack.Screen
        name="profile"
        options={{
          headerShown: false,
        }}
      />

      {/* Emergency */}
      <Stack.Screen
        name="emergency"
        options={{
          headerShown: false,
        }}
      />

      {/* Settings */}
      <Stack.Screen
        name="settings"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}