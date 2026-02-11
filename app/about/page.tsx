import Link from 'next/link'
import { ThemeSwitcher } from '@/app/components/ThemeSwitcher'
import { Logo } from '@/app/components/Logo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Satish Venkatakrishnan',
  description: 'Satish Venkatakrishnan — Founder & CEO of DeltaXY, building AI agents for document intelligence across aviation, compliance, and legal. Former VMware Staff Engineer with 17+ years in software architecture.',
  keywords: ['Satish Venkatakrishnan', 'DeltaXY', 'AI Document Automation', 'AI Agents', 'Document Intelligence', 'RLM', 'Document Processing', 'VMware', 'Grant Thornton', 'Aviation AI', 'The Mindful AI'],
  openGraph: {
    type: 'profile',
    locale: 'en_US',
    url: 'https://themindfulai.dev/about',
    title: 'About Satish Venkatakrishnan | The Mindful AI',
    description: 'Founder & CEO of DeltaXY — AI agents for document intelligence. Former VMware Staff Engineer. Writing about practical AI, document processing, and mindful technology.',
    siteName: 'The Mindful AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Satish Venkatakrishnan | The Mindful AI',
    description: 'Founder & CEO of DeltaXY — AI agents for document intelligence. Former VMware Staff Engineer. Writing about practical AI, document processing, and mindful technology.',
  },
  alternates: {
    canonical: 'https://themindfulai.dev/about',
  },
}

