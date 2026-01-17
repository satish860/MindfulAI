---
title: "Building with Sandboxes: A Hands-On Tutorial"
date: "2025-11-09"
excerpt: "Learn how to set up, run, and deploy sandboxes for AI agent development. Build your first sandbox-powered application in under 10 minutes."
template: "technical"
category: "AI Infrastructure"
---
## Introduction

In [Sandboxes: How AI Agents Safely Run Untrusted Code](/articles/discovering-sandboxes-ai-infrastructure), we explored what sandboxes are and why they're critical for AI agents. Now it's time to build with them.

This tutorial will take you from zero to running your own sandbox infrastructure in under 10 minutes. You'll learn how to:

- Set up a local sandbox environment
- Execute Python code safely in isolation
- Build interactive examples
- Deploy to production on Cloudflare's global network
- Handle real-world use cases

**Prerequisites:**
- Node.js 18+ installed
- Basic familiarity with command line
- (Optional) Cloudflare account for deployment

Let's build.

---

## Quick Start: Your First Sandbox in 2 Minutes

The fastest way to experience sandboxes is with Cloudflare's Sandbox SDK. Run this single command:

```bash
npm create cloudflare@latest my-sandbox -- --template=cloudflare/sandbox-sdk/examples/minimal
```

This creates a minimal sandbox project. Navigate into it:

```bash
cd my-sandbox
npm run dev
```

You now have a local sandbox running at `http://localhost:8787`.

**Test it immediately:**

```bash
curl http://localhost:8787 \
  -H "Content-Type: application/json" \
  -d '{"code": "print(\"Hello from the sandbox!\")"}'
```

You just ran Python code in a secure, isolated sandbox. That's it. You're now running the same infrastructure that powers AI agents.

---

## Understanding What You Just Built

Before we go deeper, let's understand what happened:

**The Flow:**
1. You sent Python code as a JSON payload
2. The sandbox worker received it
3. Executed the code in complete isolation
4. Returned the output (`stdout`, `stderr`, `exit_code`)

**The Safety:**
- The code ran in a separate process
- No access to your filesystem
- No network access (by default)
- Destroyed immediately after execution

**The Speed:**
- Startup: ~10ms
- Execution: Depends on your code
- Total overhead: Negligible

This is the foundation. Now let's build something more interesting.

---

## Step 1: Setting Up a Custom Sandbox Worker

Let's create a more powerful sandbox that can handle multiple languages and custom configurations.

**Create a new project from scratch:**

```bash
npm create cloudflare@latest advanced-sandbox
cd advanced-sandbox
npm install @cloudflare/sandbox-sdk
```

**Create `src/index.ts`:**

```typescript

{
  async fetch(request: Request): Promise {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const { code, language = 'python', timeout = 30000 } = await request.json();

    // Create a new sandbox instance
    const sandbox = new Sandbox();

    try {
      // Execute code with timeout
      const result = await sandbox.run({
        language,
        code,
        timeout,
      });

      return Response.json({
        success: true,
        output: result.stdout,
        errors: result.stderr,
        exitCode: result.exitCode,
        executionTime: result.executionTime,
      });
    } catch (error) {
      return Response.json({
        success: false,
        error: error.message,
      }, { status: 500 });
    } finally {
      // Always clean up
      await sandbox.destroy();
    }
  },
};
```

**Run it:**

```bash
npm run dev
```

You now have a sandbox API that:
- Accepts any Python code
- Handles timeouts gracefully
- Returns structured results
- Cleans up automatically

---

## Step 2: Interactive Python Examples

Let's test your sandbox with real-world examples that demonstrate its capabilities.

### Example 1: Data Processing

```bash
curl http://localhost:8787 \
  -H "Content-Type: application/json" \
  -d '{
    "code": "import json\ndata = {\"users\": 150, \"revenue\": 45000}\nprint(json.dumps(data))"
  }'
```

