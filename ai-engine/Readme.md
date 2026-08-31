# IdeaForge AI Engine

IdeaForge AI Engine is a high-performance AI microservice built with **FastAPI** and the **OpenAI Python SDK (GPT-5.6 & text-embedding-3-small)**.

---

## 📁 Project Structure

```
ai-engine/
│
├── app.py                     # FastAPI application & master router registry
├── requirements.txt           # Python dependencies
├── .env                       # Environment variables (OPENAI_API_KEY)
├── Readme.md                  # Complete API documentation & test examples
│
├── api/
│   ├── process.py             # POST /api/process (Full Integrated Pipeline)
│   ├── category.py            # POST /api/category/classify (Phase 1)
│   ├── solution.py            # POST /api/solution/generate (Phase 2)
│   ├── similarity.py          # POST /api/similarity/check (Phase 3)
│   └── roadmap.py             # POST /api/roadmap/generate (Phase 4)
│
├── services/
│   ├── pipeline_service.py    # Master orchestrator for end-to-end pipeline
│   ├── openai_service.py      # Category classification service (Phase 1)
│   ├── solution_service.py    # Solution proposal service (Phase 2)
│   ├── embedding_service.py   # OpenAI text-embedding-3-small service (Phase 3)
│   ├── similarity_service.py  # Similarity orchestration (Phase 3)
│   └── roadmap_service.py     # Roadmap generation service (Phase 4)
│
├── prompts/
│   ├── category_prompt.py     # Prompt templates for Category Classification
│   ├── solution_prompt.py     # Prompt templates for Solution Generation
│   └── roadmap_prompt.py      # Prompt templates for Roadmap Generation
│
├── models/
│   ├── __init__.py
│   └── request_models.py      # Pydantic schemas (Request & Response models)
│
└── utils/
    └── helpers.py             # JSON extraction & parser helpers
```

---

## ⚙️ Prerequisites & Setup

1. **Python 3.10+** (Python 3.12 recommended)
2. **OpenAI API Key**

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment (`.env`)
Ensure your `.env` file in the `ai-engine` directory contains:
```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-5.6
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
```

---

## 🚀 Running the Microservice

To run the development server with auto-reload:

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

Or run directly:
```bash
python app.py
```

- **API Base URL**: `http://localhost:8000`
- **Interactive Swagger Docs (OpenAPI)**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`

---

## 📡 API Endpoints

### 🌟 Integrated Pipeline: `POST /api/process`

Executes all 4 AI stages in sequence without saving to a database:

1. **Category Classifier**: Categorizes into 1 of 10 domains and generates 5–8 technical tags (GPT-5.6).
2. **Solution Generator**: Produces technical architecture, impact, tech stack, difficulty, and timeline (GPT-5.6).
3. **Similarity Checker**: Produces 1536-dimensional dense vector embeddings (`text-embedding-3-small`).
4. **Roadmap Generator**: Generates a complete 9-phase software engineering roadmap utilizing the classified category and generated solution (GPT-5.6).

#### **Request (`POST /api/process`)**

**Headers:**
```http
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Smart Solar Irrigation System",
  "description": "An automated solar-powered irrigation system that uses IoT soil sensors to optimize water usage for crops in drought-prone areas."
}
```

#### **Response (`200 OK`)**
```json
{
  "category": "Agriculture",
  "tags": [
    "IoT Sensors",
    "Solar Energy",
    "Automated Irrigation",
    "Precision Agriculture",
    "Water Conservation",
    "Edge Computing"
  ],
  "solution": "Deploy IoT soil moisture sensors transmitting telemetry via LoRaWAN to an edge microcontroller managing solenoid valves. Cloud backend performs analytics and forecasting.",
  "impact": "Reduces farm water usage by 40% and increases crop yields by 25%.",
  "techStack": [
    "Python",
    "FastAPI",
    "TimescaleDB",
    "Next.js",
    "LoRaWAN",
    "Docker"
  ],
  "difficulty": "Intermediate",
  "estimatedTime": "4 - 6 weeks",
  "embedding": [
    -0.006929283495992422,
    -0.005336422007530928,
    0.02404634654521942,
    0.01523485779762268
  ],
  "roadmap": [
    {
      "phase": "Planning",
      "tasks": [
        "Define project scope, requirements, and system boundaries",
        "Establish architecture design document (ADD) and data flow diagrams",
        "Set up Jira/GitHub projects and development milestones"
      ]
    },
    {
      "phase": "Research",
      "tasks": [
        "Evaluate LoRaWAN vs Zigbee hardware protocols for farm deployment",
        "Bench-test soil moisture sensor calibration curves"
      ]
    },
    {
      "phase": "UI/UX",
      "tasks": [
        "Design wireframes for farmer dashboard and mobile telemetry view",
        "Create Figma prototype with solar battery and soil status widgets"
      ]
    },
    {
      "phase": "Backend",
      "tasks": [
        "Develop FastAPI microservices for device ingestion and telemetry API",
        "Implement TimescaleDB time-series schema for sensor logging"
      ]
    },
    {
      "phase": "Frontend",
      "tasks": [
        "Build responsive React/Next.js dashboard with real-time WebSocket updates",
        "Implement interactive farm field map with zone moisture overlays"
      ]
    },
    {
      "phase": "AI Development",
      "tasks": [
        "Train predictive irrigation model using local weather APIs and soil history",
        "Build water-consumption anomaly detection service"
      ]
    },
    {
      "phase": "Testing",
      "tasks": [
        "Execute unit and integration tests across API endpoints",
        "Conduct end-to-end hardware-in-the-loop (HIL) stress testing"
      ]
    },
    {
      "phase": "Deployment",
      "tasks": [
        "Containerize services using Docker and Docker Compose",
        "Deploy backend on AWS ECS and configure HTTPS domains and alerts"
      ]
    },
    {
      "phase": "Future Improvements",
      "tasks": [
        "Add satellite NDVI imagery overlay for macro crop health analysis",
        "Enable multilingual voice notifications for field operators"
      ]
    }
  ]
}
```

---

### 🧪 Testing Integrated Pipeline with cURL

```bash
curl -X POST "http://localhost:8000/api/process" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Smart Solar Irrigation System",
       "description": "An automated solar-powered irrigation system that uses IoT soil sensors to optimize water usage for crops in drought-prone areas."
     }'
```

---

### 📮 Postman Test Configuration (`POST /api/process`)

1. **Method**: `POST`
2. **URL**: `http://localhost:8000/api/process`
3. **Headers**:
   - `Content-Type`: `application/json`
4. **Body** (`raw` -> `JSON`):
```json
{
    "title": "AI Decentralized Threat Detection",
    "description": "A graph neural network microservice integrated into blockchain smart contracts to identify suspicious transactions in real-time."
}
```

---

### 📦 Standalone Phase Endpoints (Preserved)

- `POST /api/category/classify` - Category & Tags (Phase 1)
- `POST /api/solution/generate` - Architecture Proposal (Phase 2)
- `POST /api/similarity/check` - Vector Embeddings (Phase 3)
- `POST /api/roadmap/generate` - Software Roadmap (Phase 4)
