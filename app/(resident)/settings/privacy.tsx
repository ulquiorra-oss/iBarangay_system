import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Pressable, 
  StyleSheet, 
  Platform, 
  StatusBar,
  Switch,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';
import { IconSymbol } from '../../../components/IconSymbol';
import { barangayColors } from '../../../constants/Colors';
import { mockAppSettings } from '../../../data/mockData';

interface PrivacyOption {
  id: string;
  name: string;
  enabled: boolean;
}

export default function PrivacySettings() {
  const { user, logout } = useAuth();

  const [options, setOptions] = React.useState<PrivacyOption[]>([
    { id: 'profile_visibility', name: 'Profile Visibility', enabled: true },
    { id: 'location_sharing', name: 'Location Sharing', enabled: false },
    { id: 'data_sharing', name: 'Data Sharing with 3rd Parties', enabled: false },
    { id: 'ads_personalization', name: 'Personalized Ads', enabled: true },
  ]);

  const toggleOption = (id: string) => {
    setOptions(prev =>
      prev.map(opt => opt.id === id ? { ...opt, enabled: !opt.enabled } : opt)
    );
  };

  const handleSave = () => {
    Alert.alert('Privacy Settings Saved', 'Your privacy preferences have been updated.');
    // Normally call API to save preferences
  };

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
        {options.map(opt => (
          <View key={opt.id} style={styles.optionCard}>
            <Text style={styles.optionText}>{opt.name}</Text>
            <Switch
              value={opt.enabled}
              onValueChange={() => toggleOption(opt.id)}
              trackColor={{ true: barangayColors.primary, false: barangayColors.gray }}
              thumbColor={opt.enabled ? barangayColors.white : barangayColors.white}
            />
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
  optionCard: {
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
  optionText: { fontSize: 16, color: barangayColors.text },
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
