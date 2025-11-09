# Code Execution with MCP: Building More Efficient Agents - Anthropic Engineering

**Source:** https://www.anthropic.com/engineering/code-execution-with-mcp
**Published:** November 04, 2025
**Authors:** Adam Jones and Conor Kelly
**Date Accessed:** 2025-01-08

---

## Overview

This article explains how code execution environments make AI agents more efficient when interacting with MCP (Model Context Protocol) servers by allowing agents to write code to call tools on demand, rather than loading all tool definitions upfront.

**Key Innovation:** Present MCP servers as code APIs rather than direct tool calls.

---

## The Problem: Excessive Token Consumption

### What is MCP?

**Model Context Protocol (MCP):** An open standard for connecting AI agents to external systems.
- **Website:** https://modelcontextprotocol.io/
- **Problem it solves:** Traditionally, each agent-to-tool pairing requires custom integration, creating fragmentation
- **Solution:** Universal protocol - implement MCP once, unlock entire ecosystem of integrations

**Adoption (as of Nov 2024):**
- Thousands of MCP servers built by community
- SDKs available for all major programming languages
- Industry adopted MCP as de-facto standard for connecting agents to tools and data

**Current Scale:**
- Developers routinely build agents with access to **hundreds or thousands of tools** across **dozens of MCP servers**

---

## The Two Core Inefficiencies

As MCP usage scales, two patterns increase agent cost and latency:

### 1. Tool Definitions Overload the Context Window

**Traditional Approach:**
Most MCP clients load **all tool definitions upfront** directly into context, exposing them to the model using direct tool-calling syntax.

**Example Tool Definition:**
```
gdrive.getDocument
Description: Retrieves a document from Google Drive
Parameters:
  documentId (required, string): The ID of the document to retrieve
  fields (optional, string): Specific fields to return
Returns: Document object with title, body content, metadata, permissions, etc.
```

```
salesforce.updateRecord
Description: Updates a record in Salesforce
Parameters:
  objectType (required, string): Type of Salesforce object (Lead, Contact, Account, etc.)
  recordId (required, string): The ID of the record to update
  data (required, object): Fields to update with their new values
Returns: Updated record object with confirmation
```

**Problem:**
- Tool descriptions occupy more context window space
- Increases response time and costs
- Agents connected to **thousands of tools** need to process **hundreds of thousands of tokens** before reading a request

---

### 2. Intermediate Tool Results Consume Additional Tokens

**Example Request:**
"Download my meeting transcript from Google Drive and attach it to the Salesforce lead."

**Traditional Tool Call Flow:**
```
TOOL CALL: gdrive.getDocument(documentId: "abc123")
  → returns "Discussed Q4 goals...\n[full transcript text]"
  (loaded into model context)

TOOL CALL: salesforce.updateRecord(
  objectType: "SalesMeeting",
  recordId: "00Q5f000001abcXYZ",
  data: {
    "Notes": "Discussed Q4 goals...\n[full transcript text written out]"
  }
)
  (model needs to write entire transcript into context again)
```

**Problem:**
- Every intermediate result must pass through the model
- Full transcript flows through **twice**
- For a 2-hour sales meeting, that could mean processing an additional **50,000 tokens**
- Even larger documents may exceed context window limits, breaking the workflow
- Models more likely to make mistakes when copying data between tool calls

**Visual:**
> "The MCP client loads tool definitions into the model's context window and orchestrates a message loop where each tool call and result passes through the model between operations."

---

## The Solution: Code Execution with MCP

### Core Concept

**Present MCP servers as code APIs** rather than direct tool calls.

**Benefits:**
1. Agents can load **only the tools they need**
2. Process data in the execution environment **before** passing results back to the model

---

### Implementation Approach: File Tree Structure

**Generate a file tree of all available tools** from connected MCP servers.

**Example TypeScript Implementation:**
```
servers
├── google-drive
│   ├── getDocument.ts
│   ├── ... (other tools)
│   └── index.ts
├── salesforce
│   ├── updateRecord.ts
│   ├── ... (other tools)
│   └── index.ts
└── ... (other servers)
```

