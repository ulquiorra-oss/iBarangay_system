import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { barangayColors } from '../../constants/Colors';
import { IconSymbol } from '../../components/IconSymbol';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { 
  mockDocumentRequests, 
  mockAnnouncements, 
  mockResidents,
  getActiveAnnouncements 
} from '../../data/mockData';

const { width } = Dimensions.get('window');

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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 8,
    zIndex: 10,
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: barangayColors.white,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: barangayColors.white,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  kpiSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: barangayColors.text,
    marginBottom: 16,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  kpiCard: {
    width: (width - 60) / 2,
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
  kpiValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: barangayColors.primary,
    marginBottom: 4,
  },
  kpiLabel: {
    fontSize: 14,
    color: barangayColors.textLight,
  },
  kpiIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    opacity: 0.3,
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 2,
    backgroundColor: barangayColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: barangayColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: barangayColors.text,
    textAlign: 'center',
  },
  recentSection: {
    marginBottom: 24,
  },
  recentCard: {
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
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: barangayColors.text,
  },
  recentDate: {
    fontSize: 12,
    color: barangayColors.textLight,
  },
  recentContent: {
    fontSize: 14,
    color: barangayColors.text,
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: barangayColors.white,
    textTransform: 'uppercase',
  },
  viewAllButton: {
    backgroundColor: barangayColors.accent,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'center',
    marginTop: 12,
  },
  viewAllText: {
    color: barangayColors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default function AdminDashboard() {
  const { user } = useAuth();
  const [kpiData, setKpiData] = useState({
    pendingRequests: 0,
    paymentsToVerify: 0,
    approvedRequests: 0,
    totalResidents: 0,
  });
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const pendingRequests = mockDocumentRequests.filter(req => req.status === 'pending').length;
    const paymentsToVerify = mockDocumentRequests.filter(req => req.paymentStatus === 'pending_verification').length;
    const approvedRequests = mockDocumentRequests.filter(req => req.status === 'completed').length;
    const totalResidents = mockResidents.length;

    setKpiData({
      pendingRequests,
      paymentsToVerify,
      approvedRequests,
      totalResidents,
    });

    const recent = mockDocumentRequests
      .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
      .slice(0, 3);
    setRecentRequests(recent);

    const recentAnns = getActiveAnnouncements().slice(0, 2);
    setRecentAnnouncements(recentAnns);
  };

  const quickActions = [
    { title: 'Document Requests', icon: 'description', route: '/(admin)/document-management', color: barangayColors.primary },
    { title: 'Payment Verification', icon: 'payment', route: '/(admin)/payment-verification', color: barangayColors.warning },
    { title: 'Resident Management', icon: 'people', route: '/(admin)/resident-management', color: barangayColors.success },
    { title: 'Announcements', icon: 'campaign', route: '/(admin)/announcement-management', color: barangayColors.accent },
    { title: 'Directory', icon: 'contacts', route: '/(admin)/directory-management', color: barangayColors.secondary },
    { title: 'Reports', icon: 'assessment', route: '/(admin)/reports', color: barangayColors.danger },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return barangayColors.warning;
      case 'processing': return barangayColors.accent;
      case 'completed': return barangayColors.success;
      case 'rejected': return barangayColors.danger;
      default: return barangayColors.gray;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'barangay_clearance': return 'Barangay Clearance';
      case 'certificate_of_residency': return 'Certificate of Residency';
      case 'certificate_of_indigency': return 'Certificate of Indigency';
      case 'business_permit': return 'Business Permit';
      default: return type;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[barangayColors.primary, barangayColors.accent]} style={styles.header}>
        {/* Back Button */}
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="arrow.left" size={22} color={barangayColors.white} />
        </Pressable>

        {/* Title + Welcome */}
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.welcomeText}>Welcome back, {user?.firstName}!</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* KPI Section */}
        <View style={styles.kpiSection}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.kpiGrid}>
            <View style={styles.kpiCard}>
              <IconSymbol name="pending" size={24} color={barangayColors.warning} style={styles.kpiIcon} />
              <Text style={styles.kpiValue}>{kpiData.pendingRequests}</Text>
              <Text style={styles.kpiLabel}>Pending Requests</Text>
            </View>

            <View style={styles.kpiCard}>
              <IconSymbol name="payment" size={24} color={barangayColors.danger} style={styles.kpiIcon} />
              <Text style={styles.kpiValue}>{kpiData.paymentsToVerify}</Text>
              <Text style={styles.kpiLabel}>Payments to Verify</Text>
            </View>

            <View style={styles.kpiCard}>
              <IconSymbol name="check-circle" size={24} color={barangayColors.success} style={styles.kpiIcon} />
              <Text style={styles.kpiValue}>{kpiData.approvedRequests}</Text>
              <Text style={styles.kpiLabel}>Approved Requests</Text>
            </View>

            <View style={styles.kpiCard}>
              <IconSymbol name="people" size={24} color={barangayColors.primary} style={styles.kpiIcon} />
              <Text style={styles.kpiValue}>{kpiData.totalResidents}</Text>
              <Text style={styles.kpiLabel}>Total Residents</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            {quickActions.map((action, index) => (
              <Pressable key={index} style={styles.actionCard} onPress={() => router.push(action.route as any)}>
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <IconSymbol name={action.icon as any} size={24} color={barangayColors.white} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Recent Requests */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Requests</Text>
          {recentRequests.map((request) => (
            <View key={request.id} style={styles.recentCard}>
              <View style={styles.recentHeader}>
                <Text style={styles.recentTitle}>{getDocumentTypeLabel(request.type)}</Text>
                <Text style={styles.recentDate}>{request.requestDate.toLocaleDateString()}</Text>
              </View>
              <Text style={styles.recentContent}>Ref: {request.referenceNumber} • Purpose: {request.purpose}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
                <Text style={styles.statusText}>{request.status}</Text>
              </View>
            </View>
          ))}
          <Pressable style={styles.viewAllButton} onPress={() => router.push('/(admin)/document-management')}>
            <Text style={styles.viewAllText}>View All Requests</Text>
          </Pressable>
        </View>

        {/* Recent Announcements */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Announcements</Text>
          {recentAnnouncements.map((announcement) => (
            <View key={announcement.id} style={styles.recentCard}>
              <View style={styles.recentHeader}>
                <Text style={styles.recentTitle}>{announcement.title}</Text>
                <Text style={styles.recentDate}>{announcement.publishDate.toLocaleDateString()}</Text>
              </View>
              <Text style={styles.recentContent} numberOfLines={2}>
                {announcement.content}
              </Text>
            </View>
          ))}
          <Pressable style={styles.viewAllButton} onPress={() => router.push('/(admin)/announcement-management')}>
            <Text style={styles.viewAllText}>Manage Announcements</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