**Response:**
```json
{
  "success": true,
  "output": "{\"users\": 150, \"revenue\": 45000}\n",
  "errors": "",
  "exitCode": 0,
  "executionTime": 45
}
```

### Example 2: Math Calculations

```bash
curl http://localhost:8787 \
  -H "Content-Type: application/json" \
  -d '{
    "code": "import math\nresult = math.factorial(10)\nprint(f\"Factorial of 10: {result}\")"
  }'
```

### Example 3: Working with Libraries

```bash
curl http://localhost:8787 \
  -H "Content-Type: application/json" \
  -d '{
    "code": "from datetime import datetime\nnow = datetime.now()\nprint(f\"Current time: {now.isoformat()}\")"
  }'
```

### Example 4: Error Handling

```bash
curl http://localhost:8787 \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(undefined_variable)"
  }'
```

**Response:**
```json
{
  "success": true,
  "output": "",
  "errors": "NameError: name 'undefined_variable' is not defined\n",
  "exitCode": 1,
  "executionTime": 32
}
```

Notice: The sandbox safely caught the error. Your system is protected.

---

## Step 3: Building an AI Agent Integration

Now let's build something AI agents actually use: a code execution endpoint that processes data without exposing it to the model.

**Create `src/agent-executor.ts`:**

```typescript

interface AgentTask {
  task: string;
  data?: Record<string, any>;
  generatedCode: string;
}

async function executeAgentTask(task: AgentTask): Promise<any> {
  const sandbox = new Sandbox();

  // Inject data into the sandbox environment
  const codeWithData = `
import json

# Injected data from the agent
task_data = ${JSON.stringify(task.data || {})}

# Agent-generated code starts here
${task.generatedCode}
`;

  try {
    const result = await sandbox.run({
      language: 'python',
      code: codeWithData,
      timeout: 45000, // 45 seconds for complex tasks
    });

    if (result.exitCode !== 0) {
      throw new Error(`Execution failed: ${result.stderr}`);
    }

    // Parse output as JSON if possible
    try {
      return JSON.parse(result.stdout);
    } catch {
      return { output: result.stdout };
    }
  } finally {
    await sandbox.destroy();
  }
}
```

**Update `src/index.ts` to use it:**

```typescript

{
  async fetch(request: Request): Promise {
    if (request.url.endsWith('/agent-execute')) {
      const task = await request.json();

      try {
        const result = await executeAgentTask(task);
        return Response.json({ success: true, result });
      } catch (error) {
        return Response.json({
          success: false,
          error: error.message
        }, { status: 500 });
      }
    }

    // ... rest of your routes
  },
};
```

**Test the AI agent endpoint:**

```bash
curl http://localhost:8787/agent-execute \
  -H "Content-Type: application/json" \
  -d '{
    "task": "Calculate customer lifetime value",
    "data": {
      "customers": [
        {"id": 1, "purchases": [100, 150, 200]},
        {"id": 2, "purchases": [50, 75, 100, 125]}
      ]
    },
    "generatedCode": "import json\n\ntotal_clv = sum(sum(c[\"purchases\"]) for c in task_data[\"customers\"])\naverage_clv = total_clv / len(task_data[\"customers\"])\n\nresult = {\n  \"total_clv\": total_clv,\n  \"average_clv\": average_clv,\n  \"customer_count\": len(task_data[\"customers\"])\n}\n\nprint(json.dumps(result))"
  }'
```

**Response:**
```json
{
  "success": true,
  "result": {
    "total_clv": 800,
    "average_clv": 400,
    "customer_count": 2
  }
}
```

**What just happened:**
- An AI agent generated Python code to calculate CLV
- Your sandbox executed it with customer data
- The data never entered the model's context
- You got structured results back

This is exactly how Anthropic achieves 98.7% token reduction.

---

## Step 4: Adding Security and Resource Limits

Production sandboxes need proper safety controls. Let's add them.

**Create `src/sandbox-config.ts`:**

