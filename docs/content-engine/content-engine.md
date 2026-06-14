# Content Engine MVP

**Document Version:** 1.0
**Focus:** `@marketing-agent` Content Engine

## 1. Context & Strategic Vision

GRCMANA is building an integrated, multi-agent AI ecosystem designed to reduce risk, build resilience, and accelerate trust across GRC (Governance, Risk, and Compliance), cybersecurity, and internal operations.

The core commercial and operational objective is to transform unstructured data into an "Agentic GRC Engine." This engine bridges the gap between the live threat landscape and static compliance obligations, providing consultant-level analysis to internal operations, sales teams, marketing efforts, and future external micro-SaaS applications.

The `Agentic Engine` will focus on core **go-to-market** activities, specifically:

1. **`@marketing-agent`:** A multi-agent system responsible for content planning, creation and continuous improvement. Initial focus will be on the following channels: SEO, LinkedIn and Newsletter.
2. **`@sales-agent`**: A multi-agent system responsible for top of funnel, outbound SDR related activities with the goal of booking a meeting.
3. **`@gtm-agent`**: A multi-agent system responsible for pure-play GTM engineering activities including lead sourcing, scoring and enrichment.

At the heart of this system is the `Knowledge Layer`, a vector database and relational knowledge graph that provides enhanced knowledge and context to AI agents via RAG.

---

## 2. Structural Architecture & Ingestion Flow

The solution decouples the **Knowledge Layer** (centralized memory and ontology) from the **Compute Layer** (autonomous agents, personal tools, and web applications).

```bash

[ Human Input / Data Governance ]
               │
               ▼
       ┌───────────────┐
       │  PayloadCMS   │
       └───────┬───────┘
               │ (Webhook)
               ▼
       ┌───────────────┐
       │      n8n      │
       └───────┬───────┘
               │
               ▼
┌──────────────────────────────────────┐
│       Supabase / PostgreSQL          │
│  ┌────────────────────────────────┐  │
│  │           pgvector             │  │
│  └────────────────────────────────┘  │
│  │    Relational Knowledge Graph  │  │
│  └────────────────────────────────┘  │
└──────────────────┬───────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
         ▼                   ▼
┌─────────────────┐ ┌─────────────────┐
│  Hermes Agents  │ │  External Apps  │
│ (Slack Multi-   │ │ (Claude Code,   │
│    Instance)    │ │   Micro-SaaS)   │
└─────────────────┘ └─────────────────┘

```

### Ingestion Lifecycle

1. **PayloadCMS Layer:** Serves as the administrative human interface for data governance, access management, and quality control.
2. **n8n Orchestration Layer:** Serves as the "nervous system." It processes complex documents, interfaces with OpenRouter for unstructured entity mapping, handles long-running jobs to prevent web timeouts, and coordinates API actions.
3. **Supabase / Postgres Layer:** The centralized "brain." Stores relational metadata, vector embeddings (`pgvector`), and structural relationship data.

---

## 3. Data Model

This architecture maps **four distinct PayloadCMS Collections** into **three strictly isolated `pgvector` namespaces**. This ensures that the agent's RAG queries can isolate structural firmographic data (ICPs/Personas) from technical compliance data (GRC Frameworks) and brand voice (Global Identity).

| PayloadCMS Collection | `pgvector` Namespace | Data Type                              | Read/Write Access                                   |
| --------------------- | -------------------- | -------------------------------------- | --------------------------------------------------- |
| **Global Identity**   | `global_identity`    | Brand voice, offerings, case studies.  | Human R/W, Agent Read                               |
| **ICPs**              | `gtm_strategy`       | Firmographics, Tier classifications.   | Human R/W, Agent Read                               |
| **Personas**          | `gtm_strategy`       | Psychographics, KPIs, anxieties.       | Human R/W, Agent Read                               |
| **GRC Frameworks**    | `grc_frameworks`     | Technical controls, SCF meta-controls. | Automated Ingest Read-Only (except custom mappings) |

