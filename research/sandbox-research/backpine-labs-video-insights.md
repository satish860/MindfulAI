# The Missing Compute Offering is Finally Here - Cloudflare Containers

**Source:** backpine labs YouTube Channel
**Video URL:** http://www.youtube.com/watch?v=zUQM-bbIbUg
**Date Accessed:** 2025-01-08

---

## Overview

This video explains why Cloudflare Containers are the "missing piece" of Cloudflare's compute ecosystem, focusing on the technical limitations of V8 isolates and how containers solve real-world problems.

---

## The Core Problem: The Worker "Trade-Off"

### V8 Isolate Limitations

Cloudflare's compute ecosystem (Workers, Durable Objects, etc.) is powerful, but its reliance on V8 isolates comes with inherent limitations [[00:07](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=7)].

**What V8 Isolates Do Well:**
- **Incredibly fast cold starts** [[00:19](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=19)]
- Lightweight execution
- Perfect for JavaScript/TypeScript workloads

**What V8 Isolates Cannot Do:**
- **No full Node.js API access** [[00:19](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=19)]
- **No direct file system or OS-level access** [[00:24](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=24)]
- **Limited language/binary support** - difficult to use languages and binaries beyond JavaScript/TypeScript [[00:24](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=24)]

### The Developer Pain Point

**The 2% Problem:** A small part of an application (e.g., 2%) might require an actual server with file system access or specific binaries [[00:40](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=40)].

**Consequences:**
- Forces developers to use a **different cloud provider**
- Requires managing a **separate service**
- Creates **complexity and operational overhead**
- Breaks the unified Cloudflare platform experience

**Quote:** "This is complex and tedious" [[00:40](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=40)]

---

## The Solution: Cloudflare Containers

Cloudflare Containers are presented as the **"missing piece"** of their compute ecosystem [[00:59](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=59)].

**Purpose:**
- Run workloads that are not feasible in the V8 isolate environment
- Integrate directly with the rest of the Cloudflare platform
- Eliminate the need for external services for edge cases

**Philosophy:** Not a VPS replacement, but a new compute primitive that fits *within* the Cloudflare ecosystem [[05:24](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=324)], [[05:46](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=346)].

---

## Real-World Use Case: AI Model Training

The video uses a concrete example of a service that fine-tunes image models [[01:10](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=70)] to illustrate the problem.

### Problem 1: File Zipping

**Scenario:**
- A service (like Replicate) requires training images to be submitted as a single zip file [[01:42](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=102)]
- Images are stored in Cloudflare R2 (object storage)

**What's Needed:**
1. Download multiple files from R2
2. Save them to a file system
3. Zip them together
4. Re-upload the zip file

**Why Workers Can't Do This:**
Workers cannot easily perform file system operations required for zipping [[01:57](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=117)].

---

### Problem 2: File Unpacking

**Scenario:**
- The training output is a `.tar` file containing the needed model (a `.safetensors` file) [[02:43](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=163)]

**What's Needed:**
1. Download the `.tar` file
2. Unpack/extract the contents
3. Access the `.safetensors` model file

**Why Workers Can't Do This:**
Workers cannot unpack `.tar` files to extract contents [[02:48](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=168)].

---

### The Container Solution

With Cloudflare Containers, a developer can:

1. Build a small service in **any language** (Go [[02:07](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=127)], Python [[03:18](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=198)], etc.)
2. Expose an **HTTP endpoint**
3. Call it from a Worker to handle file system-heavy tasks [[02:28](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=148)]

**Architecture:**
```
Worker (orchestration)
    ↓
Container (file system operations)
    ↓
- Download from R2
- Zip/unzip files
- Process data
- Return results
```

---

## Key Benefits & Features

### 1. Language Agnostic [[03:18](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=198)]

You can write your container service in **any language:**
- Go
- Python
- Java
- Rust
- Any language that can expose an HTTP endpoint and be packaged with Docker

**Requirement:** Must expose HTTP endpoint and be Docker-compatible.

---

### 2. Use Binaries

You can now use system binaries that were impossible on Workers:

