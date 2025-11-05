
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
  Image,
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
  paymentCard: {
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
  cardHeader: {
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
  paymentInfo: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: barangayColors.textLight,
    width: 120,
  },
  infoValue: {
    fontSize: 14,
    color: barangayColors.text,
    flex: 1,
    fontWeight: '500',
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: barangayColors.primary,
  },
  proofSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: barangayColors.border,
  },
  proofLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: barangayColors.text,
    marginBottom: 8,
  },
  proofImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: barangayColors.lightGray,
    marginBottom: 12,
  },
  noProofText: {
    fontSize: 14,
    color: barangayColors.textLight,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  verifyButton: {
    backgroundColor: barangayColors.success,
  },
  rejectButton: {
    backgroundColor: barangayColors.danger,
  },
  viewButton: {
    backgroundColor: barangayColors.accent,
  },
  actionButtonText: {
    color: barangayColors.white,
    fontSize: 14,
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
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: barangayColors.white,
    borderRadius: 12,
    padding: 20,
    width: '95%',
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: barangayColors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 20,
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

export default function PaymentVerificationScreen() {
  const [payments, setPayments] = useState<DocumentRequest[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<DocumentRequest[]>([]);
  const [activeFilter, setActiveFilter] = useState('pending_verification');
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<DocumentRequest | null>(null);
  const [modalType, setModalType] = useState<'view' | 'verify' | 'reject'>('view');
  const [notes, setNotes] = useState('');

  const filters = [
    { id: 'pending_verification', label: 'Pending' },
    { id: 'verified', label: 'Verified' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'all', label: 'All' },
  ];

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [payments, activeFilter]);

  const loadPayments = () => {
    // Filter requests that have payment proofs
    const paymentsWithProof = mockDocumentRequests.filter(req => 
      req.paymentProof || req.paymentStatus !== 'unpaid'
    );
    setPayments(paymentsWithProof);
    console.log('Loaded payments for verification:', paymentsWithProof.length);
  };

  const filterPayments = () => {
    if (activeFilter === 'all') {
      setFilteredPayments(payments);
    } else {
      setFilteredPayments(payments.filter(payment => payment.paymentStatus === activeFilter));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_verification':
        return barangayColors.warning;
      case 'verified':
        return barangayColors.success;
      case 'rejected':
        return barangayColors.danger;
      default:
        return barangayColors.gray;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_verification':
        return 'Pending Verification';
      case 'verified':
        return 'Verified';
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

  const handleViewProof = (payment: DocumentRequest) => {
    setSelectedPayment(payment);
    setModalType('view');
    setShowModal(true);
    console.log('Viewing proof for:', payment.referenceNumber);
  };

  const handleVerifyPayment = (payment: DocumentRequest) => {
    setSelectedPayment(payment);
    setModalType('verify');
    setNotes('');
    setShowModal(true);
    console.log('Verifying payment for:', payment.referenceNumber);
  };

  const handleRejectPayment = (payment: DocumentRequest) => {
    setSelectedPayment(payment);
    setModalType('reject');
    setNotes('');
    setShowModal(true);
    console.log('Rejecting payment for:', payment.referenceNumber);
  };

  const handleSubmitAction = () => {
    if (!selectedPayment) return;

    let newStatus = selectedPayment.paymentStatus;
    let message = '';

    if (modalType === 'verify') {
      newStatus = 'verified';
      message = 'Payment verified successfully';
    } else if (modalType === 'reject') {
      newStatus = 'rejected';
      message = 'Payment rejected';
    }

    // In a real app, this would update the database
    const updatedPayments = payments.map(payment =>
      payment.id === selectedPayment.id
        ? { ...payment, paymentStatus: newStatus as any, notes: notes }
        : payment
    );
    setPayments(updatedPayments);

    Alert.alert('Success', message);
    setShowModal(false);
    setSelectedPayment(null);
    console.log('Payment action completed:', modalType, 'for:', selectedPayment.referenceNumber);
  };

  const getModalTitle = () => {
    switch (modalType) {
      case 'view':
        return 'Payment Proof';
      case 'verify':
        return 'Verify Payment';
      case 'reject':
        return 'Reject Payment';
      default:
        return 'Payment Details';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="arrow-back" size={24} color={barangayColors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Payment Verification</Text>
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

        {filteredPayments.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol name="payment" size={64} color={barangayColors.textLight} />
            <Text style={styles.emptyText}>
              {activeFilter === 'all' ? 'No payments found' : `No ${activeFilter} payments`}
            </Text>
          </View>
        ) : (
          filteredPayments.map((payment) => (
            <View key={payment.id} style={styles.paymentCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.documentType}>
                  {getDocumentTypeLabel(payment.type)}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(payment.paymentStatus) }]}>
                  <Text style={styles.statusText}>
                    {getStatusText(payment.paymentStatus)}
                  </Text>
                </View>
              </View>

              <View style={styles.paymentInfo}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Resident:</Text>
                  <Text style={styles.infoValue}>{getResidentName(payment.residentId)}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Reference:</Text>
                  <Text style={styles.infoValue}>{payment.referenceNumber}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Amount:</Text>
                  <Text style={[styles.infoValue, styles.amount]}>₱{payment.paymentAmount}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Method:</Text>
                  <Text style={styles.infoValue}>{payment.paymentMethod || 'Not specified'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Submitted:</Text>
                  <Text style={styles.infoValue}>{payment.requestDate.toLocaleDateString()}</Text>
                </View>
              </View>

              <View style={styles.proofSection}>
                <Text style={styles.proofLabel}>Proof of Payment:</Text>
                {payment.paymentProof ? (
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop' }} 
                    style={styles.proofImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.noProofText}>No proof of payment uploaded</Text>
                )}
              </View>

              <View style={styles.actionButtons}>
                {payment.paymentProof && (
                  <Pressable
                    style={[styles.actionButton, styles.viewButton]}
                    onPress={() => handleViewProof(payment)}
                  >
                    <Text style={styles.actionButtonText}>View Proof</Text>
                  </Pressable>
                )}

                {payment.paymentStatus === 'pending_verification' && (
                  <>
                    <Pressable
                      style={[styles.actionButton, styles.verifyButton]}
                      onPress={() => handleVerifyPayment(payment)}
                    >
                      <Text style={styles.actionButtonText}>Verify</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.actionButton, styles.rejectButton]}
                      onPress={() => handleRejectPayment(payment)}
                    >
                      <Text style={styles.actionButtonText}>Reject</Text>
                    </Pressable>
                  </>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{getModalTitle()}</Text>
            
            {selectedPayment && (
              <ScrollView>
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
                    {getDocumentTypeLabel(selectedPayment.type)}
                  </Text>
                  <Text style={{ color: barangayColors.textLight, marginBottom: 4 }}>
                    Ref: {selectedPayment.referenceNumber}
                  </Text>
                  <Text style={{ color: barangayColors.textLight }}>
                    Amount: ₱{selectedPayment.paymentAmount}
                  </Text>
                </View>

                {modalType === 'view' && selectedPayment.paymentProof && (
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop' }} 
                    style={styles.modalImage}
                    resizeMode="contain"
                  />
                )}

                {(modalType === 'verify' || modalType === 'reject') && (
                  <>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
                      Notes:
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder={modalType === 'verify' ? 'Add verification notes...' : 'Reason for rejection...'}
                      value={notes}
                      onChangeText={setNotes}
                      multiline
                      numberOfLines={4}
                    />
                  </>
                )}
              </ScrollView>
            )}

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.buttonText}>
                  {modalType === 'view' ? 'Close' : 'Cancel'}
                </Text>
              </Pressable>
              
              {modalType !== 'view' && (
                <Pressable
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={handleSubmitAction}
                >
                  <Text style={styles.buttonText}>
                    {modalType === 'verify' ? 'Verify Payment' : 'Reject Payment'}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
