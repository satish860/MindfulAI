# Sandbox SDK vs Cloudflare Containers: Relationship Clarified

**Research Date:** 2025-01-08
**Sources:**
- https://developers.cloudflare.com/sandbox/concepts/architecture/
- https://developers.cloudflare.com/sandbox/concepts/containers/
- Cloudflare official documentation and blog posts

---

## TL;DR: The Answer

**Sandbox SDK is built ON TOP OF Cloudflare Containers.**

- **Containers** = The underlying serverless container runtime (infrastructure layer)
- **Sandbox SDK** = A higher-level abstraction/API built on Containers (developer-facing SDK)

Think of it as: **SDK (abstraction) → Containers (infrastructure)**

---

## The Layered Architecture

### Three-Layer System

The Sandbox SDK integrates three Cloudflare technologies:

```
┌─────────────────────────────────────────┐
│  Layer 1: Client SDK                    │
│  (@cloudflare/sandbox)                  │
│  - TypeScript API in your Worker        │
│  - Methods: getSandbox(), exec(), etc.  │
│  - Clean, type-safe developer interface │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  Layer 2: Durable Object                │
│  - Central orchestrator                 │
│  - Manages sandbox lifecycle            │
│  - Routes requests to containers        │
│  - Maintains persistent identity        │
│  - Enables geographic distribution      │
│  - Automatic scaling                    │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  Layer 3: Container Runtime             │
│  (Cloudflare Containers)                │
│  - Executes untrusted code              │
│  - Isolated Ubuntu Linux environments   │
│  - Full VM with system capabilities     │
│  - Pre-installed: Python, Node.js, Git  │
└─────────────────────────────────────────┘
```

---

## Layer 1: Client SDK (Developer-Facing API)

**What it is:**
- TypeScript SDK (`@cloudflare/sandbox`)
- Installed via `npm i @cloudflare/sandbox`
- Used in your Cloudflare Worker code

**What it provides:**
- Clean, type-safe API
- Methods like `getSandbox()`, `exec()`, `writeFile()`, `exposePort()`, etc.
- Validates parameters
- Sends HTTP requests to Durable Objects

**Developer experience:**
```typescript
import { getSandbox } from '@cloudflare/sandbox';

const sandbox = getSandbox(env.Sandbox, 'my-sandbox-id');
const result = await sandbox.exec('python script.py');
```

**Role:** Abstracts away the complexity of managing containers and Durable Objects.

---

## Layer 2: Durable Object (Orchestration & State)

**What it is:**
- Cloudflare Durable Object that manages the sandbox lifecycle
- Acts as the central orchestrator

**What it does:**
- **Routes requests** between Client SDK and Container Runtime
- **Manages lifecycle**: Creation, deletion, scaling
- **Maintains persistent identity**: Same sandbox ID always routes to same instance
- **Authenticates** and validates requests
- **Enables stateful execution**: Sandboxes persist across requests

**Quote from docs:**
> "The Durable Object owns and manages the container lifecycle, providing persistent identity so same sandbox ID always routes to same instance."

**Role:** Coordination layer that enables stateful, distributed sandbox management.

---

## Layer 3: Container Runtime (Execution Environment)

**What it is:**
- Cloudflare Containers (the underlying infrastructure)
- Isolated Ubuntu Linux VMs

**What it provides:**
- **Isolated execution environment** for untrusted code
- **Pre-installed runtimes**: Python 3.11, Node.js 20, Bun, Git
- **Full filesystem access**: `/workspace`, `/tmp`, `/home`
- **Process management**: Foreground and background processes
- **Network capabilities**: Outbound connections, exposed ports for inbound

**Security model:**
- **Between sandboxes**: Separate containers with isolated filesystems, memory, networks
- **Within sandboxes**: Processes share files and can communicate

**Limitations:**
- Cannot load kernel modules
- No host hardware access
- No nested containers (Docker-in-Docker not supported)

**Role:** The actual isolated Linux environment where code executes.

---

## Request Flow (How They Work Together)

When you execute a command via the SDK:

```
1. Client SDK (Your Worker)
   ↓
   - Validates parameters
   - Sends HTTP request to Durable Object

2. Durable Object
   ↓
   - Authenticates request
   - Routes to Container Runtime

3. Container Runtime (Cloudflare Container)
   ↓
   - Validates inputs
   - Executes command in isolated Linux VM
   - Captures output

4. Response flows back through all layers
   ↓
   - Container → Durable Object → Client SDK
   - Proper error handling at each layer
```

---

## Key Relationship Insights

### 1. Built On Top Of
**Sandbox SDK is built on Containers.**

From the docs:
> "Built on Containers, Sandbox SDK provides a simple API for executing commands, managing files, running background processes, and exposing services — all from your Workers applications."

### 2. Shared Platform
**Since Sandbox SDK is built on Containers, it shares the same underlying platform characteristics.**

