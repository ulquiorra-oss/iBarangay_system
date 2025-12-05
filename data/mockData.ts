import { 
  User, 
  Resident, 
  Admin, 
  DocumentRequest, 
  Announcement, 
  DirectoryEntry, 
  EmergencyContact,
  AppSettings 
} from '../types';

// Correct profile image imports
const RobertoImg = require('../assets/images/profile.jpg');
const AnaImg = require('../assets/images/ana.jpg');
const PoliceImg = require('../assets/images/police.jpg');
const FireImg = require('../assets/images/fireman.png');
const DoctorImg = require('../assets/images/doctor.png');
const dswdImg = require('../assets/images/dswd.png');
const waterImg = require('../assets/images/water.jpg');
const electricImg = require('../assets/images/electric.png');

// -------------------- Mock Residents --------------------
export const mockResidents: Resident[] = [
  {
    id: '1',
    email: 'juan.delacruz@gmail.com',
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    role: 'resident',
    barangayId: 'brgy-001',
    phoneNumber: '+639123456789',
    address: '123 Rizal Street, Barangay San Antonio',
    verificationStatus: 'verified',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    householdMembers: [
      { id: 'hm-1', firstName: 'Maria', lastName: 'Dela Cruz', relationship: 'Spouse', birthDate: new Date('1985-03-20'), occupation: 'Teacher' },
      { id: 'hm-2', firstName: 'Jose', lastName: 'Dela Cruz', relationship: 'Son', birthDate: new Date('2010-07-15'), occupation: 'Student' }
    ]
  },
  {
    id: '2',
    email: 'maria.santos@gmail.com',
    firstName: 'Maria',
    lastName: 'Santos',
    role: 'resident',
    barangayId: 'brgy-001',
    phoneNumber: '+639987654321',
    address: '456 Bonifacio Avenue, Barangay San Antonio',
    verificationStatus: 'verified',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '3',
    email: 'pedro.ramos@gmail.com',
    firstName: 'Pedro',
    lastName: 'Ramos',
    role: 'resident',
    barangayId: 'brgy-002',
    phoneNumber: '+639112233445',
    address: '789 Mabini Street, Barangay San Gabriel',
    verificationStatus: 'verified',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
    householdMembers: [
      { id: 'hm-3', firstName: 'Luisa', lastName: 'Ramos', relationship: 'Spouse', birthDate: new Date('1988-06-12'), occupation: 'Nurse' },
      { id: 'hm-4', firstName: 'Carlos', lastName: 'Ramos', relationship: 'Son', birthDate: new Date('2012-09-10'), occupation: 'Student' }
    ]
  }
];

// -------------------- Mock Admins --------------------
export const mockAdmins: Admin[] = [
  {
    id: 'admin-1',
    email: 'captain@barangay.gov.ph',
    firstName: 'Roberto',
    lastName: 'Gonzales',
    role: 'admin',
    barangayId: 'brgy-001',
    phoneNumber: '+639111222333',
    position: 'Barangay Captain',
    profileImage: RobertoImg,
    permissions: [
      'manage_documents',
      'manage_payments',
      'manage_residents',
      'manage_announcements',
      'manage_directory',
      'generate_reports'
    ],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'admin-2',
    email: 'secretary@barangay.gov.ph',
    firstName: 'Ana',
    lastName: 'Reyes',
    role: 'admin',
    barangayId: 'brgy-001',
    phoneNumber: '+639444555666',
    position: 'Barangay Secretary',
    profileImage: AnaImg,
    permissions: ['manage_documents', 'manage_residents', 'manage_announcements'],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-01-01'),
  }
];

