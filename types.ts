
export interface Position {
  id: number;
  title: string;
  operator: string;
  department: string;
  grade?: string;
  status: 'Pending Approval' | 'Open' | 'Filled' | 'Closed' | 'Rejected';
  description?: string; // Enhanced field for AI
  hiring_manager?: string; // New: Who requested it
  target_hire_date?: string; // New: When is it needed
  justification?: string; // New: Why is it needed
  request_date?: string; // New: When was it requested
  filled_by?: string; // New: Candidate name who filled the position
}

export interface Employee {
  id: number;
  name: string;
  operator: string;
  department: string;
  position: string;
  grade?: string;
  date_joined?: string;
}

export interface OnboardingTask {
  id: number;
  employee_id: number;
  name: string;
  owner: string; // Specific HR staff delegated to this task
  status: 'Not Started' | 'In Progress' | 'Done';
  due_date?: string;
  comments?: string;
  category?: 'Onboarding' | 'Separation' | 'Performance'; // New field to distinguish task type
}

export interface HRRequest {
  id: number;
  employee_id: number;
  request_type: string;
  status: 'New' | 'In Progress' | 'Completed' | 'Rejected';
  description?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export interface SeparationRecord {
  id: number;
  employee_id: number;
  assigned_hr_name: string;
  final_settlement_received: boolean;
  initiated_at: string;
}

export interface OnboardingRecord {
  id: number;
  employee_id: number;
  assigned_hr_name: string; // Lead HR for the onboarding
  comments: string; // Editable global comments
  initiated_at: string;
}

export interface PerformanceRecord {
  id: number;
  employee_id: number;
  year: string;
  assigned_reviewer: string;
  initiated_at: string;
  comments?: string;
}

// Stats for dashboard
export interface DashboardStats {
  totalEmployees: number;
  openPositions: number;
  pendingRequests: number;
  onboardingActive: number;
  separationActive: number;
  performanceActive: number;
}

// Global Constants
export const COMPANY_GRADES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