This includes:
- Pricing models
- Resource limits
- Infrastructure (Cloudflare's global edge network)

### 3. Different Abstractions
- **Containers** = General-purpose serverless container runtime
- **Sandbox SDK** = Specialized for secure code execution (AI agents, untrusted code, etc.)

### 4. Different Use Cases
- **Containers**: Any containerized workload (broad)
- **Sandbox SDK**: Specifically optimized for:
  - Building AI agents that need to execute code
  - Interactive development environments (IDEs)
  - Data analysis platforms
  - CI/CD systems
  - Any application needing secure code execution at the edge

---

## Analogy: Containers vs Sandbox SDK

Think of it like:
- **Containers** = EC2 instances (infrastructure)
- **Sandbox SDK** = AWS Lambda (higher-level abstraction)

Or in Cloudflare terms:
- **Containers** = The VM/container infrastructure
- **Sandbox SDK** = Developer-friendly API to use containers for code execution

---

## Why Two Products?

### Containers (Infrastructure Layer)
**For developers who want:**
- Full control over the container
- Custom Dockerfile
- Any language, any tool
- Direct Durable Object management
- Lower-level access

**Use cases:**
- File processing (zipping, unpacking)
- Custom build pipelines
- Media processing (ffmpeg)
- Specialized workloads

---

### Sandbox SDK (Abstraction Layer)
**For developers who want:**
- Simple TypeScript API
- Pre-configured environment (Python, Node.js, Git)
- Quick setup
- Focus on code execution, not infrastructure

**Use cases:**
- AI agents executing generated code
- Code interpreters
- Interactive REPLs
- Data analysis
- Running untrusted code safely

---

## Timeline & Product Evolution

Based on the research:

1. **Cloudflare Containers** announced for June 2025 (public beta)
2. **Sandbox SDK** released in beta (built on Containers)
3. Recent update (2025-08-05): Sandbox SDK major release with streaming, code interpreter, Git support, process control

**Implication:** Sandbox SDK is a more recent abstraction built on top of the Containers foundation.

---

## Which Should You Use?

### Use Containers directly if:
- You need full control (custom Dockerfile)
- You're building specialized infrastructure
- You want to manage Durable Objects yourself
- You need language/tools not in Sandbox SDK defaults

### Use Sandbox SDK if:
- You're building AI agents that execute code
- You want a simple TypeScript API
- You're focused on code execution, not container management
- You want pre-configured Python/Node.js/Git environment
- You're building interactive dev tools, data analysis, CI/CD

---

## Technical Comparison

| Aspect | Containers | Sandbox SDK |
|--------|-----------|-------------|
| **Abstraction Level** | Low-level (infrastructure) | High-level (developer API) |
| **Configuration** | Custom Dockerfile | Pre-configured environment |
| **API** | Durable Object methods | TypeScript SDK methods |
| **Setup Complexity** | Higher (manage DO, containers) | Lower (simple SDK) |
| **Flexibility** | Very high (any language/tool) | Medium (Python, Node.js, Bun) |
| **Use Case** | General containerized workloads | Code execution, AI agents |
| **Language** | Any (Docker-compatible) | TypeScript API (executes any language) |
| **Pre-installed Tools** | None (you define) | Python 3.11, Node.js 20, Bun, Git |

---

## Key Quotes from Documentation

### On the Relationship:
> "Built on Containers, Sandbox SDK provides a simple API for executing commands, managing files, running background processes, and exposing services — all from your Workers applications."

### On Shared Platform:
> "Since Sandbox SDK is built on Containers, it shares the same underlying platform characteristics. This includes pricing models and resource limits."

### On Durable Object Role:
> "The Durable Object owns and manages the container lifecycle, providing persistent identity so same sandbox ID always routes to same instance."

### On Container Runtime:
> "Each sandbox runs in an isolated Linux container with Python, Node.js, and common development tools pre-installed."

---

## Architecture Summary

**The Full Stack:**
```
Your Cloudflare Worker
    ↓
@cloudflare/sandbox SDK (TypeScript API)
    ↓
Durable Object (Lifecycle Management)
    ↓
Cloudflare Container (Isolated Linux VM)
    ↓
Ubuntu 22.04 + Python + Node.js + Bun + Git
```

**The Relationship:**
- **Containers** = Foundation (infrastructure primitive)
- **Durable Objects** = Coordination layer (state & lifecycle)
- **Sandbox SDK** = Developer API (abstraction)

---

## Implications for Blog Post

### Key Points to Communicate:

1. **Layered Architecture**
   - Containers = infrastructure
   - Sandbox SDK = developer-friendly abstraction
   - Not competing products, but complementary layers

2. **Choose Your Level**
   - Need full control? Use Containers directly
   - Want simplicity? Use Sandbox SDK
   - Both run on same infrastructure

3. **AI Agent Focus**
   - Sandbox SDK optimized for AI code execution
   - Pre-configured for common use cases
   - Containers enable custom workloads

4. **Cloudflare's Complete Stack**
   - Workers (edge compute)
   - Durable Objects (state)
   - Containers (infrastructure)
   - Sandbox SDK (code execution abstraction)

### Potential Blog Structure:

1. **Introduction**: The code execution problem (AI agents, untrusted code)
2. **The Foundation**: Cloudflare Containers (infrastructure layer)
3. **The Abstraction**: Sandbox SDK (developer API)
4. **How They Work Together**: Three-layer architecture
5. **Use Cases**: When to use each
6. **Real-World Example**: Building an AI agent with Sandbox SDK
7. **Comparison**: vs E2B, Modal, etc.
8. **Conclusion**: Cloudflare's complete edge compute stack

---

## Questions Answered

✅ **Are they the same thing?** No, Sandbox SDK is built on top of Containers.

✅ **What's the relationship?** Containers = infrastructure, Sandbox SDK = abstraction layer.

✅ **Which should I use?** Depends on your needs (full control vs simplicity).

✅ **Do they share infrastructure?** Yes, same underlying platform, pricing, limits.

---

## Remaining Questions for Further Research

1. **Pricing differences**: Is Sandbox SDK priced differently than raw Containers?
2. **Performance**: Any overhead from the SDK abstraction layer?
3. **Limitations**: What can Containers do that Sandbox SDK can't?
4. **Migration path**: Can you start with SDK and move to Containers later?
5. **Open source**: Is the SDK open source? (Yes - github.com/cloudflare/sandbox-sdk)
