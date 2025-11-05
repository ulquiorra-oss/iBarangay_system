
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { barangayColors } from '../../constants/Colors';
import { IconSymbol } from '../../components/IconSymbol';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { DocumentRequest } from '../../types';
import { getDocumentRequestsByResident } from '../../data/mockData';

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
  requestCard: {
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
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  documentType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: barangayColors.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: barangayColors.white,
  },
  referenceNumber: {
    fontSize: 14,
    color: barangayColors.textLight,
    marginBottom: 8,
  },
  purpose: {
    fontSize: 14,
    color: barangayColors.text,
    marginBottom: 8,
  },
  requestDate: {
    fontSize: 12,
    color: barangayColors.textLight,
    marginBottom: 12,
  },
  paymentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: barangayColors.border,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: barangayColors.primary,
  },
  paymentStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: barangayColors.primary,
  },
  successButton: {
    backgroundColor: barangayColors.success,
  },
  warningButton: {
    backgroundColor: barangayColors.warning,
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
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: barangayColors.border,
  },
  filterButtonActive: {
    backgroundColor: barangayColors.primary,
    borderColor: barangayColors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: barangayColors.text,
  },
  filterButtonTextActive: {
    color: barangayColors.white,
  },
});

export default function RequestsScreen() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<DocumentRequest[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'processing', label: 'Processing' },
    { id: 'ready_for_pickup', label: 'Ready' },
    { id: 'completed', label: 'Completed' },
  ];

  useEffect(() => {
    loadRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, activeFilter]);

  const loadRequests = () => {
    if (user) {
      const userRequests = getDocumentRequestsByResident(user.id);
      setRequests(userRequests);
      console.log('Loaded requests:', userRequests.length);
    }
  };

  const filterRequests = () => {
    if (activeFilter === 'all') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter(req => req.status === activeFilter));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return barangayColors.warning;
      case 'payment_needed':
        return barangayColors.danger;
      case 'processing':
        return barangayColors.accent;
      case 'ready_for_pickup':
        return barangayColors.success;
      case 'completed':
        return barangayColors.primary;
      case 'rejected':
        return barangayColors.danger;
      default:
        return barangayColors.gray;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'payment_needed':
        return 'Payment Needed';
      case 'processing':
        return 'Processing';
      case 'ready_for_pickup':
        return 'Ready for Pickup';
      case 'completed':
        return 'Completed';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'unpaid':
        return barangayColors.danger;
      case 'pending_verification':
        return barangayColors.warning;
      case 'verified':
        return barangayColors.success;
      default:
        return barangayColors.gray;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'barangay_clearance':
        return 'Barangay Clearance';
      case 'certificate_of_residency':
        return 'Certificate of Residency';
      case 'certificate_of_indigency':
        return 'Certificate of Indigency';
      case 'business_permit':
        return 'Business Permit';
      case 'cedula':
        return 'Cedula';
      case 'barangay_id':
        return 'Barangay ID';
      default:
        return type;
    }
  };

  const handlePayNow = (request: DocumentRequest) => {
    router.push('/(resident)/payments');
  };

  const handleDownload = (request: DocumentRequest) => {
    Alert.alert(
      'Download Document',
      `Download ${getDocumentTypeLabel(request.type)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Download', 
          onPress: () => {
            Alert.alert('Success', 'Document downloaded successfully!');
            console.log('Downloaded document:', request.referenceNumber);
          }
        }
      ]
    );
  };

  const handleTrackStatus = (request: DocumentRequest) => {
    Alert.alert(
      'Request Status',
      `Reference: ${request.referenceNumber}\nStatus: ${getStatusText(request.status)}\nSubmitted: ${request.requestDate.toLocaleDateString()}\n${request.processedDate ? `Processed: ${request.processedDate.toLocaleDateString()}` : ''}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="arrow-back" size={24} color={barangayColors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>My Requests</Text>
      </View>

      <ScrollView style={styles.content}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          {filters.map((filter) => (
            <Pressable
              key={filter.id}
              style={[
                styles.filterButton,
                activeFilter === filter.id && styles.filterButtonActive
              ]}
              onPress={() => setActiveFilter(filter.id)}
            >
              <Text style={[
                styles.filterButtonText,
                activeFilter === filter.id && styles.filterButtonTextActive
              ]}>
                {filter.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {filteredRequests.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol name="description" size={64} color={barangayColors.textLight} />
            <Text style={styles.emptyText}>
              {activeFilter === 'all' ? 'No requests found' : `No ${activeFilter} requests`}
            </Text>
          </View>
        ) : (
          filteredRequests.map((request) => (
            <View key={request.id} style={styles.requestCard}>
              <View style={styles.requestHeader}>
                <Text style={styles.documentType}>
                  {getDocumentTypeLabel(request.type)}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
                  <Text style={styles.statusText}>
                    {getStatusText(request.status)}
                  </Text>
                </View>
              </View>

              <Text style={styles.referenceNumber}>
                Ref: {request.referenceNumber}
              </Text>
              <Text style={styles.purpose}>
                Purpose: {request.purpose}
              </Text>
              <Text style={styles.requestDate}>
                Submitted: {request.requestDate.toLocaleDateString()}
              </Text>

              <View style={styles.paymentInfo}>
                <Text style={styles.amount}>₱{request.paymentAmount}</Text>
                <Text style={[
                  styles.paymentStatus,
                  { color: getPaymentStatusColor(request.paymentStatus) }
                ]}>
                  {request.paymentStatus === 'unpaid' ? 'Unpaid' :
                   request.paymentStatus === 'pending_verification' ? 'Pending Verification' :
                   request.paymentStatus === 'verified' ? 'Payment Verified' : request.paymentStatus}
                </Text>
              </View>

              <View style={styles.actionButtons}>
                <Pressable
                  style={[styles.actionButton, styles.primaryButton]}
                  onPress={() => handleTrackStatus(request)}
                >
                  <Text style={styles.actionButtonText}>Track Status</Text>
                </Pressable>

                {request.paymentStatus === 'unpaid' && (
                  <Pressable
                    style={[styles.actionButton, styles.warningButton]}
                    onPress={() => handlePayNow(request)}
                  >
                    <Text style={styles.actionButtonText}>Pay Now</Text>
                  </Pressable>
                )}

                {request.status === 'completed' && request.documentUrl && (
                  <Pressable
                    style={[styles.actionButton, styles.successButton]}
                    onPress={() => handleDownload(request)}
                  >
                    <Text style={styles.actionButtonText}>Download</Text>
                  </Pressable>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
