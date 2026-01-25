import React, { createContext, useContext, useState, ReactNode } from 'react';

export type IssueCategory = 
  | 'garbage' 
  | 'roads' 
  | 'drainage' 
  | 'streetlights' 
  | 'parks' 
  | 'stray_dogs';

export type IssueStatus = 
  | 'reported' 
  | 'assigned' 
  | 'in_progress' 
  | 'closed';

export interface Issue {
  id: string;
  trackingId: string;
  category: IssueCategory;
  description: string;
  location: string;
  reporterName: string;
  reporterContact: string;
  imageUrl?: string;
  status: IssueStatus;
  assignedTo?: string;
  notes: string[];
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  closureImageUrl?: string;
}

export interface Official {
  id: string;
  name: string;
  department: string;
  assignedIssues: number;
}

interface IssueContextType {
  issues: Issue[];
  officials: Official[];
  addIssue: (issue: Omit<Issue, 'id' | 'trackingId' | 'status' | 'notes' | 'createdAt' | 'updatedAt'>) => string;
  updateIssueStatus: (id: string, status: IssueStatus, note?: string) => void;
  assignIssue: (id: string, officialId: string) => void;
  getIssueByTrackingId: (trackingId: string) => Issue | undefined;
  closeIssue: (id: string, closureImageUrl: string, note: string) => void;
}

const IssueContext = createContext<IssueContextType | undefined>(undefined);

// Generate tracking ID like GBA-2024-XXXXX
const generateTrackingId = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `GBA-${year}-${random}`;
};

// Mock officials
const mockOfficials: Official[] = [
  { id: '1', name: 'Rajesh Kumar', department: 'Sanitation', assignedIssues: 5 },
  { id: '2', name: 'Priya Sharma', department: 'Roads & Infrastructure', assignedIssues: 8 },
  { id: '3', name: 'Anil Verma', department: 'Electrical', assignedIssues: 3 },
  { id: '4', name: 'Sunita Devi', department: 'Parks & Gardens', assignedIssues: 4 },
  { id: '5', name: 'Mohammed Ali', department: 'Animal Control', assignedIssues: 6 },
];

// Mock initial issues
const mockIssues: Issue[] = [
  {
    id: '1',
    trackingId: 'GBA-2024-12345',
    category: 'garbage',
    description: 'Garbage overflow near the main market area. Needs immediate attention.',
    location: 'Koramangala 4th Block, Near Forum Mall',
    reporterName: 'Amit Patel',
    reporterContact: 'amit.patel@email.com',
    status: 'in_progress',
    assignedTo: '1',
    notes: ['Issue reported via web portal', 'Assigned to sanitation team', 'Team dispatched'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    trackingId: 'GBA-2024-12346',
    category: 'roads',
    description: 'Large pothole causing accidents on the main road.',
    location: 'Indiranagar 100ft Road, Near Sony Signal',
    reporterName: 'Sneha Reddy',
    reporterContact: '9876543210',
    status: 'assigned',
    assignedTo: '2',
    notes: ['Urgent: Multiple accident reports'],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    trackingId: 'GBA-2024-12347',
    category: 'streetlights',
    description: 'Multiple streetlights not working in the residential area.',
    location: 'HSR Layout Sector 2',
    reporterName: 'Kiran Rao',
    reporterContact: 'kiran.rao@email.com',
    status: 'closed',
    assignedTo: '3',
    notes: ['Electrical team assigned', 'Bulbs replaced', 'Issue resolved'],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    closedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    closureImageUrl: '/placeholder.svg',
  },
  {
    id: '4',
    trackingId: 'GBA-2024-12348',
    category: 'drainage',
    description: 'Blocked drainage causing water logging during rains.',
    location: 'Jayanagar 4th Block',
    reporterName: 'Meera Iyer',
    reporterContact: 'meera.iyer@email.com',
    status: 'reported',
    notes: ['Awaiting assignment'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: '5',
    trackingId: 'GBA-2024-12349',
    category: 'stray_dogs',
    description: 'Aggressive stray dogs near school entrance.',
    location: 'Whitefield, Near International School',
    reporterName: 'David Thomas',
    reporterContact: '8765432109',
    status: 'in_progress',
    assignedTo: '5',
    notes: ['Animal control notified', 'Team on the way'],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: '6',
    trackingId: 'GBA-2024-12350',
    category: 'parks',
    description: 'Park benches broken and children play area unsafe.',
    location: 'Cubbon Park, Near Bandstand',
    reporterName: 'Lakshmi Nair',
    reporterContact: 'lakshmi.nair@email.com',
    status: 'closed',
    assignedTo: '4',
    notes: ['Maintenance team assigned', 'New benches installed', 'Play area repaired'],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    closedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    closureImageUrl: '/placeholder.svg',
  },
];

export function IssueProvider({ children }: { children: ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [officials] = useState<Official[]>(mockOfficials);

  const addIssue = (issueData: Omit<Issue, 'id' | 'trackingId' | 'status' | 'notes' | 'createdAt' | 'updatedAt'>) => {
    const trackingId = generateTrackingId();
    const newIssue: Issue = {
      ...issueData,
      id: String(issues.length + 1),
      trackingId,
      status: 'reported',
      notes: ['Issue reported via web portal'],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setIssues(prev => [newIssue, ...prev]);
    return trackingId;
  };

  const updateIssueStatus = (id: string, status: IssueStatus, note?: string) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === id) {
        return {
          ...issue,
          status,
          notes: note ? [...issue.notes, note] : issue.notes,
          updatedAt: new Date(),
        };
      }
      return issue;
    }));
  };

  const assignIssue = (id: string, officialId: string) => {
    const official = officials.find(o => o.id === officialId);
    setIssues(prev => prev.map(issue => {
      if (issue.id === id) {
        return {
          ...issue,
          assignedTo: officialId,
          status: 'assigned',
          notes: [...issue.notes, `Assigned to ${official?.name || 'Official'}`],
          updatedAt: new Date(),
        };
      }
      return issue;
    }));
  };

  const getIssueByTrackingId = (trackingId: string) => {
    return issues.find(issue => issue.trackingId.toLowerCase() === trackingId.toLowerCase());
  };

  const closeIssue = (id: string, closureImageUrl: string, note: string) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === id) {
        return {
          ...issue,
          status: 'closed',
          closureImageUrl,
          notes: [...issue.notes, note],
          closedAt: new Date(),
          updatedAt: new Date(),
        };
      }
      return issue;
    }));
  };

  return (
    <IssueContext.Provider value={{
      issues,
      officials,
      addIssue,
      updateIssueStatus,
      assignIssue,
      getIssueByTrackingId,
      closeIssue,
    }}>
      {children}
    </IssueContext.Provider>
  );
}

export function useIssues() {
  const context = useContext(IssueContext);
  if (context === undefined) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
}
