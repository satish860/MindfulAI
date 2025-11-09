# Cloudflare Sandbox SDK

**Source:** https://sandbox.cloudflare.com/
**Date Accessed:** 2025-01-08

## Overview

Meet Cloudflare Sandboxes. Execute commands, manage files, run services, and expose them via public URLs - all within secure, sandboxed containers.

**Installation:**
```bash
npm i @cloudflare/sandbox
```

**GitHub Repository:** https://github.com/cloudflare/sandbox-sdk

**Documentation:** https://developers.cloudflare.com/sandbox/

---

## Core Concept

Cloudflare Sandboxes provide secure, isolated container environments that can be controlled programmatically from Cloudflare Workers. They enable:

- Command execution
- File system management
- Service hosting with public URLs
- Real-time streaming
- Code interpretation
- WebSocket connections

---

## Basic Usage Example

```typescript
import { getSandbox } from "@cloudflare/sandbox";

// Export the Sandbox class in your Worker
export { Sandbox } from "@cloudflare/sandbox";

export default {
  async fetch(request: Request, env: Env) {
    const sandbox = getSandbox(env.Sandbox, "test-env");

    // Clone a repository
    await sandbox.gitCheckout(
      "https://github.com/cloudflare/agents"
    );

    // Run tests
    const testResult = await sandbox.exec("npm test");

    return new Response(
      JSON.stringify({
        tests: testResult.exitCode === 0
          ? "passed"
          : "failed",
        output: testResult.stdout,
      })
    );
  },
};
```

**Workflow Illustration:**
1. Git clone repository
2. Execute npm test
3. Return results

---

## Key Features

### 1. Long-running Processes
Safely execute tasks that require extended computation or monitoring without risking system stability or security.

**Use Case:** Processing tasks that take significant time without blocking or timing out.

---

### 2. Real-time Streaming
Listen to standard output & error streams live when executing long-running commands.

**Benefits:**
- Monitor progress in real-time
- See logs as they happen
- Debug running processes

---

### 3. Preview URLs
Instantly expose any container port as a public URL with automatic subdomain routing.

**Features:**
- Automatic URL generation
- Multiple ports can be exposed
- Public accessibility for testing/sharing
- Example: Preview 1, Preview 2, Preview 3 → "Hello world!"

---

### 4. Code Interpreter
Run Python/JavaScript code directly, with rich outputs (charts, tables, images) parsed automatically for you.

**Example - Python:**
```python
# app.py
for i in range(5):
    print(f"Hello Python! On step {i}")
    time.sleep(1)
```

**Capabilities:**
- Execute code snippets
- Parse rich outputs (charts, tables, images)
- Stream execution results

---

### 5. File System
Easy methods for basic filesystem operations and cloning git repositories on the container filesystem.

**Operations:**
- Create directories
- Read/write files
- Clone git repositories
- Manage project structures

---

### 6. Command Execution
Run any shell command with proper exit codes, streaming, and error handling.

**Example:**
```bash
$ git clone https://github.com/cloudflare/agents
```

**Features:**
- Proper exit codes
- Stream output in real-time
- Error handling built-in

---

### 7. WebSockets
Enable real-time, bidirectional communication by connecting directly to WebSocket servers running in the sandbox.

**Architecture:**
- Worker ↔ WebSocket ↔ Sandbox
- Real-time communication
- Bidirectional data flow

---

## Example Use Cases

### 1. File Operations
Create project structures, write files, and read them back.

```typescript
import { getSandbox } from '@cloudflare/sandbox';

export default {
  async fetch(request: Request, env: Env) {
    const sandbox = getSandbox(env.Sandbox, 'user-123');

    // Create a project structure
    await sandbox.mkdir('/workspace/project/src', {
      recursive: true
    });

    // Write files
    await sandbox.writeFile(
      '/workspace/project/package.json',
      JSON.stringify({ name: 'my-app', version: '1.0.0' })
    );

    // Read a file back
    const content = await sandbox.readFile(
      '/workspace/project/src/package.json'
    );

    return Response.json({ content });
  }
};
```

### 2. Interactive Development Environment
Build IDE-like experiences with file management and code execution.

### 3. Expose Services with Preview URLs
Run services inside containers and expose them publicly for testing.

### 4. Run a Node.js App
Execute Node.js applications with full npm ecosystem support.

### 5. Code Interpreter
Execute Python/JavaScript code with rich output parsing.

### 6. WebSocket Connections
Real-time bidirectional communication with sandbox services.

---

## Testimonials

### Nick Blow - Founding Engineer, Iterate
> "The sandbox SDK is a core part of our infrastructure at Iterate. It's made giving our agents a 'computer' really easy to do, saving us weeks of effort. The team has been very responsive and helpful when dealing with us throughout the implementation process."

### Seve Ibarluzea - Co-Founder, tscircuit.com
> "The developer experience is well-thought-out and built on layers of nice abstractions you can override as needed."

### Ashish Kumar - Engineer, VibeSDK
> "Sandbox-sdk has made it possible to orchestrate and manage running insecure user apps so much easier. You can simply launch a sandbox, expose port and it would handle all the proxying, allocation for you."

---

## Key Technical Insights

1. **Worker Integration:** Sandboxes are controlled from Cloudflare Workers, making them serverless-first
2. **Security:** Isolated containers ensure safe execution of untrusted code
3. **Persistence:** Each sandbox can be identified (e.g., 'user-123', 'test-env')
4. **Streaming:** Real-time output streaming for long-running processes
5. **Network Access:** Preview URLs enable instant public access to sandbox services
6. **Developer Experience:** Simple API with sensible defaults and override capabilities
7. **Use Cases:** AI agents, code execution environments, testing infrastructure, development tools

---

## Architecture Pattern

```
Cloudflare Worker
    ↓
Sandbox SDK API
    ↓
Isolated Container
    ↓
- File System
- Process Execution
- Network Services (via Preview URLs)
- WebSocket Servers
```

---

## Target Applications

- **AI Agents:** Give agents a "computer" to execute tasks
- **Code Execution Platforms:** Safe execution of user code
- **CI/CD Pipelines:** Run tests and builds in isolated environments
- **Development Environments:** Cloud-based IDEs and coding platforms
- **Testing Infrastructure:** Isolated test environments with public URLs
- **Education Platforms:** Safe code execution for learning

---

## Notes for Blog Post

- **Security Focus:** Emphasize the isolation and safety aspects
- **Developer Experience:** Highlight the simple API and abstractions
- **Real-world Validation:** Multiple companies using in production (Iterate, tscircuit, VibeSDK)
- **Edge Computing:** Runs on Cloudflare's global network
- **Serverless Integration:** Tight integration with Workers platform
- **Practical Examples:** Code examples show real-world patterns
