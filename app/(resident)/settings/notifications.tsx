import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Pressable, 
  StyleSheet, 
  Switch, 
  Alert, 
  Platform, 
  StatusBar 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
// Fixed import path
import { useAuth } from '../../../contexts/AuthContext';
import { IconSymbol } from '../../../components/IconSymbol';
import { barangayColors } from '../../../constants/Colors';
import { mockAppSettings } from '../../../data/mockData';

interface NotificationPreference {
  id: string;
  name: string;
  enabled: boolean;
}

export default function NotificationSettings() {
  const { user, logout } = useAuth();

  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);

  useEffect(() => {
    // Mock fetching user preferences
    setPreferences([
      { id: 'push_announcements', name: 'Announcements', enabled: true },
      { id: 'push_emergency', name: 'Emergency Alerts', enabled: true },
      { id: 'push_document', name: 'Document Status', enabled: false },
      { id: 'email_announcements', name: 'Announcements', enabled: true },
      { id: 'email_emergency', name: 'Emergency Alerts', enabled: false },
      { id: 'sms_emergency', name: 'Emergency Alerts', enabled: true },
    ]);
  }, []);

  const togglePreference = (id: string) => {
    setPreferences((prev) =>
      prev.map((pref) => 
        pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
  };

  const handleSave = () => {
    Alert.alert('Preferences Saved', 'Your notification settings have been updated.');
    // Normally call API to save
  };

  // Group preferences by type (push, email, sms)
  const groupedPrefs = preferences.reduce((acc: any, pref) => {
    const type = pref.id.split('_')[0];
    if (!acc[type]) acc[type] = [];
    acc[type].push(pref);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[barangayColors.primary, barangayColors.accent]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
            <Text style={styles.barangayName}>{mockAppSettings.barangayName}</Text>
          </View>

          {/* SETTINGS + LOGOUT */}
          <View style={styles.headerRight}>
            <Pressable 
              onPress={() => router.push('/(resident)/settings')} 
              style={styles.headerIconButton}
            >
              <IconSymbol name="gear" color={barangayColors.white} size={24} />
            </Pressable>

            <Pressable onPress={logout} style={styles.headerIconButton}>
              <IconSymbol name="rectangle.portrait.and.arrow.right" color={barangayColors.white} size={24} />
            </Pressable>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {Object.keys(groupedPrefs).map((type) => (
          <View key={type} style={styles.section}>
            <Text style={styles.sectionTitle}>
              {type.charAt(0).toUpperCase() + type.slice(1)} Notifications
            </Text>
            {groupedPrefs[type].map((pref: NotificationPreference) => (
              <View key={pref.id} style={styles.prefCard}>
                <Text style={styles.prefText}>{pref.name}</Text>
                <Switch
                  value={pref.enabled}
                  onValueChange={() => togglePreference(pref.id)}
                  trackColor={{ true: barangayColors.primary, false: barangayColors.gray }}
                  thumbColor={pref.enabled ? barangayColors.white : barangayColors.white}
                />
              </View>
            ))}
          </View>
        ))}

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save Changes</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: barangayColors.background },
  header: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: { flex: 1 },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconButton: { padding: 8 },
  greeting: { fontSize: 16, color: barangayColors.white, opacity: 0.9 },
  userName: { fontSize: 24, fontWeight: 'bold', color: barangayColors.white, marginTop: 4 },
  barangayName: { fontSize: 14, color: barangayColors.white, opacity: 0.8, marginTop: 2 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: barangayColors.text, marginBottom: 12 },
  prefCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: barangayColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  prefText: { fontSize: 16, color: barangayColors.text },
  saveButton: {
    backgroundColor: barangayColors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  saveText: { fontSize: 16, fontWeight: 'bold', color: barangayColors.white },
});