**Examples:**
- **ffmpeg** for video processing [[05:29](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=329)], [[12:23](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=743)]
- **Python data analytics libraries** (pandas, numpy, etc.) [[05:35](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=335)]
- Archive tools (tar, zip, gzip)
- Image processing libraries
- Any OS-level tool

**Implication:** Unlocks entire classes of workloads previously impossible on Cloudflare.

---

### 3. Integrated Ecosystem

**Not a VPS Replacement:** [[05:46](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=346)]

Containers are a **new, scalable compute primitive** that fits *within* the existing Cloudflare platform [[05:24](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=324)].

**Integration Points:**
- Works alongside Workers
- Integrates with Queues
- Managed by Durable Objects
- Accesses R2, KV, D1, etc.

**Benefit:** Avoids the need to offload parts of your application to another provider [[12:50](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=770)].

**Philosophy:** Complete the Cloudflare platform so developers can build entirely on one infrastructure.

---

## How They Work: Technical Details

### Durable Object Management [[07:30](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=450)]

**Architecture:**
- The lifecycle of a container is **managed by a Durable Object**
- This connection allows a Durable Object to manage a **cluster of containers** [[07:45](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=465)]

**Implication:** Containers inherit Durable Objects' stateful, distributed coordination capabilities.

---

### `Container` Class [[08:02](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=482)]

For simpler use cases, Cloudflare provides a **`Container` class** that:
- Extends the Durable Object class
- Abstracts away lifecycle management boilerplate
- Simplifies common patterns

**Use Case:** If you don't need complex container orchestration, use the Container class for quick setup.

---

### Configuration: `wrangler.toml` [[08:48](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=528)]

You define your container in your `wrangler.toml` file:

**Specify:**
- Path to your Dockerfile
- Managing class (Durable Object or Container class)
- Other settings (ports, environment variables, etc.)

**Example Configuration:**
```toml
[[containers]]
name = "my-container"
dockerfile = "./containers/my-service/Dockerfile"
class = "MyContainer"
```

---

### Interaction from Workers [[09:12](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=552)]

You interact with your container from a Worker:

**Pattern:**
1. Get the Durable Object instance (which manages the container)
2. Use the `fetch` handler, just like a standard Durable Object
3. Container responds via HTTP

**Code Pattern:**
```typescript
// In your Worker
const containerStub = env.MY_CONTAINER.get(id);
const response = await containerStub.fetch(request);
```

**Implication:** Familiar API for Cloudflare developers - same pattern as Durable Objects.

---

## Technical Architecture Summary

```
┌─────────────────────────────────────────────┐
│         Cloudflare Worker                   │
│         (Orchestration Layer)               │
└──────────────┬──────────────────────────────┘
               │
               │ HTTP Request
               ↓
┌─────────────────────────────────────────────┐
│       Durable Object                        │
│       (Container Lifecycle Manager)         │
└──────────────┬──────────────────────────────┘
               │
               │ Manages
               ↓
┌─────────────────────────────────────────────┐
│       Container (Cluster)                   │
│       - File System Access                  │
│       - OS-level Binaries                   │
│       - Any Language/Runtime                │
│       - Long-running Processes              │
└─────────────────────────────────────────────┘
```

---

## Key Use Cases Unlocked

Based on the video, containers enable:

1. **File Processing**
   - Zipping/unzipping archives
   - Tar extraction
   - File transformations

2. **AI/ML Workflows**
   - Model training data preparation
   - Model artifact processing
   - Data preprocessing

3. **Media Processing**
   - Video transcoding (ffmpeg)
   - Image manipulation
   - Audio processing

4. **Data Analytics**
   - Python data science libraries
   - Heavy computation
   - Statistical analysis

5. **Build Pipelines**
   - Compilation
   - Testing
   - Artifact generation

---

## Strategic Positioning

### What Cloudflare Containers Are:
✅ A new compute primitive within the Cloudflare platform
✅ The "missing piece" for file system and OS-level access
✅ Integrated with Workers, Durable Objects, Queues, R2, etc.
✅ Scalable and managed