**Each tool = a file:**
```typescript
// ./servers/google-drive/getDocument.ts
import { callMCPTool } from "../../../client.js";

interface GetDocumentInput {
  documentId: string;
}

interface GetDocumentResponse {
  content: string;
}

/* Read a document from Google Drive */
export async function getDocument(input: GetDocumentInput): Promise<GetDocumentResponse> {
  return callMCPTool<GetDocumentResponse>('google_drive__get_document', input);
}
```

---

### The Code Approach - Same Example

**Before (Direct Tool Calls):**
```
TOOL CALL: gdrive.getDocument(...)
TOOL CALL: salesforce.updateRecord(...)
(transcript flows through context twice)
```

**After (Code Execution):**
```typescript
// Read transcript from Google Docs and add to Salesforce prospect
import * as gdrive from './servers/google-drive';
import * as salesforce from './servers/salesforce';

const transcript = (await gdrive.getDocument({
  documentId: 'abc123'
})).content;

await salesforce.updateRecord({
  objectType: 'SalesMeeting',
  recordId: '00Q5f000001abcXYZ',
  data: { Notes: transcript }
});
```

---

### How Discovery Works

**Agent explores the filesystem:**
1. Lists the `./servers/` directory to find available servers (like `google-drive` and `salesforce`)
2. Reads specific tool files it needs (like `getDocument.ts` and `updateRecord.ts`)
3. Understands each tool's interface
4. Loads **only the definitions it needs** for the current task

**Result:**
- **Before:** 150,000 tokens
- **After:** 2,000 tokens
- **Savings:** 98.7% reduction in token usage

---

### Cloudflare's Similar Findings

Cloudflare published similar findings: https://blog.cloudflare.com/code-mode/

**They call it "Code Mode"**

**Core insight:** LLMs are adept at writing code, and developers should take advantage of this strength to build agents that interact with MCP servers more efficiently.

---

## Benefits of Code Execution with MCP

### 1. Progressive Disclosure

**Models are great at navigating filesystems.**

**Approach:** Presenting tools as code on a filesystem allows models to read tool definitions **on-demand**, rather than all up-front.

**Alternative:** Add a `search_tools` tool to find relevant definitions.

**Example:** When working with Salesforce, the agent searches for "salesforce" and loads **only those tools** needed for the current task.

**Optimization:** Include a detail level parameter in `search_tools`:
- Name only
- Name and description
- Full definition with schemas

**Benefit:** Helps agent conserve context and find tools efficiently.

---

### 2. Context Efficient Tool Results

**Filter and transform results in code before returning them.**

**Example: Fetching 10,000-row spreadsheet:**

```typescript
// Without code execution - all rows flow through context
TOOL CALL: gdrive.getSheet(sheetId: 'abc123')
  → returns 10,000 rows in context to filter manually

// With code execution - filter in the execution environment
const allRows = await gdrive.getSheet({ sheetId: 'abc123' });
const pendingOrders = allRows.filter(row => row["Status"] === 'pending');

console.log(`Found ${pendingOrders.length} pending orders`);
console.log(pendingOrders.slice(0, 5)); // Only log first 5 for review
```

**Result:** Agent sees **5 rows** instead of **10,000**.

**Similar patterns work for:**
- Aggregations
- Joins across multiple data sources
- Extracting specific fields

**All without bloating the context window.**

---

### 3. More Powerful and Context-Efficient Control Flow

**Loops, conditionals, and error handling** can be done with familiar code patterns rather than chaining individual tool calls.

**Example: Waiting for deployment notification in Slack:**

```typescript
let found = false;
while (!found) {
  const messages = await slack.getChannelHistory({
    channel: 'C123456'
  });
  found = messages.some(m => m.text.includes('deployment complete'));
  if (!found) await new Promise(r => setTimeout(r, 5000));
}
console.log('Deployment notification received');
```