// -------------------- Mock Document Requests --------------------
export const mockDocumentRequests: DocumentRequest[] = [
  {
    id: 'doc-1',
    residentId: '1',
    type: 'barangay_clearance',
    status: 'completed',
    purpose: 'Employment requirement',
    requestDate: new Date('2024-01-20'),
    processedDate: new Date('2024-01-22'),
    completedDate: new Date('2024-01-22'),
    processedBy: 'admin-1',
    paymentStatus: 'verified',
    paymentAmount: 50,
    fee: 50,
    paymentMethod: 'gcash',
    referenceNumber: 'BC-2024-001',
    documentUrl: 'https://example.com/documents/bc-2024-001.pdf',
    updatedAt: new Date('2024-01-22')
  },
  {
    id: 'doc-2',
    residentId: '1',
    type: 'certificate_of_residency',
    status: 'processing',
    purpose: 'Bank account opening',
    requestDate: new Date('2024-01-25'),
    paymentStatus: 'verified',
    paymentAmount: 30,
    fee: 30,
    paymentMethod: 'paymaya',
    referenceNumber: 'CR-2024-001',
    updatedAt: new Date('2024-01-25')
  },
  {
    id: 'doc-3',
    residentId: '2',
    type: 'business_permit',
    status: 'payment_needed',
    purpose: 'Small business registration',
    requestDate: new Date('2024-01-28'),
    paymentStatus: 'unpaid',
    paymentAmount: 200,
    fee: 200,
    referenceNumber: 'BP-2024-001',
    updatedAt: new Date('2024-01-28')
  },
  {
    id: 'doc-4',
    residentId: '1',
    type: 'cedula',
    status: 'completed',
    purpose: 'Government transaction',
    requestDate: new Date('2024-02-01'),
    processedDate: new Date('2024-02-01'),
    completedDate: new Date('2024-02-01'),
    processedBy: 'admin-2',
    paymentStatus: 'verified',
    paymentAmount: 35,
    fee: 35,
    paymentMethod: 'cash',
    referenceNumber: 'CD-2024-001',
    documentUrl: 'https://example.com/documents/cd-2024-001.pdf',
    updatedAt: new Date('2024-02-01')
  }
];

// -------------------- Mock Announcements --------------------
export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Community Clean-up Drive',
    content: 'Join us this Saturday, February 3rd, for our monthly community clean-up drive. Meeting point at the Barangay Hall at 6:00 AM. Bring your own cleaning materials.',
    type: 'event',
    priority: 'medium',
    publishDate: new Date('2024-01-30'),
    expiryDate: new Date('2024-02-03'),
    authorId: 'admin-1',
    authorName: 'Roberto Gonzales',
    isActive: true,
    targetAudience: 'all'
  },
  {
    id: 'ann-2',
    title: 'Water Interruption Notice',
    content: 'Water supply will be temporarily interrupted on February 5th from 8:00 AM to 5:00 PM for maintenance work on the main pipeline.',
    type: 'maintenance',
    priority: 'high',
    publishDate: new Date('2024-02-01'),
    expiryDate: new Date('2024-02-05'),
    authorId: 'admin-2',
    authorName: 'Ana Reyes',
    isActive: true,
    targetAudience: 'all'
  },
  {
    id: 'ann-3',
    title: 'Free Medical Check-up',
    content: 'Free medical check-up and consultation available at the Barangay Health Center every Wednesday from 9:00 AM to 3:00 PM.',
    type: 'health',
    priority: 'medium',
    publishDate: new Date('2024-01-15'),
    authorId: 'admin-1',
    authorName: 'Roberto Gonzales',
    isActive: true,
    targetAudience: 'residents'
  }
];

