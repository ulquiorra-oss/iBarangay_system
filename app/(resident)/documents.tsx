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

// Types
interface DocumentForm {
  type: DocumentType;
  purpose: string;
  additionalInfo: string;
}

interface DocumentTypeInfo {
  type: DocumentType;
  title: string;
  description: string;
  fee: number;
  icon: string;
  color: string;
  requirements: string[];
}

// Constants
const DOCUMENT_TYPES: DocumentTypeInfo[] = [
  {
    type: 'barangay_clearance',
    title: 'Barangay Clearance',
    description: 'Certificate of good moral character and residency',
    fee: mockAppSettings.documentFees.barangay_clearance,
    icon: 'doc.text.fill',
    color: barangayColors.primary,
    requirements: ['Valid ID', 'Proof of Residency', 'Cedula'],
  },
  {
    type: 'certificate_of_residency',
    title: 'Certificate of Residency',
    description: 'Proof of residence in the barangay',
    fee: mockAppSettings.documentFees.certificate_of_residency,
    icon: 'house.fill',
    color: barangayColors.secondary,
    requirements: ['Valid ID', 'Utility Bill', 'Lease Contract (if applicable)'],
  },
  {
    type: 'certificate_of_indigency',
    title: 'Certificate of Indigency',
    description: 'Certification of low-income status',
    fee: mockAppSettings.documentFees.certificate_of_indigency,
    icon: 'heart.fill',
    color: barangayColors.success,
    requirements: ['Valid ID', 'Proof of Income', 'Barangay Clearance'],
  },
  {
    type: 'business_permit',
    title: 'Business Permit',
    description: 'Permit to operate a business in the barangay',
    fee: mockAppSettings.documentFees.business_permit,
    icon: 'briefcase.fill',
    color: barangayColors.warning,
    requirements: ['Valid ID', 'Business Registration', 'Location Clearance'],
  },
  {
    type: 'cedula',
    title: 'Cedula',
    description: 'Community tax certificate',
    fee: mockAppSettings.documentFees.cedula,
    icon: 'creditcard.fill',
    color: barangayColors.accent,
    requirements: ['Valid ID', 'Proof of Income'],
  },
  {
    type: 'barangay_id',
    title: 'Barangay ID',
    description: 'Official barangay identification card',
    fee: mockAppSettings.documentFees.barangay_id,
    icon: 'person.crop.rectangle.fill',
    color: barangayColors.gray,
    requirements: ['Valid ID', '2x2 Photo', 'Proof of Residency'],
  },
];

