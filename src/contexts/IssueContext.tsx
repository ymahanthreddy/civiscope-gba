import React, { createContext, useContext, ReactNode } from 'react';
import { useSupabaseIssues, Issue, Official, IssueStatus, IssueCategory } from '@/hooks/useSupabaseIssues';

interface IssueContextType {
  issues: Issue[];
  officials: Official[];
  loading: boolean;
  addIssue: (issue: {
    category: IssueCategory;
    description: string;
    location: string;
    reporterName: string;
    reporterContact: string;
    imageUrl?: string;
  }) => Promise<string | null>;
  updateIssueStatus: (id: string, status: IssueStatus) => Promise<boolean>;
  assignIssue: (id: string, officialName: string) => Promise<boolean>;
  getIssueByTrackingId: (trackingId: string) => Promise<Issue | null>;
  closeIssue: (id: string, resolutionNotes: string, resolutionImage?: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

const IssueContext = createContext<IssueContextType | undefined>(undefined);

export type { Issue, Official, IssueStatus, IssueCategory };

export function IssueProvider({ children }: { children: ReactNode }) {
  const {
    issues,
    officials,
    loading,
    addIssue: supabaseAddIssue,
    getIssueByTrackingId,
    updateIssueStatus,
    assignIssue,
    closeIssue,
    refetch,
  } = useSupabaseIssues();

  // Wrapper to convert camelCase to snake_case for Supabase
  const addIssue = async (issueData: {
    category: IssueCategory;
    description: string;
    location: string;
    reporterName: string;
    reporterContact: string;
    imageUrl?: string;
  }): Promise<string | null> => {
    return supabaseAddIssue({
      category: issueData.category,
      description: issueData.description,
      location: issueData.location,
      reporter_name: issueData.reporterName,
      reporter_contact: issueData.reporterContact,
      image_url: issueData.imageUrl,
    });
  };

  return (
    <IssueContext.Provider value={{
      issues,
      officials,
      loading,
      addIssue,
      updateIssueStatus,
      assignIssue,
      getIssueByTrackingId,
      closeIssue,
      refetch,
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
