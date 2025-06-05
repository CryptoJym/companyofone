// Company of One Type Definitions

export interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  avatar?: string;
  rating?: number;
}

export interface PainPoint {
  id: string;
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface ConsultationFormData {
  name: string;
  email: string;
  phone?: string;
  businessType?: string;
  currentChallenges?: string;
  goals?: string;
  preferredTime?: string;
}

export interface CTASection {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonHref: string;
  variant?: 'primary' | 'accent' | 'outline';
}