// Utility Functions
const DocumentRequestService = {
  generateReferenceNumber: (docType: DocumentType): string => {
    const prefix = docType.toUpperCase().replace(/_/g, '');
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-${timestamp}`;
  },

  validateForm: (form: DocumentForm): boolean => {
    if (!form.purpose.trim()) {
      Alert.alert('Error', 'Please specify the purpose of your request.');
      return false;
    }
    return true;
  },

  handleSuccess: (refNumber: string, onSuccess: () => void): void => {
    Alert.alert(
      'Request Submitted',
      `Your document request has been submitted successfully.\n\nReference Number: ${refNumber}\n\nYou will be notified when payment is required.`,
      [
        {
          text: 'OK',
          onPress: onSuccess
        }
      ]
    );
  },
};

// Components
const Header: React.FC<{ 
  title: string;
  onBack: () => void;
  showCloseButton?: boolean;
  onClose?: () => void;
}> = ({ title, onBack, showCloseButton = false, onClose }) => (
  <View style={headerStyles.container}>
    <Pressable onPress={onBack} style={headerStyles.button}>
      <IconSymbol name="chevron.left" color={barangayColors.primary} size={24} />
    </Pressable>
    <Text style={headerStyles.title}>{title}</Text>
    {showCloseButton ? (
      <Pressable onPress={onClose} style={headerStyles.button}>
        <IconSymbol name="xmark" color={barangayColors.gray} size={24} />
      </Pressable>
    ) : (
      <View style={headerStyles.placeholder} />
    )}
  </View>
);

const DocumentCard: React.FC<{
  document: DocumentTypeInfo;
  onSelect: (type: DocumentType) => void;
}> = ({ document, onSelect }) => (
  <Pressable
    style={documentCardStyles.container}
    onPress={() => onSelect(document.type)}
  >
    <View style={[documentCardStyles.icon, { backgroundColor: document.color }]}>
      <IconSymbol name={document.icon as any} color={barangayColors.white} size={24} />
    </View>
    <View style={documentCardStyles.info}>
      <Text style={documentCardStyles.title}>{document.title}</Text>
      <Text style={documentCardStyles.description}>{document.description}</Text>
      <Text style={documentCardStyles.fee}>Fee: ₱{document.fee}</Text>
    </View>
    <IconSymbol name="chevron.right" color={barangayColors.gray} size={20} />
  </Pressable>
);

const SelectedDocumentHeader: React.FC<{
  document: DocumentTypeInfo;
}> = ({ document }) => (
  <View style={selectedDocStyles.container}>
    <View style={[selectedDocStyles.icon, { backgroundColor: document.color }]}>
      <IconSymbol name={document.icon as any} color={barangayColors.white} size={32} />
    </View>
    <View style={selectedDocStyles.info}>
      <Text style={selectedDocStyles.title}>{document.title}</Text>
      <Text style={selectedDocStyles.fee}>Fee: ₱{document.fee}</Text>
    </View>
  </View>
);

const RequirementsSection: React.FC<{
  requirements: string[];
}> = ({ requirements }) => (
  <View style={requirementsStyles.container}>
    <Text style={requirementsStyles.title}>Requirements:</Text>
    {requirements.map((req, index) => (
      <Text key={index} style={requirementsStyles.item}>• {req}</Text>
    ))}
  </View>
);

const ApplicantInfoSection: React.FC<{
  user: any;
}> = ({ user }) => (
  <View style={formStyles.section}>
    <Text style={formStyles.label}>Applicant Information</Text>
    <View style={formStyles.infoCard}>
      <Text style={formStyles.infoText}>Name: {user?.firstName} {user?.lastName}</Text>
      <Text style={formStyles.infoText}>Address: {user?.address}</Text>
      <Text style={formStyles.infoText}>Phone: {user?.phoneNumber}</Text>
    </View>
  </View>
);

const RequestFormModal: React.FC<{
  visible: boolean;
  selectedDocument: DocumentType | null;
  form: DocumentForm;
  user: any;
  onClose: () => void;
  onFormChange: (field: keyof DocumentForm, value: string) => void;
  onSubmit: () => void;
}> = ({ visible, selectedDocument, form, user, onClose, onFormChange, onSubmit }) => {
  const selectedDocInfo = DOCUMENT_TYPES.find(doc => doc.type === selectedDocument);

  if (!selectedDocInfo) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={modalStyles.container}>
        <Header
          title="Request Form"
          onBack={onClose}
          showCloseButton={true}
          onClose={onClose}
        />

        <ScrollView style={modalStyles.content}>
          <SelectedDocumentHeader document={selectedDocInfo} />
          
          <RequirementsSection requirements={selectedDocInfo.requirements} />
          
          <ApplicantInfoSection user={user} />

          <View style={formStyles.section}>
            <Text style={formStyles.label}>Purpose of Request *</Text>
            <TextInput
              style={formStyles.textInput}
              placeholder="e.g., Employment requirement, Bank account opening"
              value={form.purpose}
              onChangeText={(text) => onFormChange('purpose', text)}
              multiline
            />
          </View>

          <View style={formStyles.section}>
            <Text style={formStyles.label}>Additional Information</Text>
            <TextInput
              style={formStyles.textInput}
              placeholder="Any additional details or special requests"
              value={form.additionalInfo}
              onChangeText={(text) => onFormChange('additionalInfo', text)}
              multiline
            />
          </View>

          <View style={formStyles.submitSection}>
            <Button
              onPress={onSubmit}
              style={formStyles.submitButton}
            >
              Submit Request
            </Button>
            <Text style={formStyles.submitNote}>
              You will receive a notification when your request is processed and payment is required.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// Main Component
export default function DocumentRequestScreen() {
  const { user } = useAuth();
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<DocumentForm>({
    type: 'barangay_clearance',
    purpose: '',
    additionalInfo: '',
  });

  const handleDocumentSelect = (docType: DocumentType) => {
    const selectedDoc = DOCUMENT_TYPES.find(doc => doc.type === docType);
    if (selectedDoc) {
      setSelectedDocument(docType);
      setForm(prev => ({ ...prev, type: docType }));
      setShowForm(true);
    }
  };

  const handleFormChange = (field: keyof DocumentForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitRequest = () => {
    if (!DocumentRequestService.validateForm(form)) return;

    const refNumber = DocumentRequestService.generateReferenceNumber(form.type);
    
    DocumentRequestService.handleSuccess(refNumber, () => {
      setShowForm(false);
      setForm({ type: 'barangay_clearance', purpose: '', additionalInfo: '' });
      router.push('/(resident)/requests');
    });
  };

  const handleBack = () => {
    router.back();
  };

  const handleCloseModal = () => {
    setShowForm(false);
  };

  return (
    <SafeAreaView style={containerStyles.container}>
      <Header 
        title="Request Documents" 
        onBack={handleBack}
      />

      <ScrollView style={containerStyles.content} showsVerticalScrollIndicator={false}>
        <Text style={containerStyles.subtitle}>
          Select the document you need to request
        </Text>

        {DOCUMENT_TYPES.map((document) => (
          <DocumentCard
            key={document.type}
            document={document}
            onSelect={handleDocumentSelect}
          />
        ))}
      </ScrollView>

      <RequestFormModal
        visible={showForm}
        selectedDocument={selectedDocument}
        form={form}
        user={user}
        onClose={handleCloseModal}
        onFormChange={handleFormChange}
        onSubmit={handleSubmitRequest}
      />
    </SafeAreaView>
  );
}

// Style Sheets
const containerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: barangayColors.background,
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
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: barangayColors.white,
    borderBottomWidth: 1,
    borderBottomColor: barangayColors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: barangayColors.text,
  },
  button: {
    padding: 4,
  },
  placeholder: {
    width: 32,
  },
});

const documentCardStyles = StyleSheet.create({
  container: {
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
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: barangayColors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: barangayColors.textLight,
    marginBottom: 4,
  },
  fee: {
    fontSize: 14,
    fontWeight: '600',
    color: barangayColors.primary,
  },
});

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: barangayColors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

const selectedDocStyles = StyleSheet.create({
  container: {
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
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: barangayColors.text,
    marginBottom: 4,
  },
  fee: {
    fontSize: 16,
    fontWeight: '600',
    color: barangayColors.primary,
  },
});

const requirementsStyles = StyleSheet.create({
  container: {
    backgroundColor: barangayColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: barangayColors.text,
    marginBottom: 12,
  },
  item: {
    fontSize: 14,
    color: barangayColors.textLight,
    marginBottom: 4,
  },
});

const formStyles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  label: {
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