```typescript
const SANDBOX_LIMITS = {
  // Execution limits
  maxExecutionTime: 30000, // 30 seconds
  maxMemory: 128 * 1024 * 1024, // 128MB
  maxOutputSize: 1024 * 1024, // 1MB

  // Rate limiting
  maxRequestsPerMinute: 60,
  maxConcurrentExecutions: 10,

  // Blocked operations
  forbiddenModules: [
    'os',           // File system access
    'subprocess',   // Process spawning
    'socket',       // Network access
  ],
};

function validateCode(code: string): { valid: boolean; reason?: string } {
  // Check for forbidden imports
  for (const module of SANDBOX_LIMITS.forbiddenModules) {
    if (code.includes(`import ${module}`) || code.includes(`from ${module}`)) {
      return {
        valid: false,
        reason: `Forbidden module: ${module}`,
      };
    }
  }

  // Check code length
  if (code.length > 50000) {
    return {
      valid: false,
      reason: 'Code exceeds maximum length (50KB)',
    };
  }

  return { valid: true };
}
```

**Update your executor to use these limits:**

```typescript

async function executeAgentTask(task: AgentTask): Promise<any> {
  // Validate code before execution
  const validation = validateCode(task.generatedCode);
  if (!validation.valid) {
    throw new Error(`Code validation failed: ${validation.reason}`);
  }

  const sandbox = new Sandbox();

  try {
    const result = await sandbox.run({
      language: 'python',
      code: task.generatedCode,
      timeout: SANDBOX_LIMITS.maxExecutionTime,
      memoryLimit: SANDBOX_LIMITS.maxMemory,
    });

    // Enforce output size limit
    if (result.stdout.length > SANDBOX_LIMITS.maxOutputSize) {
      throw new Error('Output exceeds maximum size');
    }

    return result;
  } finally {
    await sandbox.destroy();
  }
}
```

---

## Step 5: Deploying to Production

Your sandbox is ready for production. Let's deploy it to Cloudflare's global network.

**1. Login to Cloudflare:**

```bash
npx wrangler login
```

**2. Update `wrangler.toml`:**

```toml
name = "ai-sandbox-production"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[env.production]
name = "ai-sandbox-production"
route = "sandbox.yourdomain.com/*"

[[env.production.analytics_engine_bindings]]
binding = "ANALYTICS"
```

**3. Deploy:**

```bash
npm run deploy
```

Your sandbox is now live globally on Cloudflare's network. It will:
- Auto-scale to handle any load
- Run in 300+ cities worldwide
- Respond in under 50ms globally
- Cost $0.00 for the first 100k requests/day

**Test your production sandbox:**

```bash
curl https://sandbox.yourdomain.com/agent-execute \
  -H "Content-Type: application/json" \
  -d '{"task": "test", "generatedCode": "print(\"Hello from production!\")"}'
```

---

## Real-World Use Cases

Now that you have a production sandbox, here's what you can build:

### AI Agent Code Execution

```typescript
// Agent generates code to process user data
const agentResponse = await ai.generateCode({
  prompt: "Calculate average purchase value from customer data",
  context: { dataSchema: customerSchema }
});

// Execute in sandbox (data never enters model context)
const result = await executeAgentTask({
  task: "data_analysis",
  data: sensitiveCustomerData,
  generatedCode: agentResponse.code
});
```

### Dynamic Report Generation

```typescript
// User requests custom report
const reportCode = await ai.generateCode({
  prompt: "Generate quarterly sales report with charts",
  data: salesData
});

const report = await sandbox.run({
  code: reportCode,
  libraries: ['pandas', 'matplotlib']
});
```

### Interactive Data Exploration

```typescript
// User asks natural language questions about their data
const explorationCode = await ai.generateCode({
  question: "What are the top 5 products by revenue?",
  dataSchema: productSchema
});

const insights = await executeInSandbox(explorationCode, productData);
```

### Automated Testing