### Collection: `global_identity`

**Vector Namespace:** `global_identity`
**Purpose:** Serves as the anchor for GRCMANA's tone of voice, mission, and proof of capability. Used by the agent to tie technical regulations back to business solutions.

| Field Name              | Type         | Properties      | Description                                                                            |
| ----------------------- | ------------ | --------------- | -------------------------------------------------------------------------------------- |
| `title`                 | Text         | Required        | Internal identifier (e.g., "Founder Tone Profile", "Fintech EU AI Act Success Story"). |
| `identity_type`         | Select       | Required        | `about-me`, `about-company`, `success-story`.                                          |
| `content`               | Rich Text    | Required        | The raw narrative, philosophy, or case study details. Embedded into `pgvector`.        |
| `target_persona`        | Relationship | `hasMany: true` | Links to the **Personas** collection. Maps success stories to specific buyer types.    |
| `associated_frameworks` | Select       | `hasMany: true` | `SCF`, `ISO 27001`, `SOC 2`, `ISO 42001`, `EU AI Act`, `Agnostic`.                     |
| `core_pillars`          | Select       | `hasMany: true` | `Reduce Risk`, `Build Resilience`, `Accelerate Trust`.                                 |
| `challenge`             | Textarea     | Conditional     | (For `success-story` only) The client's initial pain point.                            |
| `solution`              | Textarea     | Conditional     | (For `success-story` only) How the GRCMANA engine solved it.                           |
| `impact_metrics`        | Textarea     | Conditional     | (For `success-story` only) Quantifiable ROI data to cite in marketing.                 |

### Collection: `icps` (Ideal Customer Profiles)

**Vector Namespace:** `gtm_strategy`
**Purpose:** Defines the organizational context, risk tolerance, and regulatory pressures of the target accounts.

| Field Name             | Type     | Properties      | Description                                                                  |
| ---------------------- | -------- | --------------- | ---------------------------------------------------------------------------- |
| `name`                 | Text     | Required        | Identifier (e.g., "Tier 1: High-Growth Fintech").                            |
| `tier`                 | Select   | Required        | `Tier 1`, `Tier 2`, `Tier 3`.                                                |
| `industry_vertical`    | Select   | `hasMany: true` | e.g., `FinTech`, `HealthTech`, `AI/SaaS`.                                    |
| `company_size`         | Select   | `hasMany: true` | e.g., `Pre-Seed`, `Series A-C`, `Enterprise`.                                |
| `geography`            | Select   | `hasMany: true` | e.g., `UK`, `EU`, `US`, `Global`.                                            |
| `regulatory_landscape` | Select   | `hasMany: true` | Hard links to frameworks they must comply with (e.g., `EU AI Act`, `SOC 2`). |
| `risk_posture`         | Textarea | Required        | Systemic risk tolerance narrative. Embedded into `pgvector`.                 |

### Collection: `personas`

**Vector Namespace:** `gtm_strategy`
**Purpose:** Maps the human psychology, KPIs, and objections for up to 5 buyers within each ICP. Prevents generic copywriting.

| Field Name               | Type         | Properties                | Description                                                          |
| ------------------------ | ------------ | ------------------------- | -------------------------------------------------------------------- |
| `job_title`              | Text         | Required                  | e.g., "Chief Information Security Officer", "Technical Founder".     |
| `associated_icp`         | Relationship | Required, `hasMany: true` | Links directly to the **ICPs** collection.                           |
| `professional_anxieties` | Textarea     | Required                  | What keeps them awake? Embedded into `pgvector`.                     |
| `kpis_and_pressures`     | Textarea     | Required                  | How are they measured? Embedded into `pgvector`.                     |
| `biases_and_objections`  | Textarea     | Required                  | Default pushbacks against GRC/Consultants. Embedded into `pgvector`. |
| `watering_holes`         | Select       | `hasMany: true`           | e.g., `LinkedIn`, `Substack`, `Slack Communities`.                   |