**Benefits:**
- More efficient than alternating between MCP tool calls and sleep commands
- Saves on "time to first token" latency
- Agent can let code execution environment handle conditionals instead of waiting for model evaluation

---

### 4. Privacy-Preserving Operations

**Intermediate results stay in the execution environment by default.**

**Principle:** The agent only sees what you explicitly log or return.

**Benefit:** Data you don't wish to share with the model can flow through your workflow without ever entering the model's context.

---

#### Automatic PII Tokenization Example

**Use Case:** Import customer contact details from spreadsheet into Salesforce.

**Agent writes:**
```typescript
const sheet = await gdrive.getSheet({ sheetId: 'abc123' });

for (const row of sheet.rows) {
  await salesforce.updateRecord({
    objectType: 'Lead',
    recordId: row.salesforceId,
    data: {
      Email: row.email,
      Phone: row.phone,
      Name: row.name
    }
  });
}

console.log(`Updated ${sheet.rows.length} leads`);
```

**MCP client intercepts and tokenizes PII before it reaches the model:**

```typescript
// What the agent would see, if it logged the sheet.rows:
[
  {
    salesforceId: '00Q...',
    email: '[EMAIL_1]',
    phone: '[PHONE_1]',
    name: '[NAME_1]'
  },
  {
    salesforceId: '00Q...',
    email: '[EMAIL_2]',
    phone: '[PHONE_2]',
    name: '[NAME_2]'
  },
  ...
]
```

**Data flow:**
- Real email addresses, phone numbers, and names flow from Google Sheets to Salesforce
- They **never go through the model**
- Prevents agent from accidentally logging or processing sensitive data

**Advanced:** Define deterministic security rules, choosing where data can flow to and from.

---

### 5. State Persistence and Skills

**Code execution with filesystem access allows agents to maintain state across operations.**

#### Intermediate Results

**Agents can write intermediate results to files:**

```typescript
const leads = await salesforce.query({
  query: 'SELECT Id, Email FROM Lead LIMIT 1000'
});

const csvData = leads.map(l => `${l.Id},${l.Email}`).join('\n');
await fs.writeFile('./workspace/leads.csv', csvData);

// Later execution picks up where it left off
const saved = await fs.readFile('./workspace/leads.csv', 'utf-8');
```

**Benefits:**
- Resume work
- Track progress
- Maintain state across operations

---

#### Reusable Functions as Skills

**Agents can persist their own code as reusable functions.**

**Pattern:**
```typescript
// In ./skills/save-sheet-as-csv.ts
import * as gdrive from './servers/google-drive';

export async function saveSheetAsCsv(sheetId: string) {
  const data = await gdrive.getSheet({ sheetId });
  const csv = data.map(row => row.join(',')).join('\n');
  await fs.writeFile(`./workspace/sheet-${sheetId}.csv`, csv);
  return `./workspace/sheet-${sheetId}.csv`;
}

// Later, in any agent execution:
import { saveSheetAsCsv } from './skills/save-sheet-as-csv';
const csvPath = await saveSheetAsCsv('abc123');
```

**Skills Concept:**
- Folders of reusable instructions, scripts, and resources
- Documentation: https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview
- Add a `SKILL.md` file to create structured skill
- Models can reference and use these skills
- **Over time:** Agent builds a toolbox of higher-level capabilities
- **Evolution:** Scaffolding that helps agent work most effectively

---

## Trade-offs

**Code execution introduces its own complexity:**

**Requirements:**
- Secure execution environment with appropriate **sandboxing**
  - Reference: https://www.anthropic.com/engineering/claude-code-sandboxing
- Resource limits
- Monitoring

**Considerations:**
- Infrastructure requirements add operational overhead
- Security considerations that direct tool calls avoid

**Decision Framework:**
**Benefits** (reduced token costs, lower latency, improved tool composition) should be weighed against **implementation costs** (sandboxing, infrastructure, security).

---

## Summary

### The Problem
- MCP provides foundational protocol for agents to connect to many tools
- Once too many servers are connected, tool definitions and results consume excessive tokens
- Reduces agent efficiency

