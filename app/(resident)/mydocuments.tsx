import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  StatusBar,
  Platform,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { IconSymbol } from '../../components/IconSymbol';
import { barangayColors } from '../../constants/Colors';
import { 
  getDocumentRequestsByResident,
  downloadDocument,
  deleteDocumentRequest 
} from '../../data/mockData';
import { DocumentRequest } from '../../types';

export default function MyDocuments() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocumentRequest[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = () => {
    if (user?.id) {
      const userDocuments = getDocumentRequestsByResident(user.id);
      setDocuments(userDocuments);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDocuments();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleDownload = async (document: DocumentRequest) => {
    if (document.status !== 'completed') {
      Alert.alert('Not Available', 'This document is not ready for download yet.');
      return;
    }

    try {
      const success = await downloadDocument(document.id);
      if (success) {
        Alert.alert('Success', 'Document downloaded successfully!');
      } else {
        Alert.alert('Error', 'Failed to download document. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to download document.');
    }
  };

  const handleDeleteRequest = (documentId: string, documentType: string) => {
    Alert.alert(
      'Cancel Request',
      `Are you sure you want to cancel your ${documentType} request?`,
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes', 
          style: 'destructive',
          onPress: () => {
            const success = deleteDocumentRequest(documentId);
            if (success) {
              Alert.alert('Success', 'Request cancelled successfully.');
              loadDocuments();
            } else {
              Alert.alert('Error', 'Failed to cancel request.');
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return barangayColors.success;
      case 'processing': return barangayColors.accent;
      case 'payment_needed': return barangayColors.warning;
      case 'pending': return barangayColors.gray;
      default: return barangayColors.gray;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Ready for Download';
      case 'processing': return 'Processing';
      case 'payment_needed': return 'Payment Required';
      case 'pending': return 'Pending Review';
      default: return status.replace(/_/g, ' ').toUpperCase();
    }
  };

  const formatDocumentType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getDocumentFee = (document: DocumentRequest) => {
    return document.fee || document.paymentAmount;
  };

  const getCompletedDate = (document: DocumentRequest) => {
    return document.completedDate || document.processedDate;
  };

  const filterDocuments = (status: string) => {
    return documents.filter(doc => doc.status === status);
  };

  const completedDocuments = filterDocuments('completed');
  const processingDocuments = filterDocuments('processing');
  const pendingDocuments = filterDocuments('pending');
  const paymentNeededDocuments = filterDocuments('payment_needed');

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[barangayColors.primary, barangayColors.accent]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Pressable 
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <IconSymbol name="chevron.left" color={barangayColors.white} size={24} />
          </Pressable>
          
          <View style={styles.headerTitle}>
            <Text style={styles.headerTitleText}>My Documents</Text>
            <Text style={styles.headerSubtitle}>
              {documents.length} document{documents.length !== 1 ? 's' : ''} total
            </Text>
          </View>

          <Pressable 
            onPress={() => router.push('/(resident)/documents')} 
            style={styles.newRequestButton}
          >
            <IconSymbol name="plus" color={barangayColors.white} size={20} />
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{completedDocuments.length}</Text>
            <Text style={styles.statLabel}>Ready</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{processingDocuments.length}</Text>
            <Text style={styles.statLabel}>Processing</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{pendingDocuments.length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{paymentNeededDocuments.length}</Text>
            <Text style={styles.statLabel}>Payment</Text>
          </View>
        </View>

        {/* Ready for Download */}
        {completedDocuments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ready for Download</Text>
            {completedDocuments.map((document) => (
              <View key={document.id} style={styles.documentCard}>
                <View style={styles.documentHeader}>
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentType}>
                      {formatDocumentType(document.type)}
                    </Text>
                    <Text style={styles.documentPurpose}>{document.purpose}</Text>
                    <Text style={styles.documentDate}>
                      Completed: {getCompletedDate(document)?.toLocaleDateString() || 'N/A'}
                    </Text>
                  </View>
                  <Pressable
                    style={[styles.statusBadge, { backgroundColor: getStatusColor(document.status) }]}
                    onPress={() => handleDownload(document)}
                  >
                    <IconSymbol name="arrow.down.circle" color={barangayColors.white} size={16} />
                    <Text style={styles.statusText}>Download</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Processing */}
        {processingDocuments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>In Progress</Text>
            {processingDocuments.map((document) => (
              <View key={document.id} style={styles.documentCard}>
                <View style={styles.documentHeader}>
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentType}>
                      {formatDocumentType(document.type)}
                    </Text>
                    <Text style={styles.documentPurpose}>{document.purpose}</Text>
                    <Text style={styles.documentDate}>
                      Requested: {document.requestDate.toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(document.status) }]}>
                    <IconSymbol name="clock" color={barangayColors.white} size={16} />
                    <Text style={styles.statusText}>{getStatusText(document.status)}</Text>
                  </View>
                </View>
                <View style={styles.actions}>
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handleDeleteRequest(document.id, document.type)}
                  >
                    <IconSymbol name="xmark.circle" color={barangayColors.danger} size={20} />
                    <Text style={[styles.actionText, { color: barangayColors.danger }]}>
                      Cancel
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Payment Needed */}
        {paymentNeededDocuments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Required</Text>
            {paymentNeededDocuments.map((document) => (
              <View key={document.id} style={styles.documentCard}>
                <View style={styles.documentHeader}>
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentType}>
                      {formatDocumentType(document.type)}
                    </Text>
                    <Text style={styles.documentPurpose}>{document.purpose}</Text>
                    <Text style={styles.documentAmount}>
                      Amount: ₱{getDocumentFee(document) || '0.00'}
                    </Text>
                  </View>
                  <Pressable
                    style={[styles.statusBadge, { backgroundColor: getStatusColor(document.status) }]}
                    onPress={() => router.push(`/(resident)/payments?requestId=${document.id}`)}
                  >
                    <IconSymbol name="creditcard" color={barangayColors.white} size={16} />
                    <Text style={styles.statusText}>Pay Now</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Pending Review */}
        {pendingDocuments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pending Review</Text>
            {pendingDocuments.map((document) => (
              <View key={document.id} style={styles.documentCard}>
                <View style={styles.documentHeader}>
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentType}>
                      {formatDocumentType(document.type)}
                    </Text>
                    <Text style={styles.documentPurpose}>{document.purpose}</Text>
                    <Text style={styles.documentDate}>
                      Submitted: {document.requestDate.toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(document.status) }]}>
                    <IconSymbol name="hourglass" color={barangayColors.white} size={16} />
                    <Text style={styles.statusText}>{getStatusText(document.status)}</Text>
                  </View>
                </View>
                <View style={styles.actions}>
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handleDeleteRequest(document.id, document.type)}
                  >
                    <IconSymbol name="xmark.circle" color={barangayColors.danger} size={20} />
                    <Text style={[styles.actionText, { color: barangayColors.danger }]}>
                      Cancel
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {documents.length === 0 && (
          <View style={styles.emptyState}>
            <IconSymbol name="doc.text" color={barangayColors.gray} size={64} />
            <Text style={styles.emptyStateTitle}>No Documents Yet</Text>
            <Text style={styles.emptyStateText}>
              You haven't requested any documents yet. Start by making your first request.
            </Text>
            <Pressable
              style={styles.primaryButton}
              onPress={() => router.push('/(resident)/documents')}
            >
              <Text style={styles.primaryButtonText}>Request Document</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: barangayColors.background },
  header: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: barangayColors.white,
  },
  headerSubtitle: {
    fontSize: 12,
    color: barangayColors.white,
    opacity: 0.8,
    marginTop: 2,
  },
  newRequestButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: barangayColors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: barangayColors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: barangayColors.textLight,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: barangayColors.text,
    marginBottom: 12,
  },
  documentCard: {
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
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  documentInfo: {
    flex: 1,
    marginRight: 12,
  },
  documentType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: barangayColors.text,
    marginBottom: 4,
  },
  documentPurpose: {
    fontSize: 14,
    color: barangayColors.textLight,
    marginBottom: 4,
  },
  documentDate: {
    fontSize: 12,
    color: barangayColors.gray,
  },
  documentAmount: {
    fontSize: 14,
    color: barangayColors.warning,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: barangayColors.white,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: barangayColors.border,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: barangayColors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: barangayColors.textLight,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: barangayColors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  primaryButtonText: {
    color: barangayColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});