
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { barangayColors } from '../../constants/Colors';
import { IconSymbol } from '../../components/IconSymbol';
import { router } from 'expo-router';
import { DocumentRequest } from '../../types';
import { mockDocumentRequests, mockResidents } from '../../data/mockData';

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
  requestInfo: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: barangayColors.textLight,
    width: 100,
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
  approveButton: {
    backgroundColor: barangayColors.success,
  },
  rejectButton: {
    backgroundColor: barangayColors.danger,
  },
  processButton: {
    backgroundColor: barangayColors.accent,
  },
  readyButton: {
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
    minHeight: 80,
    textAlignVertical: 'top',
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

export default function DocumentManagementScreen() {
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<DocumentRequest[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DocumentRequest | null>(null);
  const [notes, setNotes] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'process' | 'ready'>('approve');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'payment_needed', label: 'Payment Needed' },
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
    setRequests(mockDocumentRequests);
    console.log('Loaded document requests:', mockDocumentRequests.length);
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

  const getResidentName = (residentId: string) => {
    const resident = mockResidents.find(r => r.id === residentId);
    return resident ? `${resident.firstName} ${resident.lastName}` : 'Unknown Resident';
  };

  const handleAction = (request: DocumentRequest, action: 'approve' | 'reject' | 'process' | 'ready') => {
    setSelectedRequest(request);
    setActionType(action);
    setNotes('');
    setShowNotesModal(true);
    console.log('Opening action modal:', action, 'for request:', request.referenceNumber);
  };

  const handleSubmitAction = () => {
    if (!selectedRequest) return;

    let newStatus = selectedRequest.status;
    let message = '';

    switch (actionType) {
      case 'approve':
        newStatus = 'processing';
        message = 'Request approved and moved to processing';
        break;
      case 'reject':
        newStatus = 'rejected';
        message = 'Request rejected';
        break;
      case 'process':
        newStatus = 'processing';
        message = 'Request is now being processed';
        break;
      case 'ready':
        newStatus = 'ready_for_pickup';
        message = 'Document is ready for pickup';
        break;
    }

    // In a real app, this would update the database
    const updatedRequests = requests.map(req =>
      req.id === selectedRequest.id
        ? { ...req, status: newStatus as any, notes: notes, processedDate: new Date() }
        : req
    );
    setRequests(updatedRequests);

    Alert.alert('Success', message);
    setShowNotesModal(false);
    setSelectedRequest(null);
    console.log('Action completed:', actionType, 'for request:', selectedRequest.referenceNumber);
  };

  const getActionTitle = () => {
    switch (actionType) {
      case 'approve':
        return 'Approve Request';
      case 'reject':
        return 'Reject Request';
      case 'process':
        return 'Process Request';
      case 'ready':
        return 'Mark as Ready';
      default:
        return 'Update Request';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="arrow-back" size={24} color={barangayColors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Document Management</Text>
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

              <View style={styles.requestInfo}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Resident:</Text>
                  <Text style={styles.infoValue}>{getResidentName(request.residentId)}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Reference:</Text>
                  <Text style={styles.infoValue}>{request.referenceNumber}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Purpose:</Text>
                  <Text style={styles.infoValue}>{request.purpose}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Amount:</Text>
                  <Text style={styles.infoValue}>₱{request.paymentAmount}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Submitted:</Text>
                  <Text style={styles.infoValue}>{request.requestDate.toLocaleDateString()}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Payment:</Text>
                  <Text style={styles.infoValue}>{request.paymentStatus}</Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                {request.status === 'pending' && (
                  <>
                    <Pressable
                      style={[styles.actionButton, styles.approveButton]}
                      onPress={() => handleAction(request, 'approve')}
                    >
                      <Text style={styles.actionButtonText}>Approve</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.actionButton, styles.rejectButton]}
                      onPress={() => handleAction(request, 'reject')}
                    >
                      <Text style={styles.actionButtonText}>Reject</Text>
                    </Pressable>
                  </>
                )}

                {request.status === 'processing' && (
                  <Pressable
                    style={[styles.actionButton, styles.readyButton]}
                    onPress={() => handleAction(request, 'ready')}
                  >
                    <Text style={styles.actionButtonText}>Mark as Ready</Text>
                  </Pressable>
                )}

                {request.status === 'payment_needed' && request.paymentStatus === 'verified' && (
                  <Pressable
                    style={[styles.actionButton, styles.processButton]}
                    onPress={() => handleAction(request, 'process')}
                  >
                    <Text style={styles.actionButtonText}>Start Processing</Text>
                  </Pressable>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        visible={showNotesModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNotesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{getActionTitle()}</Text>
            
            {selectedRequest && (
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
                  {getDocumentTypeLabel(selectedRequest.type)}
                </Text>
                <Text style={{ color: barangayColors.textLight }}>
                  Ref: {selectedRequest.referenceNumber}
                </Text>
              </View>
            )}

            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
              Notes (Optional):
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Add notes or comments..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowNotesModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmitAction}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
