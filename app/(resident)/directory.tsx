
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Alert,
  Linking,
} from 'react-native';
import { barangayColors } from '../../constants/Colors';
import { IconSymbol } from '../../components/IconSymbol';
import { router } from 'expo-router';
import { DirectoryEntry, EmergencyContact } from '../../types';
import { mockDirectoryEntries, getEmergencyContacts } from '../../data/mockData';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: barangayColors.background,
  },
  header: {
    backgroundColor: barangayColors.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: barangayColors.white,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 50,
    padding: 8,
  },
  content: {
    flex: 1,
  },
  emergencySection: {
    backgroundColor: barangayColors.danger,
    margin: 20,
    borderRadius: 12,
    padding: 16,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: barangayColors.white,
    marginBottom: 12,
    textAlign: 'center',
  },
  emergencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emergencyButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    padding: 12,
    width: '48%',
    marginBottom: 8,
    alignItems: 'center',
  },
  emergencyButtonText: {
    color: barangayColors.white,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
  },
  emergencyNumber: {
    color: barangayColors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  categorySection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: barangayColors.text,
    marginBottom: 12,
  },
  directoryCard: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: barangayColors.text,
    flex: 1,
  },
  position: {
    fontSize: 14,
    color: barangayColors.textLight,
    marginBottom: 8,
  },
  contactInfo: {
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactText: {
    fontSize: 14,
    color: barangayColors.text,
    marginLeft: 8,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: barangayColors.textLight,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  operatingHours: {
    fontSize: 12,
    color: barangayColors.textLight,
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: barangayColors.primary,
  },
  actionButtonText: {
    color: barangayColors.white,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  emergencyBadge: {
    backgroundColor: barangayColors.danger,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emergencyBadgeText: {
    color: barangayColors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default function DirectoryScreen() {
  const [directoryEntries, setDirectoryEntries] = useState<DirectoryEntry[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);

  useEffect(() => {
    loadDirectoryData();
  }, []);

  const loadDirectoryData = () => {
    setDirectoryEntries(mockDirectoryEntries.filter(entry => entry.isActive));
    setEmergencyContacts(getEmergencyContacts());
    console.log('Loaded directory entries:', mockDirectoryEntries.length);
  };

  const handleCall = (phoneNumber: string, name: string) => {
    Alert.alert(
      'Make Call',
      `Call ${name} at ${phoneNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${phoneNumber}`);
            console.log('Calling:', phoneNumber);
          }
        }
      ]
    );
  };

  const handleEmergencyCall = (phoneNumber: string, name: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
    console.log('Emergency call to:', phoneNumber);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
    console.log('Opening email to:', email);
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'barangay_officials':
        return 'Barangay Officials';
      case 'emergency_services':
        return 'Emergency Services';
      case 'government_agencies':
        return 'Government Agencies';
      case 'utilities':
        return 'Utilities & Services';
      case 'health_services':
        return 'Health Services';
      case 'education':
        return 'Education';
      default:
        return category;
    }
  };

  const getEmergencyIcon = (type: string) => {
    switch (type) {
      case 'police':
        return 'local-police';
      case 'fire':
        return 'local-fire-department';
      case 'medical':
        return 'local-hospital';
      case 'disaster':
        return 'warning';
      default:
        return 'phone';
    }
  };

  const groupedEntries = directoryEntries.reduce((groups, entry) => {
    const category = entry.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(entry);
    return groups;
  }, {} as Record<string, DirectoryEntry[]>);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="arrow-back" size={24} color={barangayColors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Directory</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Emergency Contacts Section */}
        <View style={styles.emergencySection}>
          <Text style={styles.emergencyTitle}>🚨 Emergency Contacts</Text>
          <View style={styles.emergencyGrid}>
            {emergencyContacts.map((contact) => (
              <Pressable
                key={contact.id}
                style={styles.emergencyButton}
                onPress={() => handleEmergencyCall(contact.phoneNumber, contact.name)}
              >
                <IconSymbol 
                  name={getEmergencyIcon(contact.type) as any} 
                  size={24} 
                  color={barangayColors.white} 
                />
                <Text style={styles.emergencyButtonText}>{contact.name}</Text>
                <Text style={styles.emergencyNumber}>{contact.phoneNumber}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Directory Categories */}
        {Object.entries(groupedEntries).map(([category, entries]) => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>
              {getCategoryTitle(category)}
            </Text>
            
            {entries.map((entry) => (
              <View key={entry.id} style={styles.directoryCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.name}>{entry.name}</Text>
                  {entry.isEmergency && (
                    <View style={styles.emergencyBadge}>
                      <Text style={styles.emergencyBadgeText}>EMERGENCY</Text>
                    </View>
                  )}
                </View>

                {entry.position && (
                  <Text style={styles.position}>{entry.position}</Text>
                )}

                <View style={styles.contactInfo}>
                  <View style={styles.contactRow}>
                    <IconSymbol name="phone" size={16} color={barangayColors.primary} />
                    <Text style={styles.contactText}>{entry.phoneNumber}</Text>
                  </View>
                  
                  {entry.email && (
                    <View style={styles.contactRow}>
                      <IconSymbol name="email" size={16} color={barangayColors.primary} />
                      <Text style={styles.contactText}>{entry.email}</Text>
                    </View>
                  )}
                  
                  {entry.address && (
                    <View style={styles.contactRow}>
                      <IconSymbol name="location-on" size={16} color={barangayColors.primary} />
                      <Text style={styles.contactText}>{entry.address}</Text>
                    </View>
                  )}
                </View>

                {entry.description && (
                  <Text style={styles.description}>{entry.description}</Text>
                )}

                {entry.operatingHours && (
                  <Text style={styles.operatingHours}>
                    Hours: {entry.operatingHours}
                  </Text>
                )}

                <View style={styles.actionButtons}>
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handleCall(entry.phoneNumber, entry.name)}
                  >
                    <IconSymbol name="phone" size={16} color={barangayColors.white} />
                    <Text style={styles.actionButtonText}>Call</Text>
                  </Pressable>
                  
                  {entry.email && (
                    <Pressable
                      style={styles.actionButton}
                      onPress={() => handleEmail(entry.email!)}
                    >
                      <IconSymbol name="email" size={16} color={barangayColors.white} />
                      <Text style={styles.actionButtonText}>Email</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
