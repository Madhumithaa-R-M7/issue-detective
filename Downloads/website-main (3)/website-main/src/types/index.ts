export interface Hospital {
  id: string;
  name: string;
  category?: 'Government' | 'Private' | string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
  emergency_phone?: string;
  email?: string;
  website?: string;
  image_url?: string;
  cover_image?: string;
  is_government?: boolean;
  has_bengali_doctor?: boolean;
  has_bengali_staff?: boolean;
  has_emergency?: boolean;
  has_ambulance?: boolean;
  has_icu?: boolean;
  has_blood_bank?: boolean;
  doctor_count?: number;
  bengali_doctor_count?: number;
  bengali_staff_count?: number;
  specialities?: string[];
  created_at?: any;
  updated_at?: any;
}

export interface BengaliDoctor {
  id: string;
  name: string;
  qualification?: string;
  specialization?: string;
  hospital_id?: string;
  hospital_ids?: string[];
  hospital_name?: string;
  phone?: string;
  email?: string;
  photo_url?: string;
  experience_years?: number;
  languages?: string[];
  availability?: string;
  fee?: number | string;
  verified?: boolean;
  bengali_dialect?: string;
  hometown_in_bengal?: string;
  bio?: string;
  created_at?: any;
  updated_at?: any;
}

export interface BengaliStaff {
  id: string;
  name: string;
  role?: string;
  department?: string;
  hospital_id?: string;
  hospital_ids?: string[];
  hospital_name?: string;
  phone?: string;
  languages?: string[];
  verified?: boolean;
  created_at?: any;
  updated_at?: any;
}

export interface Listing {
  id: string;
  title: string;
  description?: string;
  category?: string;
  type?: string;
  location?: string;
  city?: string;
  price?: number | string;
  phone?: string;
  image_url?: string;
  images?: string[];
  amenities?: string[];
  verified?: boolean;
  created_at?: any;
}

export interface FoodListing {
  id: string;
  title: string;
  name?: string;
  description?: string;
  category?: string;
  cuisine?: string;
  city?: string;
  location?: string;
  price?: number | string;
  phone?: string;
  image_url?: string;
  images?: string[];
  verified?: boolean;
  created_at?: any;
}

export interface BloodBank {
  id: string;
  name: string;
  city?: string;
  address?: string;
  phone?: string;
  blood_groups_available?: string[];
  is_24_7?: boolean;
  created_at?: any;
}

export interface CommunityGroup {
  id: string;
  name: string;
  description?: string;
  category?: string;
  city?: string;
  members_count?: number;
  contact_person?: string;
  phone?: string;
  image_url?: string;
  created_at?: any;
}

export interface MatrimonialProfile {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  occupation?: string;
  education?: string;
  city?: string;
  hometown?: string;
  photo_url?: string;
  bio?: string;
  contact_phone?: string;
  created_at?: any;
}

export interface College {
  id: string;
  name: string;
  type?: string;
  city?: string;
  courses?: string[];
  website?: string;
  phone?: string;
  image_url?: string;
  created_at?: any;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date?: string;
  location?: string;
  city?: string;
  organizer?: string;
  image_url?: string;
  created_at?: any;
}

export interface BlogPost {
  id: string;
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  author?: string;
  published_at?: string;
  image_url?: string;
  category?: string;
  created_at?: any;
}
