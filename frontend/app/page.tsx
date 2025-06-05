import {
  Hero,
  PainPoints,
  SolutionOverview,
  Features,
  SocialProof,
  HowItWorks,
  Pricing,
  FAQ,
  FinalCTA
} from '@/components/index';

export default function Home() {
  // Pain Points Data
  const painPoints = [
    {
      headline: "Working 60+ Hours a Week But Still Behind?",
      description: "You started your business for freedom, but now you're working more hours than ever. Every task feels urgent, and there's never enough time to work ON your business instead of IN it."
    },
    {
      headline: "Unsure Which Tools Actually Drive Growth?",
      description: "You've spent thousands on courses, software, and \"game-changing\" solutions. But you're still guessing which investments actually move the needle versus just drain your budget."
    },
    {
      headline: "Drowning in Tasks That Don't Make Money?",
      description: "Invoicing, scheduling, email management, bookkeeping... The administrative work never ends. You're spending more time on busywork than on what you do best."
    },
    {
      headline: "Making Big Decisions Completely Alone?",
      description: "No team to brainstorm with. No mentor to guide you. Just you, your laptop, and the weight of every decision. The isolation is real, and it's holding you back."
    }
  ];

  // Solution Benefits
  const solutionBenefits = [
    {
      title: "10x Your Output",
      description: "Leverage AI assistants trained on your business to handle repetitive tasks"
    },
    {
      title: "Crystal Clear Focus",
      description: "Know exactly which activities drive revenue and which to eliminate"
    },
    {
      title: "Systematic Growth",
      description: "Follow proven playbooks that have helped 1,000+ solopreneurs scale"
    },
    {
      title: "Never Alone",
      description: "Get on-demand access to experts and a community of successful peers"
    }
  ];

  // Features Data
  const features = [
    {
      headline: "One-on-One Strategic Consulting",
      title: "Your Personal Business Strategist",
      description: "Work directly with experienced consultants who've helped hundreds of solopreneurs scale. Get customized strategies, accountability, and the outside perspective you've been missing.",
      benefits: [
        "Weekly 1:1 strategy sessions",
        "Personalized growth roadmap",
        "Direct Slack access to your consultant",
        "Quarterly business reviews"
      ]
    },
    {
      headline: "AI Assistant Suite",
      title: "Your 24/7 Virtual Team",
      description: "Deploy pre-trained AI assistants that handle your routine tasks with precision. From customer service to content creation, get the help you need without the overhead.",
      benefits: [
        "Custom-trained on your business",
        "Handles email, scheduling, and admin",
        "Creates content in your voice",
        "Learns and improves over time"
      ]
    },
    {
      headline: "Growth Playbooks & Systems",
      title: "Proven Blueprints for Scale",
      description: "Access our library of battle-tested playbooks created from analyzing 1,000+ successful one-person businesses. No more guessing—just follow the system.",
      benefits: [
        "Step-by-step implementation guides",
        "Industry-specific strategies",
        "Automation templates",
        "Revenue optimization frameworks"
      ]
    },
    {
      headline: "Peer Mastermind Community",
      title: "Your Board of Advisors",
      description: "Connect with other successful solopreneurs who get it. Share wins, solve problems together, and build the network that accelerates your growth.",
      benefits: [
        "Curated peer groups",
        "Monthly virtual masterminds",
        "Private community platform",
        "Annual in-person summit"
      ]
    }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "I went from working 70 hours a week to 30, while doubling my revenue. The AI assistants alone saved me 20 hours weekly.",
      name: "Sarah Chen",
      business: "Marketing Consultant",
      result: "2x revenue, 50% less hours"
    },
    {
      quote: "Finally, someone who understands that I want to grow my business, not my team. The strategic consulting transformed how I think about scale.",
      name: "Marcus Johnson",
      business: "SaaS Founder",
      result: "$500K ARR as a team of one"
    },
    {
      quote: "The community aspect changed everything. Having other solopreneurs to bounce ideas off is like having a board of directors on demand.",
      name: "Emily Rodriguez",
      business: "Course Creator",
      result: "10x email list in 6 months"
    }
  ];

  // Stats
  const stats = [
    { value: "1,247", label: "Active Members" },
    { value: "$2.3M", label: "Average Member Revenue" },
    { value: "32hrs", label: "Average Work Week" },
    { value: "4.8/5", label: "Member Satisfaction" }
  ];

  // How It Works Steps
  const steps = [
    {
      title: "Step 1",
      heading: "Discover Your Growth Levers",
      description: "Start with a comprehensive business audit. We'll identify exactly where you're leaving money on the table and which systems will 10x your output."
    },
    {
      title: "Step 2",
      heading: "Get Your Personalized Plan",
      description: "Receive a step-by-step roadmap tailored to your business model, industry, and goals. No generic advice—just what works for you."
    },
    {
      title: "Step 3",
      heading: "Deploy Your Virtual Team",
      description: "We'll set up and train AI assistants on your specific processes, tone, and requirements. Watch tasks that took hours get done in minutes."
    },
    {
      title: "Step 4",
      heading: "Scale With Support",
      description: "Work with your consultant, leverage the community, and continuously optimize. Most members see dramatic results within 90 days."
    }
  ];

  // Pricing Plans
  const pricingPlans = [
    {
      name: "Foundation",
      price: "$497",
      description: "Perfect for solopreneurs just starting to systemize",
      features: [
        "Monthly consulting call",
        "Basic AI assistant",
        "Core playbook library",
        "Community access"
      ]
    },
    {
      name: "Accelerator",
      price: "$997",
      description: "For established solopreneurs ready to scale fast",
      features: [
        "Weekly consulting calls",
        "Full AI assistant suite",
        "All playbooks & templates",
        "Priority community access",
        "Quarterly strategy sessions"
      ],
      highlighted: true
    },
    {
      name: "Empire",
      price: "$2,497",
      description: "For solopreneurs building 7-figure businesses",
      features: [
        "Unlimited consulting access",
        "Custom AI development",
        "Done-for-you implementations",
        "VIP mastermind group",
        "Annual planning retreat"
      ]
    }
  ];

  // FAQs
  const faqs = [
    {
      question: "Is this just another course?",
      answer: "No. Company of One is a complete operating system including personalized consulting, AI tools, proven systems, and ongoing support. Courses give you information; we give you implementation."
    },
    {
      question: "How quickly will I see results?",
      answer: "Most members report saving 10+ hours in their first month. Revenue improvements typically start within 60-90 days as you implement our growth strategies."
    },
    {
      question: "What if I'm not tech-savvy?",
      answer: "Perfect! Our AI assistants are designed to be incredibly simple. If you can send an email, you can use our tools. Plus, we handle all the setup for you."
    },
    {
      question: "Will this work for my industry?",
      answer: "We've helped solopreneurs in 50+ industries including consulting, e-commerce, SaaS, coaching, creative services, and more. Our strategies adapt to any business model."
    },
    {
      question: "What makes this different from hiring a VA?",
      answer: "Our AI assistants work 24/7, never call in sick, learn from every interaction, and cost a fraction of a human VA. Plus, you get strategic consulting that a VA can't provide."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes. We believe in earning your business every month. Cancel anytime with no penalties or hidden fees."
    }
  ];

  // Trust Badges
  const trustBadges = [
    { icon: "🔒", text: "Bank-Level Security" },
    { icon: "🏆", text: "4.8/5 Average Rating" },
    { icon: "💯", text: "30-Day Guarantee" },
    { icon: "🚀", text: "1,247 Success Stories" }
  ];

  return (
    <main className="min-h-screen">
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            // FAQ Schema
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            },
            // Service Schema
            {
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "Company of One - Solopreneur Operating System",
              "description": "Complete business operating system including AI assistants, strategic consulting, and proven systems for solopreneurs.",
              "provider": {
                "@type": "Organization",
                "name": "Company of One"
              },
              "areaServed": "Worldwide",
              "serviceType": "Business Consulting",
              "offers": pricingPlans.map(plan => ({
                "@type": "Offer",
                "name": plan.name,
                "price": plan.price,
                "priceCurrency": "USD",
                "description": plan.description
              }))
            },
            // Product Reviews Schema
            {
              "@context": "https://schema.org",
              "@type": "Product",
              "name": "Company of One Operating System",
              "description": "Complete business operating system for solopreneurs",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "247",
                "bestRating": "5",
                "worstRating": "1"
              },
              "review": testimonials.map(testimonial => ({
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": testimonial.name
                },
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5",
                  "bestRating": "5"
                },
                "reviewBody": testimonial.quote
              }))
            }
          ], null, 2)
        }}
      />

      {/* Hero Section */}
      <Hero
        title="Build More. Grow Fast. Stay One."
        subtitle="The only complete system designed for solopreneurs who refuse to compromise their independence for growth."
        description="Join thousands of successful one-person businesses who've discovered how to scale revenue without scaling headcount. Get the methodology, tools, and support to build a thriving business that runs itself."
        primaryCTA={{
          text: "Get Your Free Business Consultation",
          href: "#consultation"
        }}
        secondaryCTA={{
          text: "See How It Works",
          href: "#how-it-works"
        }}
      />

      {/* Pain Points Section */}
      <PainPoints
        title="Sound Familiar?"
        painPoints={painPoints}
      />

      {/* Solution Overview */}
      <SolutionOverview
        title="Introducing Company of One"
        tagline="The Complete Operating System for Solopreneurs"
        description="Company of One isn't just another productivity hack or business course. It's a comprehensive methodology backed by AI-powered tools and human expertise, designed specifically for businesses that want to stay lean while thinking big."
        benefits={solutionBenefits}
      />

      {/* Features Section */}
      <Features features={features} />

      {/* Social Proof Section */}
      <SocialProof
        title="Join 1,000+ Thriving Solopreneurs"
        testimonials={testimonials}
        stats={stats}
      />

      {/* How It Works Section */}
      <HowItWorks
        title="Your Journey to Effortless Growth"
        steps={steps}
      />

      {/* Pricing Section */}
      <Pricing
        title="Investment Options That Fit Your Growth Stage"
        plans={pricingPlans}
        guarantee="30-Day Money-Back Guarantee: If you don't save at least 10 hours in your first month, we'll refund every penny."
      />

      {/* FAQ Section */}
      <FAQ faqs={faqs} />

      {/* Final CTA Section */}
      <FinalCTA
        headline="Ready to Build More, Grow Fast, and Stay One?"
        subheadline="Join 1,000+ solopreneurs who've discovered the secret to scaling without sacrificing their independence."
        primaryCTA={{
          text: "Get Your Free Business Consultation",
          href: "#consultation"
        }}
        secondaryText="Limited spots available. Book your call today and get a custom growth plan worth $500, absolutely free."
        urgencyElement="⚡ Only 7 consultation spots left this week"
        trustBadges={trustBadges}
        finalTagline="Company of One: Where solopreneurs become empires."
      />
    </main>
  );
}