// -------------------- Mock Directory Entries --------------------
export const mockDirectoryEntries: DirectoryEntry[] = [
  {
    id: 'dir-1',
    category: 'barangay_officials',
    name: 'Roberto Gonzales',
    position: 'Barangay Captain',
    phoneNumber: '+639111222333',
    email: 'captain@barangay.gov.ph',
    address: 'Barangay Hall, San Antonio',
    profileImage: RobertoImg,
    isEmergency: false,
    isActive: true,
    operatingHours: 'Mon-Fri 8:00 AM - 5:00 PM'
  },
  {
    id: 'dir-2',
    category: 'barangay_officials',
    name: 'Ana Reyes',
    position: 'Barangay Secretary',
    phoneNumber: '+639444555666',
    email: 'secretary@barangay.gov.ph',
    address: 'Barangay Hall, San Antonio',
    profileImage: AnaImg,
    isEmergency: false,
    isActive: true,
    operatingHours: 'Mon-Fri 8:00 AM - 5:00 PM'
  },
  {
    id: 'dir-3',
    category: 'emergency_services',
    name: 'Philippine National Police - Station 5',
    phoneNumber: '117',
    address: 'Police Station 5, Main Road',
    description: 'Emergency police services',
    profileImage: PoliceImg,
    isEmergency: true,
    isActive: true,
    operatingHours: '24/7'
  },
  {
    id: 'dir-4',
    category: 'emergency_services',
    name: 'Bureau of Fire Protection',
    phoneNumber: '116',
    address: 'Fire Station, Central District',
    description: 'Fire emergency services',
    profileImage: FireImg,
    isEmergency: true,
    isActive: true,
    operatingHours: '24/7'
  },
  {
    id: 'dir-5',
    category: 'emergency_services',
    name: 'Emergency Medical Services',
    phoneNumber: '911',
    address: 'District Hospital',
    description: 'Medical emergency services',
    profileImage: DoctorImg,
    isEmergency: true,
    isActive: true,
    operatingHours: '24/7'
  },
  {
    id: 'dir-6',
    category: 'government_agencies',
    name: 'DSWD Local Office',
    phoneNumber: '+639777888999',
    email: 'dswd.local@gov.ph',
    address: 'Government Center, 2nd Floor',
    description: 'Social welfare and development services',
    profileImage: dswdImg,
    isEmergency: false,
    isActive: true,
    operatingHours: 'Mon-Fri 8:00 AM - 5:00 PM'
  },
  {
    id: 'dir-7',
    category: 'utilities',
    name: 'Manila Water Company',
    phoneNumber: '+632-1627-7000',
    email: 'customercare@manilawater.com',
    address: 'Water District Office',
    description: 'Water supply services',
    profileImage: waterImg,
    isEmergency: false,
    isActive: true,
    operatingHours: 'Mon-Fri 8:00 AM - 5:00 PM'
  },
  {
    id: 'dir-8',
    category: 'utilities',
    name: 'MERALCO',
    phoneNumber: '16211',
    email: 'customercare@meralco.com.ph',
    address: 'Electric Company Branch',
    description: 'Electric power services',
    profileImage: electricImg,
    isEmergency: false,
    isActive: true,
    operatingHours: 'Mon-Fri 8:00 AM - 5:00 PM'
  }
];

// -------------------- Mock Emergency Contacts --------------------
export const mockEmergencyContacts: EmergencyContact[] = [
  { id: 'em-1', name: 'Police Emergency', phoneNumber: '117', type: 'police', isActive: true },
  { id: 'em-2', name: 'Fire Emergency', phoneNumber: '116', type: 'fire', isActive: true },
  { id: 'em-3', name: 'Medical Emergency', phoneNumber: '911', type: 'medical', isActive: true },
  { id: 'em-4', name: 'Disaster Response', phoneNumber: '+639123456789', type: 'disaster', isActive: true }
];

// -------------------- Mock App Settings --------------------
export const mockAppSettings: AppSettings = {
  barangayName: 'Barangay San Antonio',
  contactInfo: {
    address: '123 Barangay Hall Road, San Antonio, Quezon City',
    phoneNumber: '+632-8123-4567',
    email: 'info@barangaysanantonio.gov.ph'
  },
  operatingHours: 'Monday to Friday: 8:00 AM - 5:00 PM',
  documentFees: {
    barangay_clearance: 50,
    certificate_of_residency: 30,
    certificate_of_indigency: 25,
    business_permit: 200,
    cedula: 35,
    barangay_id: 40
  },
  paymentMethods: ['gcash', 'paymaya', 'bank_transfer', 'cash', 'over_the_counter']
};

// -------------------- Current User --------------------
export let currentUser: User | null = null;
export const setCurrentUser = (user: User | null) => { 
  currentUser = user; 
  console.log('Current user set:', user?.firstName, user?.lastName, user?.role); 
};
export const getCurrentUser = (): User | null => currentUser;

// -------------------- Helper Functions --------------------
export const getDocumentRequestsByResident = (residentId: string): DocumentRequest[] =>
  mockDocumentRequests.filter(req => req.residentId === residentId);

export const getActiveAnnouncements = (): Announcement[] =>
  mockAnnouncements.filter(ann => ann.isActive && (!ann.expiryDate || ann.expiryDate > new Date()));

