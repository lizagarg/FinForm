-- Create tables for Sahayika database (if using Supabase/Neon)

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  father_name VARCHAR(255),
  address TEXT,
  phone_number VARCHAR(20),
  aadhaar_number VARCHAR(12),
  date_of_birth DATE,
  bank_account VARCHAR(50),
  ifsc_code VARCHAR(11),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forms table
CREATE TABLE IF NOT EXISTS forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  form_type VARCHAR(100),
  form_data JSONB NOT NULL,
  image_url TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Form templates table
CREATE TABLE IF NOT EXISTS form_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  fields JSONB NOT NULL,
  language VARCHAR(10) DEFAULT 'hi',
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert common form templates
INSERT INTO form_templates (name, description, fields, category) VALUES
('PM-Kisan Application', 'Pradhan Mantri Kisan Samman Nidhi Yojana', 
 '[
   {"label": "नाम / Name", "type": "text", "required": true},
   {"label": "पिता का नाम / Father Name", "type": "text", "required": true},
   {"label": "आधार नंबर / Aadhaar Number", "type": "text", "required": true},
   {"label": "बैंक खाता संख्या / Bank Account Number", "type": "text", "required": true},
   {"label": "IFSC कोड / IFSC Code", "type": "text", "required": true},
   {"label": "भूमि का विवरण / Land Details", "type": "textarea", "required": true}
 ]', 'government'),

('Jan Dhan Account Opening', 'Pradhan Mantri Jan Dhan Yojana Account Opening',
 '[
   {"label": "नाम / Name", "type": "text", "required": true},
   {"label": "पिता/पति का नाम / Father/Husband Name", "type": "text", "required": true},
   {"label": "जन्म तिथि / Date of Birth", "type": "date", "required": true},
   {"label": "पता / Address", "type": "textarea", "required": true},
   {"label": "आधार नंबर / Aadhaar Number", "type": "text", "required": true},
   {"label": "मोबाइल नंबर / Mobile Number", "type": "tel", "required": true}
 ]', 'banking'),

('Loan Application', 'General Loan Application Form',
 '[
   {"label": "आवेदक का नाम / Applicant Name", "type": "text", "required": true},
   {"label": "पिता का नाम / Father Name", "type": "text", "required": true},
   {"label": "पता / Address", "type": "textarea", "required": true},
   {"label": "व्यवसाय / Occupation", "type": "text", "required": true},
   {"label": "मासिक आय / Monthly Income", "type": "number", "required": true},
   {"label": "ऋण राशि / Loan Amount", "type": "number", "required": true}
 ]', 'financial');

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own forms" ON forms FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own forms" ON forms FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own forms" ON forms FOR UPDATE USING (auth.uid() = user_id);
