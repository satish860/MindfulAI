---
title: "Sequoia Got It Half Right. Neither Side Wins Alone."
date: "2026-03-12"
excerpt: "Sequoia says software companies will eat services firms. They won't. A software person can't learn to audit. A service person can't deploy production systems. The winner is a small merged firm — 5 people + AI = the output of 5,000 — and incumbents like TCS, McKinsey, and Big 4 can't copy it because their revenue model IS the headcount."
template: "technical"
category: "AI Engineering"
---
Last week Sequoia published ["Services: The New Software"](https://sequoiacap.com/article/services-the-new-software/) — their thesis that AI will eat professional services. The framework is sharp:

- **Intelligence work** (reading, extracting, processing) — AI does this now
- **Judgement work** (interpreting, advising, deciding) — humans own this
- **Sell the work, not the tool** — autopilots beat copilots

Julien Bek is right about all three. But his conclusion — that a **software company** will be "the next $1T company masquerading as a services firm" — is wrong.

I've spent the last year building AI document intelligence inside a professional services firm. 10,000+ real documents in production. Aviation leases, regulatory compliance, financial audits.

**Neither side wins alone. Not now. Not in 10 years.**

---

## The Problem with Sequoia's Model

Sequoia assumes a software company can learn enough domain expertise to replace a professional services firm.

Two candidates. Both fail.

![Neither side can cross the gap — both require deep knowledge built over years](/images/sequoia-one-directional-merger.png)

### A Software Person Cannot Learn Domain Judgment

Consider an SPV audit in aviation leasing. AI extracts every number perfectly. 100% accuracy.

The audit opinion still requires someone who's done 200 audits to look at those numbers and say: *"This doesn't smell right."*

That smell is Pattern 147 of 500 patterns you've seen in a career. The maintenance reserve looks adequate on paper, but you've seen this exact structure twice before — once at a lessor that went bankrupt. The formula is technically correct but practically insufficient because it doesn't account for shop visit timing under the new MPD revision.

**None of that is in any document. None of that is in any training dataset.** It's scar tissue from a decade of being wrong.

Sequoia says "today's judgement will become tomorrow's intelligence." For some work, yes. For the judgment that carries liability, requires licensing, and determines whether a firm keeps its reputation? **No. Not with better models. Not with more data. Not in 10 years.**

### A Service Person Cannot Build Production Software

Here's where I was initially tempted by the counter-argument: the service person learns to vibe-code. Problem solved.

No. I have people who write code with AI. **They can't build software.**

Writing code is not building software. Building software is not deploying to production. Vibe coding gets you a script that works on your laptop. It does NOT get you:

- **Architecture** — data flows across 7 clients with different formats
- **Error handling** — corrupted PDFs, API timeouts, zips inside zips
- **Deployment** — Azure, Docker, CI/CD, secrets, SSL
- **Monitoring** — knowing it broke at 3 AM Saturday
- **Edge cases** — the 500th document format you didn't expect

Production software requires the same delayed gratification as domain expertise. Years of systems breaking in ways you didn't expect.

**AI gives perceived knowledge — surface-level competence. Deep knowledge in both fields requires years. Neither side crosses.**

---

## So Who Wins?

If the software person can't learn the domain, and the service person can't build the software, the answer isn't one absorbing the other. It's a **new kind of firm** where both merge.

![The Merged Firm — Domain Experts + AI Engine + Software Builders, outcome-based billing](/images/sequoia-merged-firm.png)

**5 people + AI = the output of 5,000.**

Not 50. Five thousand. Because the 50-person team doesn't exist in a vacuum — it exists inside a machine.

---

## The Bureaucracy Multiplier

A Big 4 partner once told me: "30% of our time is client work. 70% is internal."

He wasn't complaining. He thought that was normal.

![Large firm layers of bureaucracy vs. merged firm spending 95% on client work](/images/sequoia-bureaucracy-comparison.png)

For every 50 people doing client work in a large firm, there are 200 people enabling, managing, reporting on, approving, quality-checking, and politicking about that work.

- **Politics layer** — 14 people CC'd debating whether an extraction field should be called "Maintenance Reserve" or "MR Provision." 3 weeks. No outcome.
- **Approval layer** — 3 meetings to approve a change request worth less than the meeting cost
- **Reporting layer** — status reports reporting on status reports
- **Quality layer** — QA reviewing compliance reviewing risk reviewing audit
- **Commercial layer** — 6-week proposals, monthly pricing committees
- **The bench** — people between projects, still on the payroll, factored into blended rates

**At a 5-person firm: 95% of time is client work. The other 5% is invoicing.**

The result:

![Revenue per person — 8.5x more when you count the real overhead](/images/sequoia-revenue-per-person.png)

Revenue per person all-in: **EUR 21,000 at the large firm. EUR 178,000 at the merged firm.** That's not a gap. That's a different species.

---

## Why Incumbents Can't Copy This

If the answer is "merge software + services," shouldn't TCS (200,000 engineers) + McKinsey (45,000 consultants) dominate?

No. **Both sell people, not outcomes.**

**TCS sells developer hours.** AI that reduces headcount doesn't make TCS more profitable. It makes TCS smaller.

**McKinsey sells consultant hours.** An AI system that turns a 6-week engagement into a 5-day engagement doesn't make the partner rich. It makes them redundant.

And even if they tried to merge — imagine the politics. TCS methodology vs. McKinsey methodology. Whose process wins? Whose career ladder? You'd spend 2 years merging bureaucracies before writing a single line of AI code.

**Large + large doesn't equal efficient. Large + large = large squared.**

They'll adopt AI. They'll run pilots. They'll create "AI Centers of Excellence." They'll publish thought leadership.

They will not restructure their billing model. Because that means dismantling the machine — not just the 80% who do intelligence work, but the other 80% who manage, report on, and approve it. That's not restructuring. That's a controlled demolition.

---

## What This Looks Like in Production

I'm not theorizing. This is what we've built:

**Aviation document processing:** 40+ hours/week of manual work → minutes. 7 clients. 200+ documents/month. 95% accuracy.

**Lease agreement extraction:** 3 days per lease (24 person-hours) → 30 minutes. 377 fields, 7,200+ data points. Senior reviewer verifies the 5% the AI flagged.

> *"This is insane. Oh my God. It is just unbelievable."*
> — Senior manager, first production demo

**Regulatory compliance:** 6 weeks and EUR 150,000 (Big 4 pricing) → 10 days and EUR 15,000. 500+ requirements mapped against 6 frameworks. More comprehensive output.

The domain expert couldn't have built the extraction system. The software builder couldn't have validated whether "Article 5(2)(a)" was correctly interpreted. **Together, with AI handling the intelligence work, they delivered 10x the output at a fraction of the cost.**

---

## What Sequoia Should Have Said

**Sequoia's thesis:** "The next $1T company will be a software company masquerading as a services firm."

**The honest version:** "The next wave of market leaders will be small firms where deep domain expertise and deep software expertise merge — selling outcomes, not hours — while incumbents on both sides can't restructure because their revenue model IS the headcount."

The winner:
- Doesn't look like a startup
- Doesn't look like a consulting firm
- Doesn't raise a Series A (profitable from month one)
- Doesn't have a sales team (the work speaks)
- Doesn't fit Sequoia's portfolio model

**It's small. It's weird. And it's going to eat the market from both sides.**

---

*I run a 4-person AI document intelligence firm. 10,000+ documents in production across aviation leasing, regulatory compliance, and legal technology. The merger is real and it's already working. [satish@deltaxy.ai](mailto:satish@deltaxy.ai) | [deltaxy.ai](https://deltaxy.ai)*