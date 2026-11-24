const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

export const api = {
  // Public
  getImpact: () => request<ImpactMetrics>("/impact"),
  getMissions: (params?: string) => request<Mission[]>(`/missions${params ? `?${params}` : ""}`),
  getUpcomingMissions: () => request<Mission[]>("/missions/upcoming"),
  getMission: (id: string) => request<Mission>(`/missions/${id}`),
  getStories: (params?: string) => request<Story[]>(`/stories${params ? `?${params}` : ""}`),
  getStory: (slug: string) => request<Story>(`/stories/${slug}`),
  getRecentDonations: () => request<DonationPublic[]>("/donations/recent"),

  initiateDonation: (data: DonationInitiate) =>
    request<DonationInitResponse>("/donations/initiate", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  verifyDonation: (ref: string) => request<DonationVerifyResponse>(`/donations/verify/${ref}`),

  registerVolunteer: (data: VolunteerForm) =>
    request("/volunteers", { method: "POST", body: JSON.stringify(data) }),

  submitNomination: (data: NominationForm) =>
    request("/nominations", { method: "POST", body: JSON.stringify(data) }),

  submitContact: (data: ContactForm) =>
    request("/contact", { method: "POST", body: JSON.stringify(data) }),

  submitPartner: (data: PartnerForm) =>
    request("/partner", { method: "POST", body: JSON.stringify(data) }),

  // Auth
  login: (email: string, password: string) =>
    request<{ access_token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
};

// Types
export interface ImpactMetrics {
  communities_reached: number;
  patients_treated: number;
  meals_served: number;
  children_supported: number;
  last_updated?: string;
}

export interface Mission {
  id: string;
  title: string;
  description?: string;
  target_state: string;
  target_lga?: string;
  start_date: string;
  end_date?: string;
  planned_services: string[];
  fundraising_goal?: number;
  fundraising_raised: number;
  status: string;
  cover_image?: string;
  patients_consulted?: number;
  meals_distributed?: number;
  school_kits_handed?: number;
  field_notes?: string;
  gallery: string[];
}

export interface Story {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  mission_id?: string | null;
  published?: boolean;
  tags: string[];
  created_at: string;
  updated_at?: string;
}

export interface DonationPublic {
  amount: number;
  currency: string;
  category: string;
  donor_name: string;
  is_anonymous: boolean;
  message?: string;
  paid_at?: string;
}

export interface DonationInitiate {
  amount: number;
  currency?: string;
  category: string;
  donor_name: string;
  donor_email: string;
  donor_phone?: string;
  is_anonymous?: boolean;
  message?: string;
  gateway?: string;
}

export interface DonationInitResponse {
  donation_id: string;
  reference: string;
  gateway: "paystack" | "flutterwave";
  public_key: string;
  amount: number;
  currency: string;
  email: string;
  callback_url: string;
  message: string;
  init_payload?: {
    amount?: number;
    metadata?: Record<string, unknown>;
  };
  customer?: {
    email: string;
    name: string;
    phone_number: string;
  };
  customizations?: {
    title: string;
    description: string;
  };
}

export interface DonationVerifyResponse {
  status: "success" | "pending";
  message: string;
  donation?: {
    id: string;
    reference: string;
    amount: number;
    currency: string;
    category: string;
    donor_name: string;
    is_anonymous: boolean;
    status: string;
    gateway: string;
    created_at: string;
    paid_at?: string | null;
    message?: string | null;
  };
}

export interface VolunteerForm {
  full_name: string;
  email: string;
  phone: string;
  role: string;
  base_location: string;
  license_number?: string;
  specialty?: string;
  availability_notes?: string;
  experience_years?: number;
}

export interface NominationForm {
  community_name: string;
  state: string;
  lga: string;
  estimated_population?: number;
  primary_challenges: string[];
  description?: string;
  submitter_name: string;
  submitter_role: string;
  submitter_phone: string;
  submitter_email?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface PartnerForm {
  organization_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  pledge_type: string;
  description: string;
  estimated_value?: number;
  notes?: string;
}