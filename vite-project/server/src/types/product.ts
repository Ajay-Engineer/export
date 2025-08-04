// Product type definitions aligned with database schema

export interface Product {
  id: string;
  title: string;
  slug?: string;
  category?: string;
  short_description?: string;
  description?: string;
  video_url?: string;
  datasheet_url?: string;
  images?: string[]; // Array of image URLs
  specifications?: Record<string, any>;
  benefits?: Array<{ title: string; description: string }>;
  packaging?: Array<{ title: string; content: string }>;
  certifications?: Array<{ src: string; alt: string }>;
  faqs?: Array<{ q: string; a: string }>;
  related?: Array<{ title: string; image: string; link: string }>;
  created_at?: string;
}

// Frontend form interface (camelCase for easier form handling)
export interface ProductForm {
  id?: string;
  title: string;
  slug?: string;
  category?: string;
  shortDescription?: string;
  description?: string;
  videoUrl?: string;
  datasheetUrl?: string;
  images?: string[];
  specifications?: Record<string, any>;
  benefits?: Array<{ title: string; description: string }>;
  packaging?: Array<{ title: string; content: string }>;
  certifications?: Array<{ src: string; alt: string }>;
  faqs?: Array<{ q: string; a: string }>;
  related?: Array<{ title: string; image: string; link: string }>;
  createdAt?: string;
}

// Company and Certificate types
export interface Company {
  id: string;
  name: string;
  created_at?: string;
}

export interface Certificate {
  id: string;
  company_id: string;
  src: string;
  alt?: string;
  created_at?: string;
}

// Category mapping for display
export const CATEGORY_LABELS: Record<string, string> = {
  'herbal': 'Herbal Extract Products',
  'palm-jaggery': 'Palm Jaggery Products',
  'coir': 'Coir Products',
  'tea': 'Tea Varieties',
  'health-mix': 'Health Mix',
  'handicraft': 'Handicrafts',
  'egg': 'Egg Products'
};

export const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label
}));