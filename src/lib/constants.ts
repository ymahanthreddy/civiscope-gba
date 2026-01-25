import { IssueCategory, IssueStatus } from '@/contexts/IssueContext';

export const CATEGORY_CONFIG: Record<IssueCategory, { 
  label: string; 
  icon: string; 
  color: string;
  bgColor: string;
  description: string;
}> = {
  garbage: {
    label: 'Garbage',
    icon: '🗑️',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    description: 'Waste overflow, improper disposal, unclean areas',
  },
  roads: {
    label: 'Roads & Potholes',
    icon: '🕳️',
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
    description: 'Potholes, damaged roads, broken footpaths',
  },
  drainage: {
    label: 'Drainage',
    icon: '🚰',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: 'Blocked drains, waterlogging, sewage issues',
  },
  streetlights: {
    label: 'Streetlights',
    icon: '💡',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    description: 'Non-functional lights, damaged poles, dark areas',
  },
  parks: {
    label: 'Parks & Gardens',
    icon: '🌳',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: 'Damaged equipment, overgrown areas, unsafe zones',
  },
  stray_dogs: {
    label: 'Stray Animals',
    icon: '🐕',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    description: 'Aggressive strays, animal welfare, safety concerns',
  },
};

export const STATUS_CONFIG: Record<IssueStatus | 'escalated', {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  reported: {
    label: 'Reported',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  assigned: {
    label: 'Assigned',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  in_progress: {
    label: 'In Progress',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  closed: {
    label: 'Closed',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  escalated: {
    label: 'Escalated',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
};

export const WORKFLOW_STEPS = [
  { status: 'reported', label: 'Reported', description: 'Issue submitted by citizen' },
  { status: 'assigned', label: 'Assigned', description: 'Assigned to official' },
  { status: 'in_progress', label: 'In Progress', description: 'Work in progress' },
  { status: 'closed', label: 'Closed', description: 'Issue resolved' },
];
