export type ConsultantStatus = 'required' | 'optional' | 'not-required' | 'assigned';

export type QuoteStatus = 'not-contacted' | 'contacted' | 'awaiting-quote' | 'quote-received' | 'quote-accepted' | 'declined' | 'rejected';

export interface ShortlistedConsultant {
  companyName: string;
  role: string;
  quoteStatus: QuoteStatus;
  hasUnreadMessages: boolean;
}

export interface Consultant {
  id: string;
  role: string;
  icon: string;
  avatar?: string;
  status: ConsultantStatus;
  category?: 'Consultant' | 'Contractor' | 'Supplier';
  contactName?: string;
  company?: string;
  rating?: number;
  location?: string;
  responseTime?: string;
  specialty?: string;
  brief?: string;
  whyNeeded?: string;
  whenNeeded?: string;
  notes?: string;
}

export interface ProjectStage {
  id: string;
  title: string;
  consultants: Consultant[];
}

export interface DirectoryResult {
  id: string;
  companyName: string;
  specialty: string;
  rating: number;
  responseTime: string;
  location: string;
  role: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: DirectoryResult[];
  timestamp: Date;
}
