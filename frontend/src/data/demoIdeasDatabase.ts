/**
 * Demo Ideas Database
 * -------------------
 * Curated benchmark dataset of project ideas across diverse technology sectors.
 * Used exclusively by the post-submission Similarity & Novelty Simulation engine
 * without querying or modifying the real database.
 */

export interface DemoIdea {
  id: string;
  title: string;
  category: string;
  problem: string;
  solution: string;
  tags: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  marketSaturation: "Low" | "Moderate" | "High";
  focusArea: string;
  differentiator: string;
}

export const DEMO_IDEAS_DATABASE: DemoIdea[] = [
  // HealthTech & Medical AI
  {
    id: "demo-health-1",
    title: "NeuroVision AI: Automated MRI Pathology Detection",
    category: "HealthTech",
    problem: "Manual review of multi-modal brain MRI scans is prone to cognitive fatigue, scarce specialist availability, and delays in identifying micro-lesions.",
    solution: "A 3D CNN computer vision model with Grad-CAM visual heatmaps that flags suspected brain tumors and highlights anatomical boundaries in real-time.",
    tags: ["Healthcare", "AI & Machine Learning", "Computer Vision", "Medical Imaging", "Deep Learning"],
    difficulty: "Advanced",
    marketSaturation: "Moderate",
    focusArea: "Diagnostic Radiology AI",
    differentiator: "Explainable heatmap overlays and DICOM standard PACS integration."
  },
  {
    id: "demo-health-2",
    title: "RetinaScan: Diabetic Retinopathy Mobile Screener",
    category: "HealthTech",
    problem: "Rural healthcare centers lack ophthalmologists to detect early signs of diabetic retinopathy before permanent vision loss occurs.",
    solution: "A lightweight on-device mobile AI application paired with a smartphone lens attachment that scores fundus photos in seconds.",
    tags: ["Healthcare", "Mobile App", "AI & Machine Learning", "Computer Vision"],
    difficulty: "Intermediate",
    marketSaturation: "Moderate",
    focusArea: "Preventative Ophthalmology",
    differentiator: "Offline edge-computing inference on low-cost smartphones."
  },
  {
    id: "demo-health-3",
    title: "ClinScribe: Ambient AI Medical Scribe",
    category: "HealthTech",
    problem: "Physicians spend over 2 hours on EHR documentation for every hour of direct patient care, driving physician burnout.",
    solution: "An ambient acoustic listener that parses clinical conversations and generates structured SOAP notes compliant with HL7/FHIR.",
    tags: ["Healthcare", "NLP", "Audio & Speech", "Productivity"],
    difficulty: "Advanced",
    marketSaturation: "High",
    focusArea: "Clinical Documentation",
    differentiator: "Direct dual-speaker diarization and automated ICD-10 medical billing coding."
  },

  // Developer Tools & Infrastructure
  {
    id: "demo-dev-1",
    title: "LiveArch: Dynamic Cloud Architecture Visualizer",
    category: "DevTools",
    problem: "Static architecture diagrams drift from actual cloud infrastructure, leaving teams with blind spots in security and latency.",
    solution: "An automated GitHub Action and Terraform parser that generates interactive, queryable system topologies updated on every commit.",
    tags: ["DevOps", "Cloud Computing", "Developer Tools", "Visualization"],
    difficulty: "Intermediate",
    marketSaturation: "Low",
    focusArea: "Infrastructure as Code",
    differentiator: "Real-time cost estimation and latency simulation per service node."
  },
  {
    id: "demo-dev-2",
    title: "TracePilot: Autonomous Distributed Tracing & Root-Cause AI",
    category: "DevTools",
    problem: "Microservice failures generate millions of log lines across services, taking engineering teams hours to identify root causes.",
    solution: "An eBPF-based telemetry agent that clusters anomalous service dependencies and pinpoints exact commit diffs responsible for latency spikes.",
    tags: ["DevOps", "AI & Machine Learning", "Distributed Systems", "Backend"],
    difficulty: "Advanced",
    marketSaturation: "Low",
    focusArea: "Observability & SRE",
    differentiator: "Zero-overhead kernel probe instrumentation with instant remediation playbooks."
  },
  {
    id: "demo-dev-3",
    title: "MockForge: Intelligent Synthetic API Sandbox",
    category: "DevTools",
    problem: "Frontend teams frequently get blocked by unbuilt or unstable backend APIs during sprint cycles.",
    solution: "An AI-powered mock server that reads OpenAPI specs and generates stateful, realistic mock endpoints with simulated latency and error flows.",
    tags: ["Developer Tools", "API", "Frontend", "Testing"],
    difficulty: "Beginner",
    marketSaturation: "Moderate",
    focusArea: "API Prototyping",
    differentiator: "Stateful in-memory CRUD operations preserving relationships across calls."
  },

  // Sustainability & Climate Tech
  {
    id: "demo-climate-1",
    title: "CarbonLedger: Scope 3 Supply Chain Emissions Tracker",
    category: "Sustainability",
    problem: "Enterprises struggle to measure Scope 3 carbon emissions across fragmented multi-tier vendor supplier networks.",
    solution: "An automated ERP invoice ingestion engine using OCR and emission factor registries to audit vendor emissions footprints.",
    tags: ["Sustainability", "FinTech", "Data Science", "Analytics"],
    difficulty: "Intermediate",
    marketSaturation: "Low",
    focusArea: "Corporate ESG Auditing",
    differentiator: "Automated invoice parsing with supplier benchmarking scores."
  },
  {
    id: "demo-climate-2",
    title: "VoltBalance: Microgrid Renewable Energy Dispatcher",
    category: "Sustainability",
    problem: "Intermittent solar and wind outputs cause grid instability and energy wastage in localized microgrids.",
    solution: "A reinforcement learning controller that forecasts neighborhood solar generation and balances battery discharge schedules.",
    tags: ["Sustainability", "IoT", "AI & Machine Learning", "Energy"],
    difficulty: "Advanced",
    marketSaturation: "Low",
    focusArea: "Smart Grid Management",
    differentiator: "Decentralized peer-to-peer energy trading among local solar producers."
  },

  // Education & Learning Tech
  {
    id: "demo-ed-1",
    title: "SkillPath: Adaptive Personalized Code Tutor",
    category: "Education",
    problem: "Traditional online coding bootcamps provide one-size-fits-all curricula, causing fast learners to get bored and struggling students to drop out.",
    solution: "An adaptive tutor that analyzes student code submissions, identifies underlying conceptual misconceptions, and dynamically branches practice exercises.",
    tags: ["Education", "AI & Machine Learning", "Web Development", "Productivity"],
    difficulty: "Intermediate",
    marketSaturation: "High",
    focusArea: "Personalized Pedagogy",
    differentiator: "Socratic interactive debugging dialogue rather than giving direct solutions."
  },
  {
    id: "demo-ed-2",
    title: "ConceptMesh: Interactive 3D Knowledge Graph Explorer",
    category: "Education",
    problem: "Students memorize isolated facts without understanding interconnected prerequisite concepts across interdisciplinary subjects.",
    solution: "A 3D interactive knowledge graph engine that dynamically maps relationships between textbooks, research papers, and lecture notes.",
    tags: ["Education", "Visualization", "Data Science", "Frontend"],
    difficulty: "Intermediate",
    marketSaturation: "Low",
    focusArea: "Cognitive Knowledge Mapping",
    differentiator: "WebGL spatial graph navigation with automated prerequisite pathways."
  },

  // FinTech & Security
  {
    id: "demo-fin-1",
    title: "AuditShield: AI Smart Contract Vulnerability Auditor",
    category: "FinTech",
    problem: "DeFi smart contracts suffer from catastrophic reentrancy and logic exploits that drain user liquidity pools.",
    solution: "A hybrid static-analysis and LLM formal verification pipeline that scans Solidity/Rust contracts for economic exploit attack vectors.",
    tags: ["FinTech", "Security", "Web3", "Blockchain"],
    difficulty: "Advanced",
    marketSaturation: "Moderate",
    focusArea: "Smart Contract Security",
    differentiator: "Automated exploit payload generation to prove vulnerabilities before deployment."
  },
  {
    id: "demo-fin-2",
    title: "SpendLens: Contextual Micro-Expense Optimizer for Freelancers",
    category: "FinTech",
    problem: "Freelancers with irregular income streams miss tax write-offs and struggle with automated quarterly tax deductions.",
    solution: "An intelligent banking hook that categorizes business purchases in real-time, calculates quarterly tax reserves, and flags deductor savings.",
    tags: ["FinTech", "Productivity", "Mobile App", "Analytics"],
    difficulty: "Beginner",
    marketSaturation: "High",
    focusArea: "Freelancer Finance",
    differentiator: "Autonomous scheduled transfer to high-yield tax escrow accounts."
  },

  // AI & Workflow Automation
  {
    id: "demo-ai-1",
    title: "DataWeaver: Natural Language to Complex SQL Analytics",
    category: "AI & ML",
    problem: "Business stakeholders wait days for data analytics teams to write queries for routine business performance questions.",
    solution: "A schema-aware RAG pipeline that translates conversational business questions into optimized multi-table SQL queries with validation.",
    tags: ["AI & Machine Learning", "Database", "NLP", "Productivity"],
    difficulty: "Intermediate",
    marketSaturation: "High",
    focusArea: "Business Intelligence",
    differentiator: "Schema permission boundaries and automated sanity-checking against sample rows."
  },
  {
    id: "demo-ai-2",
    title: "SyncHuddle: Async AI Video Standup & Sprint Digest",
    category: "Productivity",
    problem: "Remote teams waste synchronous hours in daily standup meetings that cause scheduling conflicts across global time zones.",
    solution: "A 60-second video check-in tool that transcribes updates, extracts blocker items, and auto-updates Jira/Linear ticket progress.",
    tags: ["Productivity", "Audio & Speech", "Remote Work", "AI & Machine Learning"],
    difficulty: "Intermediate",
    marketSaturation: "Moderate",
    focusArea: "Remote Team Collaboration",
    differentiator: "Automated blocker cross-referencing against sprint burndown roadmaps."
  }
];

export default DEMO_IDEAS_DATABASE;