### What They Are NOT:
❌ A VPS replacement [[05:46](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=346)]
❌ A standalone container hosting service
❌ A competitor to AWS EC2, DigitalOcean Droplets, etc.

### The Vision:
**Unified Platform:** Enable developers to build 100% of their application on Cloudflare, without needing external services for edge cases [[12:50](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=770)].

---

## Comparison to Traditional Approach

### Before Containers:
```
Cloudflare Workers (main app)
    ↓
    ⚠️ Need file system access?
    ↓
Separate VPS/Service (AWS, DigitalOcean, etc.)
    ↓
Operational overhead, complexity, separate billing
```

### With Containers:
```
Cloudflare Workers (main app)
    ↓
Cloudflare Container (file system tasks)
    ↓
Unified platform, integrated, same billing
```

**Benefit:** Simplicity, unified platform, better integration.

---

## Developer Experience Insights

### Familiarity:
- Uses **Dockerfile** (standard Docker format)
- Interacts via **HTTP** (standard web protocol)
- Managed like **Durable Objects** (familiar Cloudflare pattern)

### Abstraction Levels:
- **Simple:** Use the `Container` class (abstracted)
- **Advanced:** Extend Durable Object class (full control)

### Configuration:
- Declared in `wrangler.toml` (infrastructure as code)
- No complex orchestration needed

---

## Key Insights for Blog Post

### Technical Insights:
1. **Fills a Gap:** Containers solve the "last 2%" problem that V8 isolates can't handle
2. **Not a Replacement:** Complements Workers, doesn't replace them
3. **Managed Lifecycle:** Durable Objects manage container clusters (stateful coordination)
4. **Language Freedom:** Any language, any binary, any tool

### Strategic Insights:
1. **Platform Completion:** Cloudflare now has a complete compute stack (edge → containers)
2. **Reduces Multi-Cloud:** Keeps developers entirely on Cloudflare
3. **New Workloads:** Unlocks AI/ML, media processing, data analytics, build pipelines

### Use Case Validation:
1. **AI Model Training:** Real-world example with file zipping/unpacking
2. **ffmpeg:** Video processing (mentioned twice [[05:29](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=329)], [[12:23](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=743)])
3. **Python Data Science:** Pandas, numpy, etc. [[05:35](http://www.youtube.com/watch?v=zUQM-bbIbUg&t=335)]

---

## Questions for Further Research

1. **Pricing:** How are containers priced vs. Workers vs. Durable Objects?
2. **Limits:** CPU, memory, storage, execution time limits?
3. **Cold Starts:** What's the cold start time for containers?
4. **Scaling:** How do container clusters scale? Auto-scaling?
5. **Networking:** Can containers communicate with each other?
6. **Persistent Storage:** Is storage ephemeral or can it persist?
7. **Docker Image Size Limits:** Are there limits on Dockerfile/image size?

---

## Differentiation from Other Videos

**Better Stack Video:**
- Focused on **Sandbox SDK** (high-level API)
- AI code execution use case
- TypeScript-first API
- 45+ minute execution time

**This Video (backpine labs):**
- Focused on **Cloudflare Containers** (broader infrastructure)
- AI model training use case (file processing)
- Language-agnostic (Go, Python, Java)
- Integration with Durable Objects

**Possible Relationship:**
- Sandbox SDK might be built *on top of* Cloudflare Containers
- Sandbox SDK = abstraction layer for code execution
- Containers = underlying infrastructure primitive

**Need to investigate:** Are these the same product or different layers?

---

## Notes for Blog Structure

**Potential Angles:**
1. **The 2% Problem** - When Workers aren't enough
2. **Platform Completion** - Cloudflare's missing piece
3. **AI/ML Workflows** - Real-world example walkthrough
4. **Architecture Deep Dive** - How Durable Objects manage containers
5. **Migration Guide** - Moving from multi-cloud to Cloudflare-only

**Compelling Hook:**
"You've built 98% of your app on Cloudflare Workers. Now what do you do about the 2% that needs file system access?"
