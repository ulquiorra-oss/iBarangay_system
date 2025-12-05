import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';
import { IconSymbol } from '../../../components/IconSymbol';
import { barangayColors } from '../../../constants/Colors';
import { Resident, HouseholdMember } from '../../../types';

export default function AccountSettings() {
  const { user, logout } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<Resident>>({});
  const [newMember, setNewMember] = useState<Partial<HouseholdMember>>({});

  useEffect(() => {
    if (user) {
      setEditedUser({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        address: user.address,
      });
    }
  }, [user]);

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleSaveProfile = () => {
    Alert.alert('Success', 'Profile updated successfully!');
    setShowEditModal(false);
  };

  const handleAddMember = () => {
    setNewMember({});
    setShowAddMemberModal(true);
  };

  const handleSaveMember = () => {
    if (!newMember.firstName || !newMember.lastName || !newMember.relationship) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert('Success', 'Household member added successfully!');
    setShowAddMemberModal(false);
    setNewMember({});
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/welcome');
          }
        }
      ]
    );
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Simple date formatting that returns a string no matter what
  const formatDate = (date: any): string => {
    if (!date) return 'Not available';
    
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return 'Invalid date';
      
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Date error';
    }
  };

  const getMemberDetails = (member: HouseholdMember) => {
    const relationship = member.relationship || 'Not specified';
    const birthDate = formatDate(member.birthDate);
    let details = `${relationship} • Born: ${birthDate}`;
    
    if (member.occupation) {
      details += ` • ${member.occupation}`;
    }
    
    return details;
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const resident = user as Resident;

  // TEMPORARY: Simplified version to find the error
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>Account Settings</Text>

        {/* Simplified Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getInitials(user.firstName, user.lastName)}
              </Text>
            </View>
            <Text style={styles.profileName}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={styles.profileEmail}>{user.role}</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{user.phoneNumber || 'Not provided'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>{formatDate(user.createdAt)}</Text>
            </View>
          </View>
        </View>

        {/* Simplified Household Members - Remove temporarily */}
        {/* <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Household Members</Text>
          </View>
          <View style={styles.householdCard}>
            <Text>Household members section</Text>
          </View>
        </View> */}

        {/* Simplified Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          <View style={styles.actionsCard}>
            <Pressable style={styles.actionButton} onPress={handleLogout}>
              <Text style={[styles.actionButtonText, styles.logoutText]}>Logout</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Simplified Modals */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={editedUser.firstName}
              onChangeText={(text) => setEditedUser({...editedUser, firstName: text})}
            />
            
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.buttonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showAddMemberModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddMemberModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Household Member</Text>
            
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={newMember.firstName}
              onChangeText={(text) => setNewMember({...newMember, firstName: text})}
            />
            
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddMemberModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveMember}
              >
                <Text style={styles.buttonText}>Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: barangayColors.background,
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: barangayColors.text,
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: barangayColors.white,
    padding: 25,
    borderRadius: 16,
    marginBottom: 25,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: barangayColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: barangayColors.white,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: barangayColors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: barangayColors.textLight,
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  infoCard: {
    backgroundColor: barangayColors.lightGray, // FIXED: Changed from backgroundAlt to lightGray
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: barangayColors.border,
  },
  infoLabel: {
    fontSize: 14,
    color: barangayColors.textLight,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: barangayColors.text,
    fontWeight: '500',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: barangayColors.text,
  },
  actionsCard: {
    backgroundColor: barangayColors.white,
    borderRadius: 12,
    padding: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutText: {
    color: barangayColors.danger,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: barangayColors.white,
    borderRadius: 12,
    padding: 20,
    width: '100%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: barangayColors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: barangayColors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: barangayColors.white,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: barangayColors.gray,
  },
  saveButton: {
    backgroundColor: barangayColors.primary,
  },
  buttonText: {
    color: barangayColors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});