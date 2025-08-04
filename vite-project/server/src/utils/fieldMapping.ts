// Utility functions to map between camelCase (frontend) and snake_case (database)

import { Product, ProductForm } from '../types/product';

/**
 * Convert database product (snake_case) to frontend form (camelCase)
 */
export function productToForm(product: Product): ProductForm {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    category: product.category,
    shortDescription: product.short_description,
    description: product.description,
    videoUrl: product.video_url,
    datasheetUrl: product.datasheet_url,
    images: product.images,
    specifications: product.specifications,
    benefits: product.benefits,
    packaging: product.packaging,
    certifications: product.certifications,
    faqs: product.faqs,
    related: product.related,
    createdAt: product.created_at
  };
}

/**
 * Convert frontend form (camelCase) to database product (snake_case)
 */
export function formToProduct(form: ProductForm): Partial<Product> {
  const product: Partial<Product> = {
    title: form.title,
    slug: form.slug,
    category: form.category,
    short_description: form.shortDescription,
    description: form.description,
    video_url: form.videoUrl,
    datasheet_url: form.datasheetUrl,
    images: form.images,
    specifications: form.specifications,
    benefits: form.benefits,
    packaging: form.packaging,
    certifications: form.certifications,
    faqs: form.faqs,
    related: form.related
  };

  // Only include id if it exists (for updates)
  if (form.id) {
    product.id = form.id;
  }

  return product;
}

/**
 * Validate that images field is always an array of strings
 */
export function validateImages(images: any): string[] {
  if (!images) return [];
  if (Array.isArray(images)) {
    return images.filter(img => typeof img === 'string');
  }
  return [];
}

/**
 * Validate certifications structure
 */
export function validateCertifications(certifications: any): Array<{ src: string; alt: string }> {
  if (!certifications || !Array.isArray(certifications)) return [];
  
  return certifications.filter(cert => 
    cert && 
    typeof cert === 'object' && 
    typeof cert.src === 'string' &&
    cert.src.trim() !== ''
  ).map(cert => ({
    src: cert.src,
    alt: cert.alt || ''
  }));
}