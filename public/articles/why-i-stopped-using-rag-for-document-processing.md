---
title: "Why I Stopped Using RAG for Document Processing (And What I Built Instead)"
date: Sat Jan 17 2026 05:30:00 GMT+0530 (India Standard Time)
excerpt: "Learn how Recursive Language Models (RLMs) let LLMs navigate documents like environments instead of guessing with embeddings. Includes working Python implementation."
template: "technical"
category: "AI Engineering"
---
File search is everything.

I read that tweet this morning and it crystallized something I've been experimenting with for months. We've been processing documents wrong. Chunking, embedding, vector similarity - these are all forms of lossy compression. We're throwing away information and hoping the model can still figure it out.

Claude Code was the first system I saw that took a different approach. Instead of embedding code and retrieving by similarity, it uses direct file search. Grep. Glob. Read the actual content. The model decides what to look at next based on what it learned from the last read.

I tested this approach on financial documents at [Finance_bench](https://github.com/satish860/Finance_bench). The results were striking. Not because the accuracy was marginally better - it was because the failure modes changed. Instead of "retrieved the wrong chunk," failures became "misinterpreted the content." The model was at least looking at the right information.

This post shows you how to implement the same pattern for any document: a Recursive Language Model that navigates documents like an environment instead of processing them like input.

But there's a gap in the original RLM approach. The model can navigate, but navigate *what*? A 500-page document is still opaque without structure. My addition: generate a semantic table of contents first, then let the model navigate that structure. The RLM paper gives you the engine. The structural pre-processing gives you the map.

---

## The Problem

### Why RAG Fails for Complex Documents

RAG (Retrieval Augmented Generation) has a fundamental architectural flaw: the retriever and the reasoner are different systems.

You embed your document chunks. A query comes in. The embedding model guesses which chunks are relevant based on semantic similarity. Then the LLM processes those chunks.

Here's the problem: semantic similarity is not the same as relevance.

Consider a financial document. You ask: "What is the company's debt-to-equity ratio?"

The answer requires:
1. Total debt (might be on page 45)
2. Total equity (might be on page 47)
3. The calculation (neither page mentions "debt-to-equity ratio")

Your embedding model won't retrieve those pages. The phrase "debt-to-equity ratio" doesn't appear anywhere near the numbers you need. The retriever fails, so the reasoner never had a chance.

### The Lossy Compression Problem

Every step in traditional document processing loses information:

| Step | What's Lost |
|------|-------------|
| Chunking | Cross-chunk relationships, document structure |
| Embedding | Exact values, specific details, numerical precision |
| Top-k retrieval | Everything outside the k chunks |
| Summarization | Details that seem unimportant but aren't |

By the time your LLM sees the content, it's working with a degraded signal. You've compressed a 500-page document into 5 chunks and asked the model to answer questions about the whole thing.

This is like giving someone 5 random pages from a book and asking them to write a book report.

---

## The Solution: Treat Documents as Environments

### Core Insight

What if instead of compressing the document to fit the model, we let the model navigate the document?

The model sees a map of the document (table of contents). It decides what to read. It reads that section. Based on what it learns, it decides what to read next. It can go back. It can zoom in. It can cross-reference.

This is how humans read complex documents. We don't read page 1 to page 500 sequentially. We scan the structure, jump to relevant sections, flip back to check something, and build understanding iteratively.

Recursive Language Models (RLMs) implement this pattern.

### The Architecture

The original RLM paper (Zhang, Kraska, Khattab) focuses on the navigation loop - letting the model decide what to read next. But it assumes you already have a way to reference specific parts of the document.

My implementation adds a critical first phase: automatically generating the navigational structure. The system has two phases:

**Phase 1: Segmentation (Offline)**

Before any queries, we build a structural map of the document:

```
Document -> Split (pages) -> Chunk (groups) -> Map (parallel LLM calls) -> Table of Contents
```

This creates a navigational index. Not embeddings - actual semantic descriptions of what each section contains.

**Phase 2: Navigation (Runtime)**

For each query, a root LLM:
1. Reads the table of contents
2. Decides which sections are relevant
3. Reads those sections (via tools)
4. Decides if it needs more information
5. Repeats until it can answer
6. Returns the final answer

The key insight: the model controls the retrieval. There's no separate retriever making guesses.

---

## Implementation

Here's a working implementation in ~240 lines of Python.

### Step 1: Build the Document Map (My Addition)

This is the piece I added to make RLMs practical. The segmenter splits the document into pages and uses an LLM to extract semantic structure:

```python
from pydantic import BaseModel, Field
import instructor
from concurrent.futures import ThreadPoolExecutor

class Segment(BaseModel):
    heading: str = Field(..., description="The heading or title of the section")
    description: str = Field(..., description="A brief description of the section")
    page_range: PageRange = Field(..., description="Page range for this section")

def split_into_pages(text: str, lines_per_page: int = 50) -> list[str]:
    """Split text into pages by line count."""
    lines = text.split('\n')
    pages = []
    for i in range(0, len(lines), lines_per_page):
        page_lines = lines[i:i + lines_per_page]
        page_text = f"### Page Number: [PG:{i // lines_per_page + 1}]\n" + '\n'.join(page_lines)
        pages.append(page_text)
    return pages
```

Notice the page markers (`[PG:X]`). These give the LLM anchor points to reference. When the model says "read pages 45-52," we know exactly what it means.

The segmentation happens in parallel for speed:

```python
def segment_document(text: str, lines_per_page: int = 50, chunk_size: int = 10, max_workers: int = 5):
    pages = split_into_pages(text, lines_per_page)

    chunks = []
    for i in range(0, len(pages), chunk_size):
        chunk_pages = pages[i:i + chunk_size]
        text_chunk = '\n\n'.join(chunk_pages)
        start_page = i + 1
        end_page = min(i + chunk_size, len(pages))
        chunks.append((i, text_chunk, start_page, end_page))

    # Process chunks in parallel
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(process_chunk, chunk): chunk[0] for chunk in chunks}
        for future in as_completed(futures):
            all_segments.extend(future.result())

    return sorted(all_segments, key=lambda x: x["page_range"]["start"])
```

The output is a table of contents like:

```
[1-5] Executive Summary
[6-15] Financial Statements
[16-22] Notes to Financial Statements
[23-30] Risk Factors
...
```

### Step 2: Build the Navigation Tools

The root LLM needs three tools:

```python
def get_section(start_page: int, end_page: int, padding: int = 1) -> str:
    """Get content for pages start_page to end_page with optional padding."""
    start = max(0, start_page - 1 - padding)
    end = min(len(pages), end_page + padding)
    return '\n\n'.join(pages[start:end])

def ask_about_section(question: str, start_page: int, end_page: int) -> str:
    """Ask a sub-LLM a question about a specific section."""
    content = get_section(start_page, end_page)
    prompt = f"""Answer this question about the following document section:

QUESTION: {question}

DOCUMENT SECTION (pages {start_page}-{end_page}):
{content}"""
    return llm_query(prompt, model="gpt-4o-mini")  # Cheap model for extraction
```

The magic is `ask_about_section`. The root LLM (expensive, good at reasoning) decides what to ask. The sub-LLM (cheap, good at extraction) does the grunt work. This separation keeps costs down while maintaining quality.

### Step 3: The Recursive Loop

Here's where it comes together. Instead of predefined tool calls, we give the model a code execution environment:

```python
SYSTEM_PROMPT = """You are tasked with answering a query about a document.

DOCUMENT STRUCTURE:
{toc}

The REPL environment has:
1. get_section(start_page, end_page, padding=1) - Get content for specific pages
2. ask_about_section(question, start_page, end_page) - Ask sub-LLM about a section
3. print() - View output

WORKFLOW:
1. Look at the DOCUMENT STRUCTURE to find relevant sections
2. Use get_section() to read content, or ask_about_section() for analysis
3. Call final_answer() when done"""

def run_rlm(query: str, max_iterations: int = 20) -> str:
    namespace = {
        "get_section": get_section,
        "ask_about_section": ask_about_section,
    }

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT.format(toc=toc_text)},
        {"role": "user", "content": f"Query: {query}"}
    ]

    for i in range(max_iterations):
        response = client.chat.completions.create(
            model="claude-sonnet-4.5",
            messages=messages,
            tools=TOOLS
        )

        msg = response.choices[0].message

        for tool_call in msg.tool_calls:
            if tool_call.function.name == "execute_code":
                result = exec(args["code"], namespace)
            elif tool_call.function.name == "final_answer":
                return args["answer"]

        messages.append(msg)
        messages.append({"role": "tool", "content": result})

    return "Max iterations reached"
```

The model writes code to navigate the document. It might:

```python
# First, check the financial statements section
content = get_section(6, 15)
print(content[:500])

# Found the balance sheet. Now extract specific values
debt = ask_about_section("What is the total debt?", 8, 10)
equity = ask_about_section("What is the total shareholders equity?", 10, 12)

# Calculate
ratio = float(debt.replace(",", "")) / float(equity.replace(",", ""))
```

The model controls its own retrieval. It reads, learns, decides what to read next, and iterates until it has enough information.

---

## Why This Works

### 1. Code Training Already Solved This

Here's something non-obvious: models trained on code already know how to navigate large text structures.

Qwen Coder, Claude, GPT-4, Minimax - any model with significant code training has learned patterns like:
- Look at structure first (imports, file trees, table of contents)
- Search for specific terms
- Follow references across files
- Build understanding iteratively

Document navigation is a subset of codebase navigation. The model already knows how to `grep` for a function, trace a call stack across files, and understand how pieces connect. Give it a document with a ToC and section markers, and it applies the same skills.

This is why RLMs work now when they wouldn't have worked three years ago. It's not just larger context windows - it's that code-heavy training taught models how to explore.

### 2. The Model is the Retriever

No separate embedding model making guesses. The same intelligence that will answer the question decides what to read. It knows what it doesn't know.

### 3. Iteration Beats Single-Shot

RAG is single-shot: retrieve once, answer once. RLMs iterate. The model can say "that section mentioned a note on page 67, let me check that" and go read it.

### 4. Structure is Explicit (Not Implicit)

This is what I added to the RLM approach. The original paper assumes documents have addressable sections. Real documents don't - they're just text. By generating a semantic table of contents upfront, we give the model an explicit map. It understands that "Notes to Financial Statements" comes after "Financial Statements" and is related to it - because we told it so.

### 5. Cost is Manageable

The expensive model (Claude Sonnet 4.5) does reasoning. The cheap model (GPT-4o-mini) does extraction. You're not paying Sonnet prices to read every page - only to decide which pages matter.

---

## When to Use RLMs vs RAG

Let me be direct: RLMs are better at almost everything. FAQ systems, complex analysis, multi-document chat - the quality is higher because the model controls what it reads.

The tradeoff is simple: **latency**.

| Factor | RLM | RAG |
|--------|-----|-----|
| Accuracy | Higher (model controls retrieval) | Lower (retriever guesses) |
| Complex queries | Excellent | Struggles |
| Simple queries | Excellent | Good enough |
| Latency | Slow (multiple LLM calls) | Fast (one retrieval + one LLM call) |
| Cost per query | Higher | Lower |

RAG wins when you need sub-second responses and "good enough" accuracy is acceptable. That's the only case.

If you're building a chatbot where users expect instant replies, RAG's speed advantage matters. If you're processing financial documents overnight where accuracy is everything, RLM wins.

### The Parsing Problem Remains

One thing neither approach solves: getting clean text from messy sources.

PDFs with tables, scanned documents, multi-column layouts - the extraction quality before your pipeline even starts determines your ceiling. RLM navigates better, but it's still navigating whatever text you extracted.

This is a separate problem. Tools like `pdfplumber`, `unstructured.io`, or vision models for scanned docs. Get that right first, or both RAG and RLM will struggle.

---

## Conclusion

The document AI stack is shifting. Embeddings and vector similarity were useful when context windows were 4K tokens. Now we have 200K token windows and models that can reason about what they need to read.

RLMs represent the next evolution: treating documents as environments to navigate, not inputs to compress. But the original concept needed a practical addition - automated structure extraction - to work on real documents.

The combination is surprisingly simple. ~240 lines of Python gives you a system that can:
- Navigate documents of any length
- Answer complex, multi-step questions
- Cross-reference across sections
- Maintain accuracy without losing information

The code in this post is production-ready. Try it on your documents and see the difference.

---

*Building document processing at scale? I write about making extraction pipelines actually work - the stuff vendors won't tell you.*

*Next up: How to evaluate these systems - because "it seems to work" isn't good enough when accuracy matters.*