
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
  Image,
} from 'react-native';
import { barangayColors } from '../../constants/Colors';
import { IconSymbol } from '../../components/IconSymbol';
import { Button } from '../../components/button';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { DocumentRequest, PaymentMethod } from '../../types';
import { getDocumentRequestsByResident } from '../../data/mockData';
import * as ImagePicker from 'expo-image-picker';

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
  documentType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: barangayColors.text,
    marginBottom: 8,
  },
  referenceNumber: {
    fontSize: 14,
    color: barangayColors.textLight,
    marginBottom: 8,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: barangayColors.primary,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: barangayColors.white,
  },
  payButton: {
    backgroundColor: barangayColors.success,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonText: {
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
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: barangayColors.border,
    marginBottom: 12,
  },
  paymentMethodSelected: {
    borderColor: barangayColors.primary,
    backgroundColor: barangayColors.lightGray,
  },
  paymentMethodText: {
    marginLeft: 12,
    fontSize: 16,
    color: barangayColors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: barangayColors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  proofContainer: {
    borderWidth: 2,
    borderColor: barangayColors.border,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  proofImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  uploadText: {
    color: barangayColors.textLight,
    textAlign: 'center',
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
});

export default function PaymentsScreen() {
  const { user } = useAuth();
  const [pendingPayments, setPendingPayments] = useState<DocumentRequest[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DocumentRequest | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [proofImage, setProofImage] = useState<string | null>(null);

  useEffect(() => {
    loadPendingPayments();
  }, []);

  const loadPendingPayments = () => {
    if (user) {
      const requests = getDocumentRequestsByResident(user.id);
      const pending = requests.filter(req => 
        req.paymentStatus === 'unpaid' || req.paymentStatus === 'pending_verification'
      );
      setPendingPayments(pending);
      console.log('Loaded pending payments:', pending.length);
    }
  };

  const handlePayNow = (request: DocumentRequest) => {
    setSelectedRequest(request);
    setShowPaymentModal(true);
    console.log('Opening payment modal for:', request.referenceNumber);
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    console.log('Selected payment method:', method);
  };

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProofImage(result.assets[0].uri);
        console.log('Image selected:', result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSubmitPayment = () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    if (!referenceNumber.trim()) {
      Alert.alert('Error', 'Please enter a reference number');
      return;
    }

    if (!proofImage) {
      Alert.alert('Error', 'Please upload proof of payment');
      return;
    }

    // Simulate payment submission
    Alert.alert(
      'Payment Submitted',
      'Your payment has been submitted for verification. You will be notified once it is processed.',
      [
        {
          text: 'OK',
          onPress: () => {
            setShowPaymentModal(false);
            setSelectedRequest(null);
            setSelectedPaymentMethod(null);
            setReferenceNumber('');
            setProofImage(null);
            loadPendingPayments();
          }
        }
      ]
    );
    console.log('Payment submitted for:', selectedRequest?.referenceNumber);
  };

  const getStatusColor = (status: string) => {
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'unpaid':
        return 'Payment Required';
      case 'pending_verification':
        return 'Pending Verification';
      case 'verified':
        return 'Payment Verified';
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

  const paymentMethods = [
    { id: 'gcash', name: 'GCash', icon: 'account-balance-wallet' },
    { id: 'paymaya', name: 'PayMaya', icon: 'credit-card' },
    { id: 'bank_transfer', name: 'Bank Transfer', icon: 'account-balance' },
    { id: 'over_the_counter', name: 'Over the Counter', icon: 'store' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="arrow-back" size={24} color={barangayColors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Payments</Text>
      </View>

      <ScrollView style={styles.content}>
        {pendingPayments.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol name="payment" size={64} color={barangayColors.textLight} />
            <Text style={styles.emptyText}>No pending payments</Text>
          </View>
        ) : (
          pendingPayments.map((request) => (
            <View key={request.id} style={styles.paymentCard}>
              <Text style={styles.documentType}>
                {getDocumentTypeLabel(request.type)}
              </Text>
              <Text style={styles.referenceNumber}>
                Ref: {request.referenceNumber}
              </Text>
              <Text style={styles.amount}>₱{request.paymentAmount}</Text>
              
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.paymentStatus) }]}>
                <Text style={styles.statusText}>
                  {getStatusText(request.paymentStatus)}
                </Text>
              </View>

              {request.paymentStatus === 'unpaid' && (
                <Pressable style={styles.payButton} onPress={() => handlePayNow(request)}>
                  <Text style={styles.payButtonText}>Pay Now</Text>
                </Pressable>
              )}
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        visible={showPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Payment Details</Text>
            
            <ScrollView>
              {selectedRequest && (
                <>
                  <Text style={styles.documentType}>
                    {getDocumentTypeLabel(selectedRequest.type)}
                  </Text>
                  <Text style={styles.amount}>₱{selectedRequest.paymentAmount}</Text>
                  
                  <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 12 }}>
                    Select Payment Method:
                  </Text>
                  
                  {paymentMethods.map((method) => (
                    <Pressable
                      key={method.id}
                      style={[
                        styles.paymentMethod,
                        selectedPaymentMethod === method.id && styles.paymentMethodSelected
                      ]}
                      onPress={() => handlePaymentMethodSelect(method.id as PaymentMethod)}
                    >
                      <IconSymbol name={method.icon as any} size={24} color={barangayColors.primary} />
                      <Text style={styles.paymentMethodText}>{method.name}</Text>
                    </Pressable>
                  ))}

                  <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 12 }}>
                    Reference Number:
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter reference/transaction number"
                    value={referenceNumber}
                    onChangeText={setReferenceNumber}
                  />

                  <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
                    Proof of Payment:
                  </Text>
                  <Pressable style={styles.proofContainer} onPress={handleImagePicker}>
                    {proofImage ? (
                      <Image source={{ uri: proofImage }} style={styles.proofImage} />
                    ) : (
                      <>
                        <IconSymbol name="cloud-upload" size={48} color={barangayColors.textLight} />
                        <Text style={styles.uploadText}>
                          Tap to upload screenshot or receipt
                        </Text>
                      </>
                    )}
                  </Pressable>
                </>
              )}
            </ScrollView>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowPaymentModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmitPayment}
              >
                <Text style={styles.buttonText}>Submit Payment</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
