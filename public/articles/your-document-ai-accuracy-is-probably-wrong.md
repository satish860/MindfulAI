---
title: "Your Document AI Accuracy is Probably Wrong"
date: Tue Jan 13 2026 05:30:00 GMT+0530 (India Standard Time)
excerpt: "67% was our actual accuracy for document extraction - we thought it was 84%. Here's how domain-specific evaluation fixed our blind spots and took us to 89%."
template: "technical"
category: "AI Engineering"
---
67%. That was our actual accuracy for pulling data from documents.

In the industry, we call this **document extraction** - using AI to read documents and capture structured information. Invoice totals. Customer names. Shipping weights. The promise is automation: documents go in, data comes out, humans focus on exceptions.

The reality is messier. And most teams don't know how messy until it's too late.

For months, we thought it was 84%. We used an LLM-as-a-Judge to score extractions 1-5. Average: 4.2. We told clients "highly accurate." We shipped features. We felt confident.

We were wrong.

And it wasn't just the LLM. Human reviewers in our QA loop also gave thumbs up. "Looks good." "Working great." They were sampling documents, eyeballing outputs, moving on.

Then production happened. The same failures appeared week after week. Not edge cases. Not weird anomalies. Predictable, systematic issues that sampling never caught. The scanned paper problem. The entity matching problem. The date format problem.

> **Human review missed them because humans saw 50 documents. The pattern only emerged across 3000.**

We process 3000 aviation documents daily - airway bills, cargo manifests, customs declarations from 47 airlines across 12 countries. Eight source systems. Formats ranging from structured EDI to faded faxes with handwritten annotations.

The Likert scale (those 1-5 ratings) wasn't lying. "Is this extraction good?" just isn't the same question as "Does this match the spec?"

*If you're building or buying document processing at scale, this will save you months.*

---

## The Wrong Question

We were asking the LLM: "Does this look correct?"

We should have been asking: Does the AWB number follow IATA format? Does this airport code exist in our reference database? Does the weight convert correctly between kilograms and pounds?

Generic evaluation treats all fields the same. But a wrong aircraft registration grounds a flight. A wrong shipper name is a minor inconvenience. The Likert scorer doesn't know the difference. Domain evaluation does.

---

## 67% to 89% in Six Weeks

Two engineers. Six weeks. We rebuilt our evaluation from scratch. Domain-specific graders. Field-level accuracy. Segmented reporting.

| Metric | Before | After |
|--------|--------|-------|
| Actual accuracy | 67% | 89% |
| Time to diagnose issues | Days | Minutes |
| Failures caught before production | ~40% | ~95% |
| Model upgrade confidence | Gamble | Certainty |

> **The accuracy gain mattered. The confidence gain mattered more.**

Before domain-specific evals, every model upgrade was a gamble. We'd ship, wait for complaints, then scramble to identify what broke. Now we run the eval harness, see exactly what changed, and ship knowing what will and won't work.

The shift from reactive debugging to proactive quality control changed how we operate.

---

## The Three-Part Fix

Before we could evaluate properly, we had to extract properly.

### Extraction is a Workflow, Not a Prompt

One-shot extraction fails at scale. Ask an LLM to pull 40 fields from an airway bill in a single prompt, and accuracy drops off a cliff. We found the threshold around 8 fields - beyond that, the model starts confusing values, skipping fields, hallucinating relationships that don't exist.

The fix: segment extraction into focused passes. Header fields first. Line items second. Parties (shipper, consignee, notify party) third. Each pass is a simple, bounded task. The workflow orchestrates them into a complete extraction.

Think like a human. You wouldn't glance at a dense document once and recall 40 data points perfectly. You'd work through it section by section, focusing on one cluster of information at a time. LLMs are the same.

This matters for evaluation because each segment becomes its own eval target. Header extraction accuracy. Line item accuracy. Party extraction accuracy. The segmented workflow gives you segmented metrics - which is exactly what you need to diagnose problems.

---

With extraction structured as a workflow, three concepts made evaluation work: **grader types**, **task definitions**, and **dimensional segmentation**.

### Grader Types

Not all fields deserve the same grader. We categorize by how correctness should be measured:

| Type | Use When | Example |
|------|----------|---------|
| **Exact match** | Identifiers, codes, amounts | AWB number must be exactly "020-12345678" |
| **Tolerance match** | Unit conversions, rounding | Weight within 1% after kg-to-lbs conversion |
| **Semantic match** | Names, addresses, entities | "Lufthansa Cargo AG" matches "LH Cargo" |

Exact match is deterministic. Tolerance match handles acceptable variation. Semantic match uses an LLM to judge equivalence - but constrained to specific entity types, not open-ended "does this look right" prompts.