### Collection: `grc_frameworks`

**Vector Namespace:** `grc_frameworks`
**Purpose:** The technical dictionary and standard rule sets. Structured to map everything back to the Secure Controls Framework (SCF).

| Field Name      | Type         | Properties                | Description                                                                                 |
| --------------- | ------------ | ------------------------- | ------------------------------------------------------------------------------------------- |
| `control_id`    | Text         | Required                  | e.g., `Annex A 8.23`, `SCF-NET-02`, `Article 5`.                                            |
| `framework`     | Select       | Required                  | `SCF`, `ISO 27001`, `SOC 2`, `ISO 42001`, `EU AI Act`.                                      |
| `domain`        | Select       | `hasMany: true`           | e.g., `IAM`, `Cloud Security`, `Transparency`, `Risk Management`.                           |
| `content_type`  | Select       | Required                  | `Meta-Control` (SCF), `Specific Control`, `Guidance`.                                       |
| `control_text`  | Textarea     | Required                  | The actual regulatory rule or control text. Embedded into `pgvector`.                       |
| `mapped_to_scf` | Relationship | Optional, `hasMany: true` | Links an ISO/SOC 2 control directly to its SCF Meta-Control record in this same collection. |

---

## 3. Knowledge Graph

To avoid multi-hop LLM hallucinations and eliminate massive token overhead, the engine relies on a **deterministic, open-source ontology core**, while using AI strictly for "last-mile" mapping of unstructured data.

### The Unified Ontological Path

```bash
[MITRE Threat] -> [MITRE Mitigation] -> [SCF Meta-Control] -> [Framework-Specific Control (ISO, SOC 2, etc.)]
```

### Core Data Layers

* **MITRE ATT&CK / ATLAS:** Hardcoded, open-source dictionary mapping threats to technical mitigations.
* **Secure Controls Framework (SCF):** The architectural Rosetta Stone. Maps over 100 global compliance frameworks to a normalized catalog of ~1,200 meta-controls.
* **Proprietary Business IP:** Custom playbooks, incident logs, client architectures, and marketing content templates.

### Multi-Tenant Namespace Taxonomy

The database is partitioned into three functional tiers to isolate data and manage user scopes natively via Postgres Row-Level Security (RLS).

* **Tier 1: `global_identity**` – General company information, service offerings, public solutions, and success stories. Accessible by all entities.
* **Tier 2: Functional Ops (`sales_ops`, `marketing_ops`, `gtm_strategy`)** – Role-specific playbooks, ICPs, personas, and content templates.
* **Tier 3: GRC Intellectual Property (`grc_frameworks`, `grc_incidents`, `grc_benchmarks`)** – Read-only standard definitions (SCF/MITRE) combined with dynamic audit logs and gap analyses.

---

## 4. The Agent Layer

### Agents

The initial scope is 3x Agents focused on GTM activities - `@marketing-agent`, `@sales-agent` and `gtm-agent`.

Each of these agents will be deployed on a dedicated Hostinger VPS and provided access to the `Knowledge Layer` and the tools necessary to perform their roles.

**Why have we chosen this approach?**

1. **Optimized Skill Crystallization:** Hermes uses a closed-loop learning system (Observe → Execute → Reflect → Crystallize → Reuse) to automatically distill complex workflows into permanent, reusable "Skills." A dedicated RevOps agent will build deep procedural memory around CRM hygiene, pipeline analysis, and database syncs. A Marketing agent will hone its memory for SEO patterns and copy generation. Mixing these contexts risks the agent applying a marketing-style "creative" approach to a rigid RevOps data task.

