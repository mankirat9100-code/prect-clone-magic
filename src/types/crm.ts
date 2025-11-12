export type ContactType = 'client' | 'consultant' | 'contractor' | 'supplier' | 'lead';
export type ContactStatus = 'active' | 'inactive' | 'lead' | 'qualified' | 'customer';
export type ContactSource = 'website' | 'referral' | 'directory' | 'manual' | 'import';

export type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';

export type ActivityType = 'call' | 'email' | 'meeting' | 'task' | 'note';
export type ActivityStatus = 'pending' | 'completed' | 'cancelled';

export interface CRMContact {
  id: string;
  created_by: string;
  business_id?: string;
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  job_title?: string;
  contact_type: ContactType;
  status: ContactStatus;
  source?: ContactSource;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
  notes?: string;
  assigned_to?: string;
  lead_score?: number;
  lifetime_value?: number;
  created_at: string;
  updated_at: string;
  last_contact_date?: string;
  next_follow_up_date?: string;
}

export interface CRMDeal {
  id: string;
  contact_id: string;
  created_by: string;
  assigned_to?: string;
  deal_name: string;
  deal_value?: number;
  currency?: string;
  stage: DealStage;
  probability?: number;
  expected_close_date?: string;
  actual_close_date?: string;
  description?: string;
  notes?: string;
  lost_reason?: string;
  created_at: string;
  updated_at: string;
  contact?: CRMContact;
}

export interface CRMActivity {
  id: string;
  contact_id?: string;
  deal_id?: string;
  created_by: string;
  activity_type: ActivityType;
  subject: string;
  description?: string;
  status?: ActivityStatus;
  due_date?: string;
  completed_at?: string;
  meeting_date?: string;
  duration_minutes?: number;
  location?: string;
  email_sent_at?: string;
  email_opened?: boolean;
  created_at: string;
  updated_at: string;
  contact?: CRMContact;
  deal?: CRMDeal;
}

export interface CRMInteraction {
  id: string;
  contact_id: string;
  interaction_type: string;
  description?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface CRMMetrics {
  totalContacts: number;
  activeDeals: number;
  pipelineValue: number;
  winRate: number;
  dealsWonThisMonth: number;
  revenueThisMonth: number;
}

export interface DealsByStage {
  stage: DealStage;
  count: number;
  value: number;
}
