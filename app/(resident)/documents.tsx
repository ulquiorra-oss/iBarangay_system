
import React, { useState } from 'react';
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
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { IconSymbol } from '../../components/IconSymbol';
import { Button } from '../../components/button';
import { barangayColors } from '../../constants/Colors';
import { mockAppSettings } from '../../data/mockData';
import { DocumentType } from '../../types';

interface DocumentForm {
  type: DocumentType;
  purpose: string;
  additionalInfo: string;
}

export default function DocumentRequestScreen() {
  const { user } = useAuth();
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<DocumentForm>({
    type: 'barangay_clearance',
    purpose: '',
    additionalInfo: '',
  });

  const documentTypes = [
    {
      type: 'barangay_clearance' as DocumentType,
      title: 'Barangay Clearance',
      description: 'Certificate of good moral character and residency',
      fee: mockAppSettings.documentFees.barangay_clearance,
      icon: 'doc.text.fill',
      color: barangayColors.primary,
      requirements: ['Valid ID', 'Proof of Residency', 'Cedula'],
    },
    {
      type: 'certificate_of_residency' as DocumentType,
      title: 'Certificate of Residency',
      description: 'Proof of residence in the barangay',
      fee: mockAppSettings.documentFees.certificate_of_residency,
      icon: 'house.fill',
      color: barangayColors.secondary,
      requirements: ['Valid ID', 'Utility Bill', 'Lease Contract (if applicable)'],
    },
    {
      type: 'certificate_of_indigency' as DocumentType,
      title: 'Certificate of Indigency',
      description: 'Certification of low-income status',
      fee: mockAppSettings.documentFees.certificate_of_indigency,
      icon: 'heart.fill',
      color: barangayColors.success,
      requirements: ['Valid ID', 'Proof of Income', 'Barangay Clearance'],
    },
    {
      type: 'business_permit' as DocumentType,
      title: 'Business Permit',
      description: 'Permit to operate a business in the barangay',
      fee: mockAppSettings.documentFees.business_permit,
      icon: 'briefcase.fill',
      color: barangayColors.warning,
      requirements: ['Valid ID', 'Business Registration', 'Location Clearance'],
    },
    {
      type: 'cedula' as DocumentType,
      title: 'Cedula',
      description: 'Community tax certificate',
      fee: mockAppSettings.documentFees.cedula,
      icon: 'creditcard.fill',
      color: barangayColors.accent,
      requirements: ['Valid ID', 'Proof of Income'],
    },
    {
      type: 'barangay_id' as DocumentType,
      title: 'Barangay ID',
      description: 'Official barangay identification card',
      fee: mockAppSettings.documentFees.barangay_id,
      icon: 'person.crop.rectangle.fill',
      color: barangayColors.gray,
      requirements: ['Valid ID', '2x2 Photo', 'Proof of Residency'],
    },
  ];

  const handleDocumentSelect = (docType: DocumentType) => {
    const selectedDoc = documentTypes.find(doc => doc.type === docType);
    if (selectedDoc) {
      setSelectedDocument(docType);
      setForm({ ...form, type: docType });
      setShowForm(true);
    }
  };

  const handleSubmitRequest = () => {
    if (!form.purpose.trim()) {
      Alert.alert('Error', 'Please specify the purpose of your request.');
      return;
    }

    // Generate reference number
    const refNumber = `${form.type.toUpperCase().replace(/_/g, '')}-${Date.now()}`;
    
    Alert.alert(
      'Request Submitted',
      `Your document request has been submitted successfully.\n\nReference Number: ${refNumber}\n\nYou will be notified when payment is required.`,
      [
        {
          text: 'OK',
          onPress: () => {
            setShowForm(false);
            setForm({ type: 'barangay_clearance', purpose: '', additionalInfo: '' });
            router.push('/(resident)/requests');
          }
        }
      ]
    );
  };

  const selectedDocInfo = documentTypes.find(doc => doc.type === selectedDocument);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" color={barangayColors.primary} size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Request Documents</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Select the document you need to request</Text>

        {documentTypes.map((document) => (
          <Pressable
            key={document.type}
            style={styles.documentCard}
            onPress={() => handleDocumentSelect(document.type)}
          >
            <View style={[styles.documentIcon, { backgroundColor: document.color }]}>
              <IconSymbol name={document.icon as any} color={barangayColors.white} size={24} />
            </View>
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>{document.title}</Text>
              <Text style={styles.documentDescription}>{document.description}</Text>
              <Text style={styles.documentFee}>Fee: ₱{document.fee}</Text>
            </View>
            <IconSymbol name="chevron.right" color={barangayColors.gray} size={20} />
          </Pressable>
        ))}
      </ScrollView>

      {/* Document Request Form Modal */}
      <Modal
        visible={showForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setShowForm(false)} style={styles.modalCloseButton}>
              <IconSymbol name="xmark" color={barangayColors.gray} size={24} />
            </Pressable>
            <Text style={styles.modalTitle}>Request Form</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedDocInfo && (
              <>
                <View style={styles.selectedDocCard}>
                  <View style={[styles.selectedDocIcon, { backgroundColor: selectedDocInfo.color }]}>
                    <IconSymbol name={selectedDocInfo.icon as any} color={barangayColors.white} size={32} />
                  </View>
                  <View style={styles.selectedDocInfo}>
                    <Text style={styles.selectedDocTitle}>{selectedDocInfo.title}</Text>
                    <Text style={styles.selectedDocFee}>Fee: ₱{selectedDocInfo.fee}</Text>
                  </View>
                </View>

                <View style={styles.requirementsSection}>
                  <Text style={styles.requirementsTitle}>Requirements:</Text>
                  {selectedDocInfo.requirements.map((req, index) => (
                    <Text key={index} style={styles.requirementItem}>• {req}</Text>
                  ))}
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.formLabel}>Applicant Information</Text>
                  <View style={styles.infoCard}>
                    <Text style={styles.infoText}>Name: {user?.firstName} {user?.lastName}</Text>
                    <Text style={styles.infoText}>Address: {user?.address}</Text>
                    <Text style={styles.infoText}>Phone: {user?.phoneNumber}</Text>
                  </View>
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.formLabel}>Purpose of Request *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g., Employment requirement, Bank account opening"
                    value={form.purpose}
                    onChangeText={(text) => setForm({ ...form, purpose: text })}
                    multiline
                  />
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.formLabel}>Additional Information</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Any additional details or special requests"
                    value={form.additionalInfo}
                    onChangeText={(text) => setForm({ ...form, additionalInfo: text })}
                    multiline
                  />
                </View>

                <View style={styles.submitSection}>
                  <Button
                    onPress={handleSubmitRequest}
                    style={styles.submitButton}
                  >
                    Submit Request
                  </Button>
                  <Text style={styles.submitNote}>
                    You will receive a notification when your request is processed and payment is required.
                  </Text>
                </View>
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: barangayColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: barangayColors.white,
    borderBottomWidth: 1,
    borderBottomColor: barangayColors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: barangayColors.text,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    color: barangayColors.textLight,
    marginVertical: 20,
    textAlign: 'center',
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  documentIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: barangayColors.text,
    marginBottom: 4,
  },
  documentDescription: {
    fontSize: 14,
    color: barangayColors.textLight,
    marginBottom: 4,
  },
  documentFee: {
    fontSize: 14,
    fontWeight: '600',
    color: barangayColors.primary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: barangayColors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: barangayColors.white,
    borderBottomWidth: 1,
    borderBottomColor: barangayColors.border,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: barangayColors.text,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  selectedDocCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: barangayColors.white,
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedDocIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  selectedDocInfo: {
    flex: 1,
  },
  selectedDocTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: barangayColors.text,
    marginBottom: 4,
  },
  selectedDocFee: {
    fontSize: 16,
    fontWeight: '600',
    color: barangayColors.primary,
  },
  requirementsSection: {
    backgroundColor: barangayColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: barangayColors.text,
    marginBottom: 12,
  },
  requirementItem: {
    fontSize: 14,
    color: barangayColors.textLight,
    marginBottom: 4,
  },
  formSection: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: barangayColors.text,
    marginBottom: 8,
  },
  infoCard: {
    backgroundColor: barangayColors.white,
    borderRadius: 12,
    padding: 16,
  },
  infoText: {
    fontSize: 14,
    color: barangayColors.textLight,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: barangayColors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: barangayColors.text,
    minHeight: 50,
    textAlignVertical: 'top',
  },
  submitSection: {
    marginBottom: 40,
  },
  submitButton: {
    marginBottom: 12,
  },
  submitNote: {
    fontSize: 14,
    color: barangayColors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
});