2. **Parallel Workstreams:** Hermes supports spawning isolated sub-agents, each with their own isolated environments and Python RPC scripts. Sales needs real-time responsiveness for lead qualification, whereas Marketing might run long, asynchronous web-scraping or batch-generation tasks. Separating them prevents a heavy marketing research task from blocking a time-sensitive sales response.

3. **Data Hygiene and Systemic Resilience:** By strictly separating these functions, you inherently reduce the risk of cross-domain data leakage. You do not want sensitive pipeline or revenue data blending into the working memory of an agent tasked with drafting external marketing communications. This architectural isolation builds strong operational resilience and accelerates internal trust in the automated outputs, ensuring each agent operates safely within its defined namespace.

4. **Cross-Pollination via Skill Sharing:** Because Hermes is compatible with the agentskills.io standard, your specialized agents aren't entirely siloed. You can allow them to share specific, validated skills across domains under appropriate controls. This gives you the benefit of shared learning without the mess of a tangled working memory.

5. **Always On Availability:** Deploying each Hermes Agent on a dedicated Hostinger VPS ensures 24x7, always on availability for performing tasks. By integrating each Agent into `Slack`, we enable real-time human collaboration and `human-in-the-loop.`

### Agentic Workflows

**n8n** will be used to deliver multi-step workflows that include the use of AI Agents.

### AI Gateway

We will be standardising on the following models:

* **Anthropic (Sonnet, Opus)** will be the primary models for execution.
* **Google Gemini** will be made available for analysis and reasoning due to the large context window.
* **Open AI `gpt-image`** will be made available for image creation.
* **Perplexity `Sonar`** will be made available for research.
* **Open AI embeddings** will be made available for embeddings.

The intent is to use either OpenRouter or Vercel AI Gateway to centralise LLM routing.

### Tool Access

We will use the Composio MCP gateway 

### The n8n Prompt Engine Formula

When passing data to OpenRouter/Claude inside your n8n LLM node, you must inject your retrieved database parameters into a highly structured prompt.

