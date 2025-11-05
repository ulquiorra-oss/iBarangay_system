
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'resident' | 'admin';
  barangayId: string;
  phoneNumber?: string;
  address?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Resident extends User {
  role: 'resident';
  householdMembers?: HouseholdMember[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

export interface Admin extends User {
  role: 'admin';
  position: string;
  permissions: AdminPermission[];
}

export interface HouseholdMember {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
  birthDate: Date;
  occupation?: string;
}

export type AdminPermission = 
  | 'manage_documents'
  | 'manage_payments'
  | 'manage_residents'
  | 'manage_announcements'
  | 'manage_directory'
  | 'generate_reports';

export interface DocumentRequest {
  id: string;
  residentId: string;
  type: DocumentType;
  status: DocumentStatus;
  purpose: string;
  requestDate: Date;
  processedDate?: Date;
  processedBy?: string;
  paymentStatus: PaymentStatus;
  paymentAmount: number;
  paymentMethod?: PaymentMethod;
  paymentProof?: string;
  referenceNumber: string;
  notes?: string;
  documentUrl?: string;
}

export type DocumentType = 
  | 'barangay_clearance'
  | 'certificate_of_residency'
  | 'certificate_of_indigency'
  | 'business_permit'
  | 'cedula'
  | 'barangay_id';

export type DocumentStatus = 
  | 'pending'
  | 'payment_needed'
  | 'processing'
  | 'ready_for_pickup'
  | 'completed'
  | 'rejected';

export type PaymentStatus = 
  | 'unpaid'
  | 'pending_verification'
  | 'verified'
  | 'rejected';

export type PaymentMethod = 
  | 'gcash'
  | 'paymaya'
  | 'bank_transfer'
  | 'cash'
  | 'over_the_counter';

export interface Payment {
  id: string;
  documentRequestId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  proofImage?: string;
  referenceNumber?: string;
  paymentDate: Date;
  verifiedBy?: string;
  verifiedDate?: Date;
  notes?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  publishDate: Date;
  expiryDate?: Date;
  authorId: string;
  authorName: string;
  imageUrl?: string;
  isActive: boolean;
  targetAudience: 'all' | 'residents' | 'officials';
}

export type AnnouncementType = 
  | 'general'
  | 'event'
  | 'emergency'
  | 'maintenance'
  | 'health'
  | 'safety';

export interface DirectoryEntry {
  id: string;
  category: DirectoryCategory;
  name: string;
  position?: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  description?: string;
  isEmergency: boolean;
  isActive: boolean;
  mapUrl?: string;
  website?: string;
  operatingHours?: string;
}

export type DirectoryCategory = 
  | 'barangay_officials'
  | 'emergency_services'
  | 'government_agencies'
  | 'utilities'
  | 'health_services'
  | 'education';

export interface EmergencyContact {
  id: string;
  name: string;
  phoneNumber: string;
  type: 'police' | 'fire' | 'medical' | 'disaster';
  isActive: boolean;
}

export interface Report {
  id: string;
  type: ReportType;
  title: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  generatedBy: string;
  generatedDate: Date;
  data: any;
  fileUrl?: string;
}

export type ReportType = 
  | 'document_requests'
  | 'payments'
  | 'residents'
  | 'announcements'
  | 'monthly_summary'
  | 'quarterly_summary';

export interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  announcementNotifications: boolean;
  documentStatusNotifications: boolean;
  paymentNotifications: boolean;
}

export interface AppSettings {
  barangayName: string;
  barangayLogo?: string;
  contactInfo: {
    address: string;
    phoneNumber: string;
    email: string;
  };
  operatingHours: string;
  documentFees: Record<DocumentType, number>;
  paymentMethods: PaymentMethod[];
}
