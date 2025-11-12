-- Table for tracking public chatbot usage (rate limiting)
CREATE TABLE public.public_chat_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  messages_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast IP lookups
CREATE INDEX idx_public_chat_ip_time ON public.public_chat_requests(ip_address, created_at);

-- Enable RLS (system only, no user access)
ALTER TABLE public.public_chat_requests ENABLE ROW LEVEL SECURITY;

-- Policy: System can insert rate limit records
CREATE POLICY "System can insert chat requests"
ON public.public_chat_requests
FOR INSERT
WITH CHECK (true);

-- Policy: Admins can view rate limit records
CREATE POLICY "Admins can view chat requests"
ON public.public_chat_requests
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Function to check rate limit
CREATE OR REPLACE FUNCTION public.check_public_chat_rate_limit(
  _ip_address TEXT,
  _max_requests INTEGER DEFAULT 5,
  _time_window_hours INTEGER DEFAULT 1
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO request_count
  FROM public.public_chat_requests
  WHERE ip_address = _ip_address
    AND created_at > now() - (_time_window_hours || ' hours')::INTERVAL;
  
  RETURN request_count < _max_requests;
END;
$$;