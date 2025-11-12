-- Create profiles table for individual users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create business_profiles table
CREATE TABLE public.business_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  business_email TEXT,
  business_phone TEXT,
  business_address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  business_type TEXT,
  abn TEXT,
  website TEXT,
  description TEXT,
  logo_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_business_roles table to link users to businesses
CREATE TABLE public.user_business_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES public.business_profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, business_id)
);

-- Create user_context table to track current operating context
CREATE TABLE public.user_context (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  context_type TEXT NOT NULL DEFAULT 'individual',
  business_id UUID REFERENCES public.business_profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_business_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_context ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for business_profiles
CREATE POLICY "Users can view businesses they belong to"
  ON public.business_profiles FOR SELECT
  USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM public.user_business_roles
      WHERE user_id = auth.uid() AND business_id = public.business_profiles.id
    )
  );

CREATE POLICY "Business owners can update their businesses"
  ON public.business_profiles FOR UPDATE
  USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM public.user_business_roles
      WHERE user_id = auth.uid() AND business_id = public.business_profiles.id AND role = 'owner'
    )
  );

CREATE POLICY "Users can create businesses"
  ON public.business_profiles FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- RLS Policies for user_business_roles
CREATE POLICY "Users can view their business roles"
  ON public.user_business_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Business owners can manage roles"
  ON public.user_business_roles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.business_profiles
      WHERE id = business_id AND created_by = auth.uid()
    )
  );

-- RLS Policies for user_context
CREATE POLICY "Users can view their own context"
  ON public.user_context FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own context"
  ON public.user_context FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own context"
  ON public.user_context FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Trigger for updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on business_profiles
CREATE TRIGGER update_business_profiles_updated_at
  BEFORE UPDATE ON public.business_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on user_context
CREATE TRIGGER update_user_context_updated_at
  BEFORE UPDATE ON public.user_context
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();