### The Solution
- Although these problems feel novel (context management, tool composition, state persistence), they have **known solutions from software engineering**
- Code execution applies these established patterns to agents
- Lets them use familiar programming constructs to interact with MCP servers more efficiently

### Call to Action
If you implement this approach, share your findings with the **MCP community**: https://modelcontextprotocol.io/community/communication

---

## Key Metrics and Numbers

| Metric | Value |
|--------|-------|
| **Token reduction** | 150,000 → 2,000 tokens (98.7% savings) |
| **Example overhead** | 2-hour meeting transcript = 50,000 extra tokens |
| **Scale** | Hundreds or thousands of tools across dozens of MCP servers |

---

## Technical Architecture Comparison

### Traditional MCP (Direct Tool Calls)
```
Agent → Load ALL tool definitions into context
     → Call Tool 1 → Result flows through context
     → Call Tool 2 → Result flows through context (again)
     → Excessive token usage
```

### Code Execution with MCP
```
Agent → Explore filesystem → Load ONLY needed tools
     → Write code that calls tools
     → Data processed in execution environment
     → Only final results return to agent
     → Minimal token usage
```

---

## Key Insights for Blog Post

### 1. The Efficiency Problem
- **98.7% token reduction** is massive
- **50,000+ tokens** for a single workflow is unsustainable
- This is why code execution matters

### 2. Established Patterns
- Quote: "Although many of the problems here feel novel... they have known solutions from software engineering"
- Code execution applies familiar patterns (loops, conditionals, data filtering) to AI agents

### 3. Infrastructure Requirements
- Code execution requires **sandboxing**
- This is where Cloudflare Containers/Sandbox SDK comes in
- Security is critical

### 4. Real-World Impact
- Privacy preservation (PII tokenization)
- State persistence (resume work)
- Skills (reusable functions)
- These are production concerns, not demos

### 5. Cloudflare Connection
- Cloudflare independently arrived at same conclusion ("Code Mode")
- Sandbox SDK/Containers enable this pattern
- Infrastructure makes the pattern practical

---

## Questions This Raises

1. **Sandboxing:** How do you safely execute agent-generated code?
   - Answer: Cloudflare Sandbox SDK / Containers

2. **Infrastructure:** What does a secure execution environment look like?
   - Answer: Isolated containers, resource limits, monitoring

3. **Adoption:** Who's using this pattern?
   - Anthropic (Claude)
   - Cloudflare (Code Mode)
   - Community (MCP ecosystem)

4. **Future:** Where is this going?
   - Skills building on skills
   - Agents that improve over time
   - Ecosystem of reusable agent capabilities

---

## Blog Post Angle

**The Big Picture:**
1. **Problem:** AI agents are inefficient when using many tools (token bloat)
2. **Solution:** Code execution with MCP (agents write code instead of direct tool calls)
3. **Challenge:** Need secure sandboxing infrastructure
4. **Answer:** Cloudflare Sandbox SDK / Containers provide this infrastructure
5. **Impact:** 98.7% token reduction, privacy preservation, state persistence, skills

**Title Ideas:**
- "Why AI Agents Need Sandboxes: The Infrastructure Behind Efficient Code Execution"
- "From 150,000 to 2,000 Tokens: How Code Execution Transforms AI Agents"
- "Cloudflare Sandboxes and the Future of AI Agent Infrastructure"
- "The Missing Piece: Why Anthropic's MCP Needs Cloudflare's Sandbox SDK"

**Target Audience:**
- AI agent builders
- Developers working with MCP
- Anyone building production AI systems
- Technical leaders evaluating AI infrastructure

**Value Proposition:**
Understand why code execution matters for AI agents, and how sandbox technology (Cloudflare) enables this at scale.

---

## Acknowledgments

**Authors:** Adam Jones and Conor Kelly
**Reviewers:** Jeremy Fox, Jerome Swannack, Stuart Ritchie, Molly Vorwerck, Matt Samuels, Maggie Vo
