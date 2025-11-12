-- Create CRM Contacts table
CREATE TABLE public.crm_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid REFERENCES auth.users(id) NOT NULL,
  business_id uuid REFERENCES business_profiles(id),
  
  -- Basic Info
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  job_title text,
  
  -- Contact Type & Status
  contact_type text NOT NULL CHECK (contact_type IN ('client', 'consultant', 'contractor', 'supplier', 'lead')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'lead', 'qualified', 'customer')),
  source text CHECK (source IN ('website', 'referral', 'directory', 'manual', 'import')),
  
  -- Additional Details
  address text,
  city text,
  state text,
  postal_code text,
  country text DEFAULT 'Australia',
  
  -- CRM Metadata
  tags text[],
  custom_fields jsonb DEFAULT '{}',
  notes text,
  
  -- Relationship Tracking
  assigned_to uuid REFERENCES auth.users(id),
  lead_score integer DEFAULT 0 CHECK (lead_score >= 0 AND lead_score <= 100),
  lifetime_value decimal(10,2) DEFAULT 0,
  
  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_contact_date timestamptz,
  next_follow_up_date timestamptz
);

-- Create CRM Deals table
CREATE TABLE public.crm_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid REFERENCES crm_contacts(id) ON DELETE CASCADE NOT NULL,
  created_by uuid REFERENCES auth.users(id) NOT NULL,
  assigned_to uuid REFERENCES auth.users(id),
  
  deal_name text NOT NULL,
  deal_value decimal(10,2),
  currency text DEFAULT 'AUD',
  
  -- Pipeline stages
  stage text NOT NULL DEFAULT 'lead' CHECK (stage IN ('lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost')),
  probability integer DEFAULT 10 CHECK (probability >= 0 AND probability <= 100),
  expected_close_date date,
  actual_close_date date,
  
  -- Details
  description text,
  notes text,
  lost_reason text,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create CRM Activities table
CREATE TABLE public.crm_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid REFERENCES crm_contacts(id) ON DELETE CASCADE,
  deal_id uuid REFERENCES crm_deals(id) ON DELETE CASCADE,
  created_by uuid REFERENCES auth.users(id) NOT NULL,
  
  activity_type text NOT NULL CHECK (activity_type IN ('call', 'email', 'meeting', 'task', 'note')),
  subject text NOT NULL,
  description text,
  
  -- Task fields
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  due_date timestamptz,
  completed_at timestamptz,
  
  -- Meeting fields
  meeting_date timestamptz,
  duration_minutes integer,
  location text,
  
  -- Email fields
  email_sent_at timestamptz,
  email_opened boolean DEFAULT false,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create CRM Interactions table
CREATE TABLE public.crm_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid REFERENCES crm_contacts(id) ON DELETE CASCADE NOT NULL,
  interaction_type text NOT NULL,
  description text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for crm_contacts
CREATE POLICY "Users can view their own contacts"
  ON public.crm_contacts FOR SELECT
  USING (auth.uid() = created_by OR auth.uid() = assigned_to);

CREATE POLICY "Users can view business contacts"
  ON public.crm_contacts FOR SELECT
  USING (
    business_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM user_business_roles
      WHERE user_id = auth.uid() AND business_id = crm_contacts.business_id
    )
  );

CREATE POLICY "Users can insert contacts"
  ON public.crm_contacts FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their contacts"
  ON public.crm_contacts FOR UPDATE
  USING (auth.uid() = created_by OR auth.uid() = assigned_to);

CREATE POLICY "Users can delete their contacts"
  ON public.crm_contacts FOR DELETE
  USING (auth.uid() = created_by);

-- RLS Policies for crm_deals
CREATE POLICY "Users can view deals for their contacts"
  ON public.crm_deals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM crm_contacts
      WHERE crm_contacts.id = crm_deals.contact_id
      AND (crm_contacts.created_by = auth.uid() OR crm_contacts.assigned_to = auth.uid())
    )
  );

CREATE POLICY "Users can insert deals"
  ON public.crm_deals FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their deals"
  ON public.crm_deals FOR UPDATE
  USING (auth.uid() = created_by OR auth.uid() = assigned_to);

CREATE POLICY "Users can delete their deals"
  ON public.crm_deals FOR DELETE
  USING (auth.uid() = created_by);

-- RLS Policies for crm_activities
CREATE POLICY "Users can view activities for their contacts"
  ON public.crm_activities FOR SELECT
  USING (
    auth.uid() = created_by OR
    (contact_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM crm_contacts
      WHERE crm_contacts.id = crm_activities.contact_id
      AND (crm_contacts.created_by = auth.uid() OR crm_contacts.assigned_to = auth.uid())
    ))
  );

CREATE POLICY "Users can insert activities"
  ON public.crm_activities FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their activities"
  ON public.crm_activities FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their activities"
  ON public.crm_activities FOR DELETE
  USING (auth.uid() = created_by);

-- RLS Policies for crm_interactions
CREATE POLICY "Users can view interactions for their contacts"
  ON public.crm_interactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM crm_contacts
      WHERE crm_contacts.id = crm_interactions.contact_id
      AND (crm_contacts.created_by = auth.uid() OR crm_contacts.assigned_to = auth.uid())
    )
  );

CREATE POLICY "System can insert interactions"
  ON public.crm_interactions FOR INSERT
  WITH CHECK (true);

-- Create updated_at trigger for crm_contacts
CREATE TRIGGER update_crm_contacts_updated_at
  BEFORE UPDATE ON public.crm_contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create updated_at trigger for crm_deals
CREATE TRIGGER update_crm_deals_updated_at
  BEFORE UPDATE ON public.crm_deals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create updated_at trigger for crm_activities
CREATE TRIGGER update_crm_activities_updated_at
  BEFORE UPDATE ON public.crm_activities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_crm_contacts_created_by ON public.crm_contacts(created_by);
CREATE INDEX idx_crm_contacts_assigned_to ON public.crm_contacts(assigned_to);
CREATE INDEX idx_crm_contacts_status ON public.crm_contacts(status);
CREATE INDEX idx_crm_contacts_contact_type ON public.crm_contacts(contact_type);
CREATE INDEX idx_crm_deals_contact_id ON public.crm_deals(contact_id);
CREATE INDEX idx_crm_deals_stage ON public.crm_deals(stage);
CREATE INDEX idx_crm_activities_contact_id ON public.crm_activities(contact_id);
CREATE INDEX idx_crm_activities_deal_id ON public.crm_activities(deal_id);
CREATE INDEX idx_crm_interactions_contact_id ON public.crm_interactions(contact_id);