```markdown
You are the elite @marketing-agent for GRCMANA. Your task is to completely transform a raw, legacy informational article into a high-density, authoritative GRC technical specification.

### GROUND TRUTH CONTEXT FOR IMPLEMENTATION:
- **Core Regulation Text:** {{ $node.grc_framework.control_text }}
- **Relational Domain Blueprint (SCF):** {{ $node.scf_mappings }}
- **Target Reader Persona:** {{ $node.persona.job_title }}
- **Reader Anxieties to Handle:** {{ $node.persona.professional_anxieties }}
- **Proof of Capability to Cite:** {{ $node.global_identity.success_story }}

### EXPLICIT EDITORIAL MANDATES:
1. **Zero Fluff:** Eliminate conversational intros ("let's look at", "dive in"). Start sections immediately with dense, declarative analysis.
2. **Technical Depth:** Replace vague checklists with specific engineering mechanics (e.g., change "track your code assets" to "generate and verify a Software Bill of Materials (SBOM)").
3. **Address Persona Pain Points:** Weave answers to the target reader's specific organizational anxieties directly into the implementation steps.
4. **Structured Output:** You must format your response to match the target JSON fields precisely.



## 4. Key Architectural Decisions Matrix

| Decision Area                | Chosen Approach                                                                                 | Rejected Alternative                                | Key Rationale                                                                                                                               |
| ---------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Agent Deployment Model**   | Multi-instance direct-mention Slack agents (e.g., `@revops-agent`, `@marketing-agent`).         | Single "Omnipotent" black-box bot interface.        | Enforces clear operational scoping, shrinks individual context windows, and allows channel-level access isolation.                          |
| **Vector Database Engine**   | **Supabase / Postgres + `pgvector**`                                                            | Pure-play vector stores (Pinecone, Chroma, Milvus). | Allows complex multi-select metadata arrays filtering *before* similarity search; guarantees ACID compliance for content updates/deletions. |
| **Knowledge Graph Strategy** | **Relational Knowledge Graph** via Postgres Native SQL and Recursive CTEs.                      | Dedicated Graph Database (Neo4j, AWS Neptune).      | Eliminates distributed systems sync-lag; allows unified query execution (SQL + Vector) through a single database user/connection.           |
| **Ontology Generation**      | **Hardcoded Ingestion** of existing CTID (Center for Threat-Informed Defense) and SCF mappings. | Dynamic AI-extracted edge generation.               | Eradicates structural hallucinations; eliminates set-theory failure modes when cross-referencing framework overlaps.                        |
| **Metadata Controls**        | **Strict, mandatory multi-select dropdown fields** in PayloadCMS (`hasMany: true`).             | Free-text tag ingestion fields.                     | Prevents data hygiene degradation; ensures clean, performant JSONB array filtering within Postgres.                                         |
| **Data Chunking Strategy**   | **Structural Chunking** (1 Control / 1 Rule = 1 Record Node).                                   | Fixed Token/Character Window Chunking.              | Eliminates truncated compliance logic; ensures the LLM retrieves unbroken, accurate legal or regulatory context.                            |

---

## 5. Architectural Risks & Considerations

* **Database Engine Portability:** While utilizing Postgres Recursive CTEs provides massive structural advantages and works natively out-of-the-box on Supabase, it limits database portability compared to graph-standard Cypher queries. (Note: Extensions like *Apache AGE* support Cypher inside Postgres, but are not natively supported by standard managed Supabase instances).
* **The Error Chain Cascade ($E_c$):** For elements of the graph relying on "last-mile" AI extraction (e.g., mapping a custom company incident report to a MITRE technique), human review must act as a gating mechanism. If an edge is misidentified at inception, subsequent automated agentic reasoning across the graph degrades exponentially.
* **Lifecycle Synchronization:** Deletions or updates to documents within PayloadCMS must utilize airtight async hooks (`afterChange`, `afterDelete`) via n8n to ensure that associated vector records and graph edge relationships are wiped atomically. Stale or "ghost" vectors are a primary catalyst for agent hallucination.

## 6. Technical Vulnerabilities & Strategic Optimizations

While the architecture is incredibly solid, evaluating the schema against your core goal—**running an automated n8n pipeline to optimize 130 informational ISO 27001 articles into high-converting, AIO-optimized pages**—reveals four structural gaps that will limit performance if left unaddressed.

### Vector Space Collision inside the `gtm_strategy` Namespace

Your specification maps both **ICPs** (`risk_posture`) and **Personas** (`professional_anxieties`, `kpis_and_pressures`, `biases_and_objections`) into a single vector namespace (`gtm_strategy`).

* **The Risk:** Firmographic organizational risks and personal psychological anxieties are highly distinct semantic datasets. Merging them into one namespace means a similarity search for a technical problem could easily return a persona's behavioral objection, polluting the context window of your `@marketing-agent`.
* **The Fix:** Retain the single namespace for relational queries, but **enforce strict metadata partitioning**. Every vector generated from the Personas collection must append an `entity_type: "persona"` metadata tag, and ICP vectors must append `entity_type: "icp"`. Your n8n query node can then run clean, isolated pre-filtering via Postgres metadata selectors.

### The Missing "Conversion Target" Object

To transform an encyclopedia article into a lead-generation funnel, your pipeline must know *what product or lead magnet to pitch based on the content of the control*. Your current schema lacks a connection to your product offerings or HubSpot conversion targets.

* **The Fix:** Add a field to the `global_identity` collection specifically for product/service offerings, or create a new collection called `conversion_targets`. Each record will contain a HubSpot Form ID, a specific lead magnet title, and a conversion pitch. You can then link this to your controls via a relational field.

### Missing Payload CMS Fields for the Article Template Layout

To programmatically generate the Next.js frontend article template we designed earlier, your `grc_frameworks` collection requires additional presentation and AIO-specific fields.