```typescript
// Agent writes tests for user's code
const tests = await ai.generateTests(userCode);

// Run tests in sandbox
const testResults = await sandbox.run({
  code: tests,
  timeout: 60000 // Allow more time for test suites
});
```

---

## Troubleshooting

### Issue: "Sandbox creation failed"

**Cause:** Rate limits or resource exhaustion

**Solution:**
```typescript
// Implement retry logic with exponential backoff
async function createSandboxWithRetry(maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return new Sandbox();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
}
```

### Issue: "Execution timeout"

**Cause:** Code takes too long to execute

**Solution:**
```typescript
// Implement timeout with graceful failure
const result = await Promise.race([
  sandbox.run({ code, timeout: 30000 }),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Execution timeout')), 30000)
  )
]);
```

### Issue: "Memory limit exceeded"

**Cause:** Code uses too much memory

**Solution:**
```typescript
// Set appropriate memory limits
const sandbox = new Sandbox({
  memoryLimit: 128 * 1024 * 1024, // 128MB
  onMemoryWarning: () => {
    console.log('Memory usage high, terminating...');
    sandbox.destroy();
  }
});
```

### Issue: "Cannot import module X"

**Cause:** Module not available in sandbox environment

**Solution:**
- Check Cloudflare's [supported Python libraries](https://developers.cloudflare.com/sandbox/reference/supported-libraries/)
- Use built-in Python libraries when possible
- Consider preprocessing data before sandbox execution

---

## Performance Optimization

### Sandbox Pooling

Reuse sandbox instances for better performance:

```typescript
class SandboxPool {
  private pool: Sandbox[] = [];
  private maxSize = 10;

  async acquire(): Promise {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return new Sandbox();
  }

  async release(sandbox: Sandbox) {
    if (this.pool.length < this.maxSize) {
      this.pool.push(sandbox);
    } else {
      await sandbox.destroy();
    }
  }
}
```

### Code Caching

Cache frequently executed code:

```typescript
const codeCache = new Map<string, any>();

async function executeWithCache(code: string) {
  const cacheKey = hashCode(code);

  if (codeCache.has(cacheKey)) {
    return codeCache.get(cacheKey);
  }

  const result = await sandbox.run({ code });
  codeCache.set(cacheKey, result);

  return result;
}
```

### Async Execution

For long-running tasks, use async execution:

```typescript
// Return immediately with job ID
const jobId = generateJobId();
executeInBackground(jobId, code);

return Response.json({
  jobId,
  status: 'processing',
  checkUrl: `/status/${jobId}`
});
```

---

## Next Steps

You now have a production-ready sandbox infrastructure. Here's what to explore next:

**Expand capabilities:**
- Add support for multiple languages (JavaScript, Ruby, etc.)
- Implement persistent storage for agent "skills"
- Build a UI for interactive code execution

**Integrate with AI:**
- Connect to Claude API or OpenAI
- Implement the MCP (Model Context Protocol)
- Build multi-step agent workflows

**Scale up:**
- Add analytics and monitoring
- Implement distributed tracing
- Set up alerting for failures

**Learn more:**
- [Cloudflare Sandbox Documentation](https://developers.cloudflare.com/sandbox/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Anthropic's Code Execution Guide](https://www.anthropic.com/engineering/code-execution-with-mcp)

---

## Conclusion

You've built sandbox infrastructure from scratch. You understand:
- How sandboxes provide zero-trust execution
- Why AI agents need this for safety
- How to deploy globally in minutes
- Real-world patterns for production use

This is the same infrastructure powering the next generation of AI agents. You're now ready to build with it.

The future Anthropic described? You just laid the foundation.

---

**Related Articles:**
- [Sandboxes: How AI Agents Safely Run Untrusted Code](/articles/discovering-sandboxes-ai-infrastructure) - The conceptual foundation
- Coming next: "AI Agent Architecture: Building Production-Ready Systems"

---

*Questions or feedback? Open an issue or submit a PR to improve this tutorial.*