export default function AboutPage() {
  const siteUrl = 'https://themindfulai.dev'

  // Person schema for E-E-A-T (Experience, Expertise, Authority, Trust)
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Satish Venkatakrishnan",
    url: `${siteUrl}/about`,
    jobTitle: "Founder & CEO",
    worksFor: {
      "@type": "Organization",
      name: "DeltaXY",
      url: "https://www.deltaxy.ai",
      description: "AI agents for document intelligence across aviation, compliance, and legal domains. 95% extraction accuracy, 40+ hours saved weekly per team.",
    },
    description: "Founder & CEO of DeltaXY building AI agents for document intelligence. Former VMware Staff Engineer with 17+ years in software architecture. Writes about practical AI, document processing with RLMs, and mindful technology.",
    knowsAbout: [
      "Artificial Intelligence",
      "Document Processing",
      "AI Agents",
      "Recursive Language Models",
      "RAG (Retrieval-Augmented Generation)",
      "Software Architecture",
      "Aviation Document Automation",
      "Compliance Automation",
      "Machine Learning",
      "Web Applications",
    ],
    sameAs: [
      "https://www.linkedin.com/in/satish1v",
      "https://www.deltaxy.ai",
    ],
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Shanmugha Arts, Science, Technology and Research Academy (SASTRA University)",
    },
  }

  // BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About",
        item: `${siteUrl}/about`,
      },
    ],
  }

  // FAQPage schema for GEO — common questions about the author
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Who writes The Mindful AI blog?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Mindful AI is written by Satish Venkatakrishnan, Founder & CEO of DeltaXY. Satish has 17+ years of software engineering experience, including 5 years as a Staff Engineer at VMware. He builds AI agents for document intelligence and writes about practical AI, document processing with Recursive Language Models (RLMs), and the mindful use of technology.",
        },
      },
      {
        "@type": "Question",
        name: "What is DeltaXY?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "DeltaXY builds reliable AI agents that eliminate document drudgery across aviation, compliance, and legal domains. Their agents achieve 95% extraction accuracy, save 40+ hours weekly, and go to production in 6 weeks. They work with clients including Grant Thornton, Agami, and World Bank, processing 10,000+ documents across lease agreements, regulatory compliance (DORA), and court transcripts.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between RAG and RLM for document processing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "RAG (Retrieval-Augmented Generation) embeds document chunks and retrieves them via vector similarity search. RLM (Recursive Language Models) lets the LLM navigate documents like environments, making autonomous decisions about where to look. According to benchmarks on 100+ financial documents, RLM achieves 91% accuracy compared to RAG's 72% on complex documents. Satish writes extensively about this comparison on The Mindful AI blog.",
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ThemeSwitcher />

      <div className="container container-article">
        <nav className="back-nav">
          <Link href="/" className="back-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Logo size={24} />
            Back to home
          </Link>
        </nav>

        <article className="article-page article-article about-page">
          <header className="article-header">
            <h1>About</h1>
            <p className="article-intro">
              The person behind The Mindful AI — and why this blog exists.
            </p>
          </header>

          <div className="article-content">

            <h2>Hi, I&apos;m Satish</h2>

            <p>
              I&apos;m <strong>Satish Venkatakrishnan</strong>, Founder &amp; CEO of{' '}
              <a href="https://www.deltaxy.ai" target="_blank" rel="noopener noreferrer">DeltaXY</a> —
              where we build AI agents that eliminate document drudgery across aviation, compliance,
              and legal domains.
            </p>

            <p>
              Before DeltaXY, I spent <strong>17+ years</strong> in software engineering. Five of
              those were at <strong>VMware</strong> as a Staff Engineer, building large-scale
              distributed systems. Before that, I worked as a Senior Architect at DevOn and spent
              nearly a decade at Tata Consultancy Services, transitioning from a junior developer
              to a platform architect across healthcare and insurance domains.
            </p>

            <h2>What We&apos;re Building at DeltaXY</h2>

            <p>
              DeltaXY builds <strong>AI agents for document intelligence</strong> — not chatbots,
              not copilots, but purpose-built agents that read documents like humans do. Leases,
              contracts, transcripts, regulatory filings. They understand context, not just keywords.
            </p>

            <p>The approach is deliberately practical:</p>

            <ul>
              <li><strong>Extract</strong> — Agents read your documents and pull structured data from inconsistent formats</li>
              <li><strong>Learn</strong> — Every human correction makes them smarter. Continuous improvement without retraining from scratch</li>
              <li><strong>Deliver</strong> — Clean outputs flow directly into your systems. No copy-paste. No manual entry</li>
            </ul>

            <p>
              You&apos;re always in control. No black boxes. No hallucinations slipping through.
            </p>

            <div className="about-stats">
              <div className="about-stat">
                <span className="about-stat-number">95%</span>
                <span className="about-stat-label">Extraction accuracy</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-number">40+</span>
                <span className="about-stat-label">Hours saved weekly</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-number">6 wks</span>
                <span className="about-stat-label">To production</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-number">10K+</span>
                <span className="about-stat-label">Documents processed</span>
              </div>
            </div>

            <p>
              We work with <strong>Grant Thornton</strong> on aviation documents — aircraft
              utilization analysis, lease agreements, and compliance reports.
              With <strong>Agami</strong> and the <strong>World Bank</strong> on legal technology —
              processing thousands of court transcripts for legal research at 95%+ accuracy.
              And we&apos;ve automated <strong>DORA compliance</strong> mapping, turning months of
              manual regulatory work into days.
            </p>

            <h2>Why This Blog</h2>

            <p>
              The Mindful AI grew from a conviction: the best technology writing blends
              <strong> practical depth with philosophical grounding</strong>. Too much AI content
              is either breathless hype or impenetrable research papers. I wanted something in between —
              the kind of writing that respects both the reader&apos;s intelligence and their time.
            </p>

            <p>
              The topics come directly from building real systems:
            </p>

            <ul>
              <li>
                <Link href="/articles/why-i-stopped-using-rag-for-document-processing">
                  <strong>Why RAG fails for complex documents</strong>
                </Link>{' '}
                — and how Recursive Language Models (RLMs) achieve 91% accuracy where RAG reaches 72%
              </li>
              <li>
                <Link href="/articles/rag-vs-rlm-document-processing">
                  <strong>RAG vs RLM benchmarks</strong>
                </Link>{' '}
                — head-to-head comparison on 100+ financial documents
              </li>
              <li>
                <Link href="/articles/your-document-ai-accuracy-is-probably-wrong">
                  <strong>Why your document AI accuracy is probably wrong</strong>
                </Link>{' '}
                — how domain-specific evaluation took us from 67% to 89%
              </li>
              <li>
                <Link href="/articles/how-to-evaluate-ai-research-agents">
                  <strong>Evaluating AI research agents</strong>
                </Link>{' '}
                — because comparing AI-written reports is fundamentally harder than comparing code
              </li>
              <li>
                <Link href="/articles/discovering-sandboxes-ai-infrastructure">
                  <strong>AI infrastructure that matters</strong>
                </Link>{' '}
                — sandboxes, safe execution, and the tooling behind reliable AI systems
              </li>
            </ul>

            <p>
              The Zen-inspired aesthetic isn&apos;t decoration. It&apos;s a reminder that the most
              powerful technology serves human understanding — not the other way around.
            </p>

            <h2>Background</h2>

            <div className="about-timeline">
              <div className="about-timeline-item">
                <span className="about-timeline-year">2026 – Present</span>
                <div>
                  <strong>Founder &amp; CEO</strong> at <a href="https://www.deltaxy.ai" target="_blank" rel="noopener noreferrer">DeltaXY</a>
                  <p>AI agents for document intelligence — aviation, compliance, legal</p>
                </div>
              </div>
              <div className="about-timeline-item">
                <span className="about-timeline-year">2023 – 2026</span>
                <div>
                  <strong>Co-Founder</strong> at AskJunior
                  <p>AI-powered knowledge management</p>
                </div>
              </div>
              <div className="about-timeline-item">
                <span className="about-timeline-year">2018 – 2023</span>
                <div>
                  <strong>Staff Engineer</strong> at VMware
                  <p>Large-scale distributed systems · 5 years</p>
                </div>
              </div>
              <div className="about-timeline-item">
                <span className="about-timeline-year">2016 – 2018</span>
                <div>
                  <strong>Senior Architect</strong> at DevOn
                  <p>Multi-team SCRUM architecture · XP practices · DevOps enablement</p>
                </div>
              </div>
              <div className="about-timeline-item">
                <span className="about-timeline-year">2007 – 2016</span>
                <div>
                  <strong>Platform Architect</strong> at Tata Consultancy Services
                  <p>Junior developer → architect · Healthcare &amp; insurance · 9 years</p>
                </div>
              </div>
              <div className="about-timeline-item">
                <span className="about-timeline-year">2003 – 2007</span>
                <div>
                  <strong>B.Tech</strong>, Electronics &amp; Instrumentation
                  <p>SASTRA University</p>
                </div>
              </div>
            </div>

            <h2>Connect</h2>

            <p>
              Based in <strong>Bangalore, India</strong>. Currently working with aviation teams in Dublin.
            </p>

            <div className="about-connect">
              <a href="mailto:Satish@deltaxy.ai" className="about-connect-link">
                <span className="about-connect-icon">✉</span>
                Satish@deltaxy.ai
              </a>
              <a href="https://www.linkedin.com/in/satish1v" target="_blank" rel="noopener noreferrer" className="about-connect-link">
                <span className="about-connect-icon">in</span>
                LinkedIn
              </a>
              <a href="https://www.deltaxy.ai" target="_blank" rel="noopener noreferrer" className="about-connect-link">
                <span className="about-connect-icon">△</span>
                DeltaXY
              </a>
            </div>

          </div>

          <footer className="article-footer">
            <p>May your prompts be skillful and your responses illuminating.</p>
          </footer>
        </article>
      </div>
    </>
  )
}
