
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { IconSymbol } from '../../components/IconSymbol';
import { barangayColors } from '../../constants/Colors';
import { 
  getActiveAnnouncements, 
  getDocumentRequestsByResident,
  getEmergencyContacts,
  mockAppSettings 
} from '../../data/mockData';
import { Announcement, DocumentRequest, EmergencyContact } from '../../types';

const { width } = Dimensions.get('window');

export default function ResidentDashboard() {
  const { user, logout } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [recentRequests, setRecentRequests] = useState<DocumentRequest[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    console.log('Loading dashboard data for resident:', user?.firstName);
    
    const activeAnnouncements = getActiveAnnouncements();
    setAnnouncements(activeAnnouncements.slice(0, 3)); // Show latest 3
    
    if (user?.id) {
      const userRequests = getDocumentRequestsByResident(user.id);
      setRecentRequests(userRequests.slice(0, 2)); // Show latest 2
    }
    
    const contacts = getEmergencyContacts();
    setEmergencyContacts(contacts);
  };

  const handleEmergencyCall = (phoneNumber: string, name: string) => {
    Alert.alert(
      'Emergency Call',
      `Call ${name} at ${phoneNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => {
            Linking.openURL(`tel:${phoneNumber}`);
          }
        }
      ]
    );
  };

  const quickAccessItems = [
    {
      title: 'Request Documents',
      icon: 'doc.text',
      color: barangayColors.primary,
      route: '/(resident)/documents',
    },
    {
      title: 'Pay Online',
      icon: 'creditcard',
      color: barangayColors.success,
      route: '/(resident)/payments',
    },
    {
      title: 'My Requests',
      icon: 'list.bullet',
      color: barangayColors.accent,
      route: '/(resident)/requests',
    },
    {
      title: 'Directory',
      icon: 'phone.circle',
      color: barangayColors.secondary,
      route: '/(resident)/directory',
    },
    {
      title: 'Announcements',
      icon: 'megaphone',
      color: barangayColors.warning,
      route: '/(resident)/announcements',
    },
    {
      title: 'Profile',
      icon: 'person.circle',
      color: barangayColors.gray,
      route: '/(resident)/profile',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return barangayColors.success;
      case 'processing': return barangayColors.accent;
      case 'payment_needed': return barangayColors.warning;
      case 'pending': return barangayColors.gray;
      default: return barangayColors.gray;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return barangayColors.danger;
      case 'high': return barangayColors.warning;
      case 'medium': return barangayColors.accent;
      default: return barangayColors.gray;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[barangayColors.primary, barangayColors.accent]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Good day,</Text>
            <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
            <Text style={styles.barangayName}>{mockAppSettings.barangayName}</Text>
          </View>
          <Pressable onPress={logout} style={styles.logoutButton}>
            <IconSymbol name="rectangle.portrait.and.arrow.right" color={barangayColors.white} size={24} />
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Emergency Contacts */}
        <View style={styles.emergencySection}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emergencyScroll}>
            {emergencyContacts.map((contact) => (
              <Pressable
                key={contact.id}
                style={[styles.emergencyCard, { backgroundColor: barangayColors.danger }]}
                onPress={() => handleEmergencyCall(contact.phoneNumber, contact.name)}
              >
                <IconSymbol name="phone.fill" color={barangayColors.white} size={20} />
                <Text style={styles.emergencyText}>{contact.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Announcements Carousel */}
        {announcements.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Latest Announcements</Text>
              <Pressable onPress={() => router.push('/(resident)/announcements')}>
                <Text style={styles.seeAllText}>See All</Text>
              </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.announcementScroll}>
              {announcements.map((announcement) => (
                <View key={announcement.id} style={styles.announcementCard}>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(announcement.priority) }]}>
                    <Text style={styles.priorityText}>{announcement.priority.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.announcementTitle} numberOfLines={2}>{announcement.title}</Text>
                  <Text style={styles.announcementContent} numberOfLines={3}>{announcement.content}</Text>
                  <Text style={styles.announcementDate}>
                    {announcement.publishDate.toLocaleDateString()}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Quick Access */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickAccessGrid}>
            {quickAccessItems.map((item, index) => (
              <Pressable
                key={index}
                style={styles.quickAccessItem}
                onPress={() => router.push(item.route as any)}
              >
                <View style={[styles.quickAccessIcon, { backgroundColor: item.color }]}>
                  <IconSymbol name={item.icon as any} color={barangayColors.white} size={24} />
                </View>
                <Text style={styles.quickAccessText}>{item.title}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Recent Requests */}
        {recentRequests.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Requests</Text>
              <Pressable onPress={() => router.push('/(resident)/requests')}>
                <Text style={styles.seeAllText}>View All</Text>
              </Pressable>
            </View>
            {recentRequests.map((request) => (
              <View key={request.id} style={styles.requestCard}>
                <View style={styles.requestHeader}>
                  <Text style={styles.requestType}>
                    {request.type.replace(/_/g, ' ').toUpperCase()}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
                    <Text style={styles.statusText}>{request.status.replace(/_/g, ' ').toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={styles.requestPurpose}>{request.purpose}</Text>
                <Text style={styles.requestDate}>
                  Requested: {request.requestDate.toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: barangayColors.background,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: barangayColors.white,
    opacity: 0.9,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: barangayColors.white,
    marginTop: 4,
  },
  barangayName: {
    fontSize: 14,
    color: barangayColors.white,
    opacity: 0.8,
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emergencySection: {
    marginTop: 20,
    marginBottom: 10,
  },
  emergencyScroll: {
    marginTop: 10,
  },
  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 12,
    minWidth: 120,
  },
  emergencyText: {
    color: barangayColors.white,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    marginVertical: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: barangayColors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: barangayColors.primary,
    fontWeight: '600',
  },
  announcementScroll: {
    marginTop: 10,
  },
  announcementCard: {
    backgroundColor: barangayColors.white,
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    width: width * 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: barangayColors.white,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: barangayColors.text,
    marginBottom: 8,
  },
  announcementContent: {
    fontSize: 14,
    color: barangayColors.textLight,
    lineHeight: 20,
    marginBottom: 8,
  },
  announcementDate: {
    fontSize: 12,
    color: barangayColors.gray,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAccessItem: {
    width: '48%',
    backgroundColor: barangayColors.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickAccessIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickAccessText: {
    fontSize: 14,
    fontWeight: '600',
    color: barangayColors.text,
    textAlign: 'center',
  },
  requestCard: {
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
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: barangayColors.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: barangayColors.white,
  },
  requestPurpose: {
    fontSize: 14,
    color: barangayColors.textLight,
    marginBottom: 4,
  },
  requestDate: {
    fontSize: 12,
    color: barangayColors.gray,
  },
});
