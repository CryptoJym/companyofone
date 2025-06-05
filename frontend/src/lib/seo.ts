import type { Metadata } from 'next';

// Base URL configuration
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Server-side
  return process?.env?.NODE_ENV === 'production' 
    ? 'https://companyofone.ai' 
    : 'http://localhost:3000';
}

// Default metadata values
export const DEFAULT_META = {
  title: 'Company of One - Scale Your Business Without Scaling Your Team',
  description: 'The complete operating system for solopreneurs. Get AI assistants, strategic consulting, and proven systems to 10x your output while working less. Join 1,000+ thriving one-person businesses.',
  keywords: [
    'solopreneur tools',
    'one person business',
    'scale without employees',
    'solopreneur consulting',
    'AI for small business',
    'business automation',
    'solopreneur community',
    'grow without hiring',
    'solo entrepreneur',
    'business systems',
    'productivity tools',
    'virtual assistant AI'
  ],
  authors: [{ name: 'Company of One' }],
  openGraph: {
    type: 'website' as const,
    locale: 'en_US',
    siteName: 'Company of One',
  },
  twitter: {
    card: 'summary_large_image' as const,
    site: '@companyofone',
    creator: '@companyofone',
  }
};

// Generate metadata for pages
export function generateMetadata({
  title = DEFAULT_META.title,
  description = DEFAULT_META.description,
  path = '',
  image = '/og-image.jpg',
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
} = {}): Metadata {
  const url = `${getBaseUrl()}${path}`;

  return {
    title,
    description,
    keywords: DEFAULT_META.keywords.join(', '),
    authors: DEFAULT_META.authors,
    robots: noIndex ? 'noindex,nofollow' : 'index,follow',
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...DEFAULT_META.openGraph,
      title,
      description,
      url,
      images: [
        {
          url: `${getBaseUrl()}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      ...DEFAULT_META.twitter,
      title,
      description,
      images: [`${getBaseUrl()}${image}`],
    },
  };
}

// JSON-LD structured data schemas
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Company of One',
    url: getBaseUrl(),
    logo: `${getBaseUrl()}/logo.png`,
    description: 'The complete operating system for solopreneurs and one-person businesses.',
    foundingDate: '2024',
    sameAs: [
      'https://twitter.com/companyofone',
      'https://linkedin.com/company/companyofone'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'support@companyofone.ai'
    }
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Company of One',
    url: getBaseUrl(),
    description: 'The complete operating system for solopreneurs.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${getBaseUrl()}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

export function generateServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Company of One - Solopreneur Operating System',
    description: 'Complete business operating system including AI assistants, strategic consulting, and proven systems for solopreneurs.',
    provider: {
      '@type': 'Organization',
      name: 'Company of One',
      url: getBaseUrl()
    },
    areaServed: 'Worldwide',
    serviceType: 'Business Consulting',
    offers: [
      {
        '@type': 'Offer',
        name: 'Foundation Plan',
        price: '497',
        priceCurrency: 'USD',
        description: 'Perfect for solopreneurs just starting to systemize',
        priceValidUntil: '2025-12-31'
      },
      {
        '@type': 'Offer',
        name: 'Accelerator Plan',
        price: '997',
        priceCurrency: 'USD',
        description: 'For established solopreneurs ready to scale fast',
        priceValidUntil: '2025-12-31'
      },
      {
        '@type': 'Offer',
        name: 'Empire Plan',
        price: '2497',
        priceCurrency: 'USD',
        description: 'For solopreneurs building 7-figure businesses',
        priceValidUntil: '2025-12-31'
      }
    ]
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${getBaseUrl()}${item.url}`
    }))
  };
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

export function generateReviewSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Company of One Operating System',
    description: 'Complete business operating system for solopreneurs',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '247',
      bestRating: '5',
      worstRating: '1'
    },
    review: [
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Sarah Chen'
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5'
        },
        reviewBody: 'I went from working 70 hours a week to 30, while doubling my revenue. The AI assistants alone saved me 20 hours weekly.'
      },
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Marcus Johnson'
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5'
        },
        reviewBody: 'Finally, someone who understands that I want to grow my business, not my team. The strategic consulting transformed how I think about scale.'
      }
    ]
  };
}