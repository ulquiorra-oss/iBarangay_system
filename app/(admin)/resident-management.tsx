
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { barangayColors } from '../../constants/Colors';
import { IconSymbol } from '../../components/IconSymbol';
import { router } from 'expo-router';
import { Resident } from '../../types';
import { mockResidents } from '../../data/mockData';

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
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: barangayColors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: barangayColors.white,
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: barangayColors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: barangayColors.textLight,
    textAlign: 'center',
    marginTop: 4,
  },
  residentCard: {
    backgroundColor: barangayColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  residentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  residentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: barangayColors.text,
    flex: 1,
  },
  verificationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  verificationText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: barangayColors.white,
    textTransform: 'uppercase',
  },
  residentInfo: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: barangayColors.textLight,
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: barangayColors.text,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: barangayColors.accent,
  },
  editButton: {
    backgroundColor: barangayColors.primary,
  },
  verifyButton: {
    backgroundColor: barangayColors.success,
  },
  actionButtonText: {
    color: barangayColors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: barangayColors.textLight,
    textAlign: 'center',
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: barangayColors.white,
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: barangayColors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: barangayColors.text,
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: barangayColors.gray,
  },
  submitButton: {
    backgroundColor: barangayColors.primary,
  },
  buttonText: {
    color: barangayColors.white,
    fontWeight: 'bold',
  },
});

export default function ResidentManagementScreen() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [filteredResidents, setFilteredResidents] = useState<Resident[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);

  useEffect(() => {
    loadResidents();
  }, []);

  useEffect(() => {
    filterResidents();
  }, [residents, searchQuery]);

  const loadResidents = () => {
    setResidents(mockResidents);
    console.log('Loaded residents:', mockResidents.length);
  };

  const filterResidents = () => {
    if (!searchQuery.trim()) {
      setFilteredResidents(residents);
    } else {
      const filtered = residents.filter(resident =>
        `${resident.firstName} ${resident.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resident.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (resident.phoneNumber && resident.phoneNumber.includes(searchQuery))
      );
      setFilteredResidents(filtered);
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'verified':
        return barangayColors.success;
      case 'pending':
        return barangayColors.warning;
      case 'rejected':
        return barangayColors.danger;
      default:
        return barangayColors.gray;
    }
  };

  const getStats = () => {
    const total = residents.length;
    const verified = residents.filter(r => r.verificationStatus === 'verified').length;
    const pending = residents.filter(r => r.verificationStatus === 'pending').length;
    const rejected = residents.filter(r => r.verificationStatus === 'rejected').length;

    return { total, verified, pending, rejected };
  };

  const handleViewResident = (resident: Resident) => {
    setSelectedResident(resident);
    setShowModal(true);
    console.log('Viewing resident:', resident.firstName, resident.lastName);
  };

  const handleVerifyResident = (resident: Resident) => {
    Alert.alert(
      'Verify Resident',
      `Verify ${resident.firstName} ${resident.lastName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Verify',
          onPress: () => {
            // In a real app, this would update the database
            const updatedResidents = residents.map(r =>
              r.id === resident.id ? { ...r, verificationStatus: 'verified' as const } : r
            );
            setResidents(updatedResidents);
            Alert.alert('Success', 'Resident verified successfully!');
            console.log('Resident verified:', resident.id);
          }
        }
      ]
    );
  };

  const stats = getStats();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="arrow-back" size={24} color={barangayColors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Resident Management</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <IconSymbol name="search" size={20} color={barangayColors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search residents..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Residents</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: barangayColors.success }]}>{stats.verified}</Text>
            <Text style={styles.statLabel}>Verified</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: barangayColors.warning }]}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: barangayColors.danger }]}>{stats.rejected}</Text>
            <Text style={styles.statLabel}>Rejected</Text>
          </View>
        </View>

        {/* Residents List */}
        {filteredResidents.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol name="people" size={64} color={barangayColors.textLight} />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No residents found matching your search' : 'No residents found'}
            </Text>
          </View>
        ) : (
          filteredResidents.map((resident) => (
            <View key={resident.id} style={styles.residentCard}>
              <View style={styles.residentHeader}>
                <Text style={styles.residentName}>
                  {resident.firstName} {resident.lastName}
                </Text>
                <View style={[
                  styles.verificationBadge,
                  { backgroundColor: getVerificationColor(resident.verificationStatus) }
                ]}>
                  <Text style={styles.verificationText}>
                    {resident.verificationStatus}
                  </Text>
                </View>
              </View>

              <View style={styles.residentInfo}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email:</Text>
                  <Text style={styles.infoValue}>{resident.email}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Phone:</Text>
                  <Text style={styles.infoValue}>{resident.phoneNumber || 'Not provided'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Address:</Text>
                  <Text style={styles.infoValue} numberOfLines={2}>
                    {resident.address || 'Not provided'}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Joined:</Text>
                  <Text style={styles.infoValue}>
                    {resident.createdAt.toLocaleDateString()}
                  </Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <Pressable
                  style={[styles.actionButton, styles.viewButton]}
                  onPress={() => handleViewResident(resident)}
                >
                  <Text style={styles.actionButtonText}>View Details</Text>
                </Pressable>

                {resident.verificationStatus === 'pending' && (
                  <Pressable
                    style={[styles.actionButton, styles.verifyButton]}
                    onPress={() => handleVerifyResident(resident)}
                  >
                    <Text style={styles.actionButtonText}>Verify</Text>
                  </Pressable>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Resident Details Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Resident Details</Text>
            
            {selectedResident && (
              <ScrollView>
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Personal Information</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Name:</Text>
                    <Text style={styles.infoValue}>
                      {selectedResident.firstName} {selectedResident.lastName}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Email:</Text>
                    <Text style={styles.infoValue}>{selectedResident.email}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Phone:</Text>
                    <Text style={styles.infoValue}>
                      {selectedResident.phoneNumber || 'Not provided'}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Address:</Text>
                    <Text style={styles.infoValue}>
                      {selectedResident.address || 'Not provided'}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Status:</Text>
                    <Text style={[
                      styles.infoValue,
                      { color: getVerificationColor(selectedResident.verificationStatus) }
                    ]}>
                      {selectedResident.verificationStatus}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Joined:</Text>
                    <Text style={styles.infoValue}>
                      {selectedResident.createdAt.toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                {selectedResident.householdMembers && selectedResident.householdMembers.length > 0 && (
                  <View style={styles.modalSection}>
                    <Text style={styles.sectionTitle}>Household Members</Text>
                    {selectedResident.householdMembers.map((member, index) => (
                      <View key={member.id} style={{ marginBottom: 8 }}>
                        <Text style={styles.infoValue}>
                          {index + 1}. {member.firstName} {member.lastName}
                        </Text>
                        <Text style={[styles.infoValue, { fontSize: 12, color: barangayColors.textLight }]}>
                          {member.relationship} • Born: {member.birthDate.toLocaleDateString()}
                          {member.occupation && ` • ${member.occupation}`}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>
            )}

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