export const getDirectoryByCategory = (category: string): DirectoryEntry[] =>
  mockDirectoryEntries.filter(entry => entry.category === category && entry.isActive);

export const getEmergencyContacts = (): EmergencyContact[] =>
  mockEmergencyContacts.filter(contact => contact.isActive);

// -------------------- Document Functions --------------------
export const downloadDocument = async (documentId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const document = mockDocumentRequests.find(doc => doc.id === documentId);
      if (document && document.status === 'completed' && document.documentUrl) {
        console.log(`Downloading document: ${document.type} - ${document.referenceNumber}`);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 1500);
  });
};

export const deleteDocumentRequest = (requestId: string): boolean => {
  const requestIndex = mockDocumentRequests.findIndex(req => req.id === requestId);
  if (requestIndex > -1) {
    mockDocumentRequests.splice(requestIndex, 1);
    console.log(`Document request ${requestId} deleted successfully`);
    return true;
  }
  return false;
};

export const getDocumentRequestsByStatus = (residentId: string, status: string): DocumentRequest[] => {
  return mockDocumentRequests.filter(req => 
    req.residentId === residentId && req.status === status
  );
};

export const getCompletedDocuments = (residentId: string): DocumentRequest[] => {
  return getDocumentRequestsByStatus(residentId, 'completed');
};

export const getPendingDocuments = (residentId: string): DocumentRequest[] => {
  return mockDocumentRequests.filter(req => 
    req.residentId === residentId && 
    (req.status === 'pending' || req.status === 'processing')
  );
};

export const getDocumentsNeedingPayment = (residentId: string): DocumentRequest[] => {
  return getDocumentRequestsByStatus(residentId, 'payment_needed');
};

export const updateDocumentStatus = (requestId: string, status: DocumentRequest['status']): boolean => {
  const document = mockDocumentRequests.find(doc => doc.id === requestId);
  if (document) {
    document.status = status;
    document.updatedAt = new Date();
    
    if (status === 'completed') {
      document.processedDate = new Date();
      document.completedDate = new Date();
    }
    
    console.log(`Document ${requestId} status updated to: ${status}`);
    return true;
  }
  return false;
};

export const getDocumentStats = (residentId: string) => {
  const allDocuments = getDocumentRequestsByResident(residentId);
  
  return {
    total: allDocuments.length,
    completed: allDocuments.filter(doc => doc.status === 'completed').length,
    processing: allDocuments.filter(doc => doc.status === 'processing').length,
    pending: allDocuments.filter(doc => doc.status === 'pending').length,
    paymentNeeded: allDocuments.filter(doc => doc.status === 'payment_needed').length,
  };
};

export const createDocumentRequest = (
  residentId: string, 
  type: DocumentRequest['type'], 
  purpose: string
): DocumentRequest | null => {
  const resident = mockResidents.find(res => res.id === residentId);
  if (!resident) return null;

  const newRequest: DocumentRequest = {
    id: `doc-${mockDocumentRequests.length + 1}`,
    residentId,
    type,
    status: 'pending',
    purpose,
    requestDate: new Date(),
    paymentStatus: 'unpaid',
    paymentAmount: mockAppSettings.documentFees[type] || 0,
    fee: mockAppSettings.documentFees[type] || 0,
    referenceNumber: `${type.slice(0, 2).toUpperCase()}-2024-${String(mockDocumentRequests.length + 1).padStart(3, '0')}`,
    updatedAt: new Date()
  };

  mockDocumentRequests.push(newRequest);
  console.log(`New document request created: ${newRequest.referenceNumber}`);
  return newRequest;
};

export const processDocumentPayment = (
  requestId: string, 
  paymentMethod: 'gcash' | 'paymaya' | 'bank_transfer' | 'cash' | 'over_the_counter'
): boolean => {
  const document = mockDocumentRequests.find(doc => doc.id === requestId);
  if (document && document.status === 'payment_needed') {
    document.paymentStatus = 'verified';
    document.paymentMethod = paymentMethod;
    document.status = 'processing';
    document.updatedAt = new Date();
    
    console.log(`Payment processed for document: ${document.referenceNumber}`);
    return true;
  }
  return false;
};