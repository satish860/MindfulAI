---
title: "Introducing DeltaXY OCR: Self-Hosted Document Intelligence"
date: "2026-07-07"
excerpt: "Structured OCR for sensitive document workflows: semantic HTML, JSON, Markdown, and bounding boxes on infrastructure you control."
template: "technical"
category: "AI Engineering"
---
Today, we’re introducing DeltaXY OCR: a self-hosted document intelligence layer for converting PDFs, scans, tables, and forms into structured outputs.

Not just text.

Structured HTML. Markdown. JSON. Bounding boxes. Layout blocks. Tables.

DeltaXY OCR is designed for document-heavy teams that need private deployment, auditable outputs, and extraction workflows they can actually improve.

---

## Highlights

- **Self-hosted deployment** for sensitive documents
- **Semantic output**: HTML, Markdown, JSON, and bounding boxes
- **Single-H100 deployment target** for the current stack
- **Speculative decoding** for faster inference
- **Built for downstream workflows**: extraction, validation, review, search, and automation

OCR should not be a black box.

It should be infrastructure.

---

## Examples across document types

Plain OCR gives you words.

Document intelligence gives you structure.

The same pipeline needs to handle statements, cheques, invoices, receipts, forms, and dense tables. Each one fails differently. Each one needs a different kind of structure.

[DocumentShowcase component]

A downstream system should not have to infer this structure from plain text. The OCR layer should preserve it.

---

## What DeltaXY OCR returns

| Output | Why it matters |
|---|---|
| Semantic HTML | Preserves tables, headings, and document layout |
| Markdown | Clean ingestion for search, RAG, and review workflows |
| JSON | Structured extraction for downstream systems |
| Bounding boxes | Source-grounded audit, highlighting, and verification |
| Layout blocks | Distinguishes tables, text, images, headers, and forms |
| Region output | Lets hard areas be retried or reviewed independently |

The goal is not to produce prettier OCR.

The goal is to make documents operational.

---

## Built for private deployment

Many OCR APIs work well for public or low-risk documents.

But some workflows cannot send documents to a black-box API.

Contracts. Claims. Financial statements. Leases. Medical forms. Regulatory filings. Internal reports.

For those workflows, the OCR layer is part of the data boundary.

DeltaXY OCR is designed for private deployment. The current stack targets a single H100 and uses speculative decoding for faster inference. The backend model can change over time without changing the workflow contract: document in, structured output out.

---

## Evaluation note

We tested the current pipeline on a 30-document slice of the OmniOCR / GetOmni benchmark.

Benchmarks are directional. We recommend evaluating on your own documents.

| Evaluation | Result |
|---|---:|
| Initial OCR + extraction run | 81.96% |
| Re-extraction pass | 82.81% |
| Targeted workflow fixes | ~88.77% completed-sample estimate |

The useful part was not the aggregate score.

The useful part was failure attribution: separating OCR misses from extraction errors, formatting issues, and benchmark mismatches.

That is how document systems improve.

---

## Recommended use cases

DeltaXY OCR is built for high-value document workflows:

- invoice and statement processing
- contract and lease extraction
- regulated document review
- insurance and claims workflows
- compliance evidence extraction
- enterprise search and RAG ingestion
- human-in-the-loop review systems

If the document is sensitive, structured, and expensive to process manually, it is a good candidate.

---

## Design partners

We are opening a small number of design-partner slots.

Bring 20–50 representative documents. We will evaluate OCR quality, structured output, extraction accuracy, and deployment requirements.

Good fit:

- sensitive or regulated documents
- recurring document workflows
- tables, forms, scans, or dense layouts
- need for private deployment
- need for audit trails and source-grounded review

[Become a DeltaXY OCR design partner](mailto:satish@deltaxy.ai?subject=Design%20Partner%20Session%20%E2%80%94%20DeltaXY%20OCR&body=Hi%20Satish%2C%0A%0AI%27d%20like%20to%20discuss%20the%20DeltaXY%20OCR%20design%20partner%20program.%0A%0ACompany%3A%0ADocument%20workflow%3A%0AVolume%3A%0ADeployment%20constraints%3A%0APreferred%20meeting%20time%3A%0A)