```python
def exact_match(extracted: str, expected: str) -> float:
    """Binary: either it matches or it doesn't."""
    if not extracted:
        return 0.0
    return 1.0 if extracted == expected else 0.0

def numeric_tolerance(extracted: float, expected: float, tolerance: float = 0.01) -> float:
    """Pass if within tolerance, fail otherwise."""
    if expected == 0:
        return 1.0 if extracted == 0 else 0.0
    return 1.0 if abs(extracted - expected) / expected <= tolerance else 0.0

def semantic_entity(extracted: str, expected: str) -> float:
    """LLM judges entity equivalence, not general correctness."""
    return llm_match(extracted, expected, domain="aviation_entities")
```

The grader type is chosen per field, not per document. An airway bill might use exact match for the AWB number, tolerance for weight, and semantic for shipper name - all in the same extraction.

### Task Definitions

Each test case specifies: the input document, expected field values, and which grader applies to each field.

```yaml
tasks:
  - id: "awb_lufthansa_001"
    source: "airline_portal"
    airline: "LH"
    country: "DE"
    input:
      document: "fixtures/awb/lh_001.pdf"
    expected:
      awb_number: "020-12345678"
      origin: "FRA"
      destination: "JFK"
      shipper: "Siemens AG"
      weight_kg: 1250.5
    graders:
      awb_number: exact_match
      origin: exact_match
      destination: exact_match
      shipper: semantic_entity
      weight_kg: numeric_tolerance
```

The metadata fields - source, airline, country - aren't decorative. They enable the analysis that matters most.

### Dimensional Segmentation

A single accuracy number is almost useless. You need to slice by every dimension that could reveal a pattern.

```
EXTRACTION ACCURACY REPORT
==========================

By Source:
  Airline Portal:     94.1%  (n=1,200)
  EDI Messages:       88.3%  (n=750)
  Scanned Paper:      58.2%  (n=300)  <-- problem

By Field:
  AWB Number:         98.2%
  Origin/Dest:        96.4%
  Shipper Name:       71.3%  <-- harder than expected
  Line Items:         64.8%  <-- tables are hard
```

"85% accuracy" tells you nothing actionable. "Scanned paper shipper extraction at 58%" tells you exactly where to focus.

We slice by source system, document type, airline, country, and field. Every slice that might reveal a systematic failure is worth tracking. The overhead is minimal; the insight is substantial.

---

## This Isn't Just Aviation

Aviation isn't uniquely complex. But it made the problem impossible to ignore.

Consider a date field: "01/02/2026". Is that January 2nd or February 1st? If the document came from the US, it's January. From Germany, it's February. Without domain-specific validation that knows which format applies to which source country, you're guessing.

Same field, different formats across 12 countries. Same document type, wildly different quality across 8 source systems. A single accuracy metric across all of that is meaningless. Your API feeds might hit 99% while scanned paper sits at 45%. Aggregate metrics hide exactly the failures you need to find.

Any extraction pipeline processing documents from multiple sources, in multiple formats, with multiple field types will hit this wall eventually. We just hit it faster because aviation made the consequences visible.

---

## Why Teams Resist This

Generic evaluation is comfortable. "4.2 out of 5" feels good in a status report.

Domain evaluation is uncomfortable. "67% accuracy, with shipper name extraction failing on 29% of scanned documents" demands action. It points at specific failures. It names what's broken.

We've found that teams resist domain-specific evals not because they're hard to build, but because the results are hard to face.

> **The aggregate number is a security blanket. The segmented breakdown is a spotlight.**

The Likert scale told us we were doing well. Domain evaluation told us where we were failing. Only one of those led to improvement.

---

## Questions to Ask Your Document AI Vendor

If you're evaluating vendors, these questions separate the ones who know their weaknesses from the ones hiding behind aggregate metrics:

- "What's your accuracy on scanned documents specifically?"
- "How do you measure entity matching - exact string or semantic equivalence?"
- "Can you show me accuracy broken down by document source?"
- "What happens when you update your model - how do you catch regressions?"
- "What's your accuracy on [your hardest document type]?"

If they only have one accuracy number, they don't know where they're failing. And if they don't know, they can't fix it.

---

## The 50-Document Starting Point

If you're running extraction at scale, here's the minimum viable approach:

**Start with your failures.** Pull 50 documents that caused real problems - customer complaints, downstream errors, manual corrections. These are your first test cases. Don't invent synthetic examples; real failures reveal real patterns.

**Identify your critical fields.** What breaks downstream if this field is wrong? Those fields get exact-match graders. Everything else can start with semantic matching and tighten later.

**Add metadata to every test case.** Source system, document type, country, anything that might explain systematic failures. You won't know which dimensions matter until you can slice by them.

**Run the eval on every model change.** Not just major upgrades - any prompt tweak, any preprocessing change. The harness should run in CI. Regressions should block deploys.

The goal isn't perfection. It's knowing exactly where you stand, on which documents, for which fields. That knowledge is what turns extraction from a black box into something you can actually improve.

---

Stop asking "Is this good?"

Start asking "Does this match the spec?"

---

*Building document processing at scale? I write about making extraction pipelines actually work - the stuff vendors won't tell you.*

*Next up: How we handle extraction failures without losing the whole batch - the retry and fallback patterns that stopped the 3am pages.*