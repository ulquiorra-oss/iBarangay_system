
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
import { Button } from '../../components/button';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Resident, HouseholdMember } from '../../types';

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
  profileSection: {
    backgroundColor: barangayColors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: barangayColors.text,
    marginBottom: 16,
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
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: barangayColors.text,
  },
  userRole: {
    fontSize: 14,
    color: barangayColors.textLight,
    textTransform: 'capitalize',
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: barangayColors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  verificationText: {
    color: barangayColors.white,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: barangayColors.border,
  },
  infoIcon: {
    marginRight: 12,
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
  editButton: {
    backgroundColor: barangayColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  editButtonText: {
    color: barangayColors.white,
    fontWeight: 'bold',
  },
  householdSection: {
    backgroundColor: barangayColors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  householdHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: barangayColors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: barangayColors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  memberCard: {
    backgroundColor: barangayColors.lightGray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: barangayColors.text,
  },
  memberInfo: {
    fontSize: 14,
    color: barangayColors.textLight,
    marginTop: 4,
  },
  logoutSection: {
    backgroundColor: barangayColors.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButton: {
    backgroundColor: barangayColors.danger,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: barangayColors.white,
    fontWeight: 'bold',
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
  input: {
    borderWidth: 1,
    borderColor: barangayColors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
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
  saveButton: {
    backgroundColor: barangayColors.primary,
  },
  buttonText: {
    color: barangayColors.white,
    fontWeight: 'bold',
  },
});

export default function ProfileScreen() {
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
    console.log('Opening edit profile modal');
  };

  const handleSaveProfile = () => {
    // In a real app, this would update the user profile
    Alert.alert('Success', 'Profile updated successfully!');
    setShowEditModal(false);
    console.log('Profile updated:', editedUser);
  };

  const handleAddMember = () => {
    setNewMember({});
    setShowAddMemberModal(true);
    console.log('Opening add member modal');
  };

  const handleSaveMember = () => {
    if (!newMember.firstName || !newMember.lastName || !newMember.relationship) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // In a real app, this would add the household member
    Alert.alert('Success', 'Household member added successfully!');
    setShowAddMemberModal(false);
    setNewMember({});
    console.log('Member added:', newMember);
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
            console.log('User logged out');
          }
        }
      ]
    );
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  if (!user) {
    return null;
  }

  const resident = user as Resident;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="arrow-back" size={24} color={barangayColors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Information */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getInitials(user.firstName, user.lastName)}
              </Text>
            </View>
            <Text style={styles.userName}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={styles.userRole}>{user.role}</Text>
            {resident.verificationStatus === 'verified' && (
              <View style={styles.verificationBadge}>
                <IconSymbol name="verified" size={16} color={barangayColors.white} />
                <Text style={styles.verificationText}>Verified Resident</Text>
              </View>
            )}
          </View>

          <View style={styles.infoRow}>
            <IconSymbol name="email" size={20} color={barangayColors.primary} style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <IconSymbol name="phone" size={20} color={barangayColors.primary} style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{user.phoneNumber || 'Not provided'}</Text>
          </View>

          <View style={styles.infoRow}>
            <IconSymbol name="location-on" size={20} color={barangayColors.primary} style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>{user.address || 'Not provided'}</Text>
          </View>

          <View style={styles.infoRow}>
            <IconSymbol name="calendar-today" size={20} color={barangayColors.primary} style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Member Since</Text>
            <Text style={styles.infoValue}>{formatDate(user.createdAt)}</Text>
          </View>

          <Pressable style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* Household Members */}
        <View style={styles.householdSection}>
          <View style={styles.householdHeader}>
            <Text style={styles.sectionTitle}>Household Members</Text>
            <Pressable style={styles.addButton} onPress={handleAddMember}>
              <Text style={styles.addButtonText}>Add Member</Text>
            </Pressable>
          </View>

          {resident.householdMembers && resident.householdMembers.length > 0 ? (
            resident.householdMembers.map((member) => (
              <View key={member.id} style={styles.memberCard}>
                <Text style={styles.memberName}>
                  {member.firstName} {member.lastName}
                </Text>
                <Text style={styles.memberInfo}>
                  {member.relationship} • Born: {formatDate(member.birthDate)}
                  {member.occupation && ` • ${member.occupation}`}
                </Text>
              </View>
            ))
          ) : (
            <Text style={{ color: barangayColors.textLight, textAlign: 'center', padding: 20 }}>
              No household members added
            </Text>
          )}
        </View>

        {/* Logout Section */}
        <View style={styles.logoutSection}>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            
            <ScrollView>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={editedUser.firstName}
                onChangeText={(text) => setEditedUser({...editedUser, firstName: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={editedUser.lastName}
                onChangeText={(text) => setEditedUser({...editedUser, lastName: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={editedUser.phoneNumber}
                onChangeText={(text) => setEditedUser({...editedUser, phoneNumber: text})}
                keyboardType="phone-pad"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={editedUser.address}
                onChangeText={(text) => setEditedUser({...editedUser, address: text})}
                multiline
                numberOfLines={3}
              />
            </ScrollView>

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

      {/* Add Member Modal */}
      <Modal
        visible={showAddMemberModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddMemberModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Household Member</Text>
            
            <ScrollView>
              <TextInput
                style={styles.input}
                placeholder="First Name *"
                value={newMember.firstName}
                onChangeText={(text) => setNewMember({...newMember, firstName: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Last Name *"
                value={newMember.lastName}
                onChangeText={(text) => setNewMember({...newMember, lastName: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Relationship *"
                value={newMember.relationship}
                onChangeText={(text) => setNewMember({...newMember, relationship: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Occupation (Optional)"
                value={newMember.occupation}
                onChangeText={(text) => setNewMember({...newMember, occupation: text})}
              />
            </ScrollView>

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
                <Text style={styles.buttonText}>Add Member</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
