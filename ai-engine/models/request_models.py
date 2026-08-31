from enum import Enum
from typing import List
from pydantic import BaseModel, Field, field_validator


class CategoryEnum(str, Enum):
    """Supported industry and domain categories for IdeaForge projects."""
    AGRICULTURE = "Agriculture"
    EDUCATION = "Education"
    HEALTHCARE = "Healthcare"
    FINANCE = "Finance"
    ENVIRONMENT = "Environment"
    TRANSPORTATION = "Transportation"
    CYBERSECURITY = "Cybersecurity"
    AI_MACHINE_LEARNING = "AI & Machine Learning"
    SMART_CITIES = "Smart Cities"
    SOCIAL_IMPACT = "Social Impact"


# ---------------------------------------------------------
# Phase 1: Category Classification Models
# ---------------------------------------------------------

class CategoryClassifyRequest(BaseModel):
    """Request payload for idea categorization and tag generation."""
    title: str = Field(
        ...,
        min_length=1,
        max_length=300,
        description="The title of the project or idea.",
        json_schema_extra={"example": "Smart Solar Irrigation System"}
    )
    description: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="Detailed description of the project, problem, and proposed solution.",
        json_schema_extra={"example": "An automated solar-powered irrigation system that uses IoT soil sensors to optimize water usage for crops."}
    )

    @field_validator("title", "description")
    @classmethod
    def validate_not_blank(cls, value: str, info) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError(f"'{info.field_name}' must not be empty or solely whitespace.")
        return stripped


class CategoryClassifyResponse(BaseModel):
    """Response model containing classified category and generated technical tags."""
    category: CategoryEnum = Field(
        ...,
        description="The single most appropriate category chosen from the 10 supported categories.",
        json_schema_extra={"example": "Agriculture"}
    )
    tags: List[str] = Field(
        ...,
        min_length=5,
        max_length=8,
        description="List of 5 to 8 relevant technical and domain tags.",
        json_schema_extra={"example": [
            "IoT Sensors",
            "Solar Energy",
            "Automated Irrigation",
            "Precision Agriculture",
            "Water Conservation",
            "Sustainable Farming"
        ]}
    )


# ---------------------------------------------------------
# Phase 2: Solution Generator Models
# ---------------------------------------------------------

class SolutionGenerateRequest(BaseModel):
    """Request payload for generating a technical solution proposal."""
    title: str = Field(
        ...,
        min_length=1,
        max_length=300,
        description="The title of the project or problem statement.",
        json_schema_extra={"example": "AI-Powered Early Wildfire Detection System"}
    )
    description: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="Detailed explanation of the problem, context, and operational requirements.",
        json_schema_extra={"example": "A network of solar-powered thermal and optical camera towers in forests that use edge computer vision to detect smoke and heat plumes early, alerting firefighters via satellite."}
    )

    @field_validator("title", "description")
    @classmethod
    def validate_not_blank(cls, value: str, info) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError(f"'{info.field_name}' must not be empty or solely whitespace.")
        return stripped


class SolutionGenerateResponse(BaseModel):
    """Response model containing proposed solution architecture, impact, tech stack, difficulty, and timeline."""
    solution: str = Field(
        ...,
        description="Detailed proposed solution architecture, operational strategy, and implementation breakdown.",
        json_schema_extra={"example": "Deploy ruggedized edge compute nodes equipped with dual optical and thermal sensor arrays. Edge models (YOLOv9) run continuous real-time plume detection. When an anomaly is detected, compressed thermal snapshots and GPS telemetry are beamed via Iridium satellite network to an emergency dispatch dashboard with automated GIS mapping."}
    )
    impact: str = Field(
        ...,
        description="Expected measurable impact, efficiency gains, safety, and business/environmental benefits.",
        json_schema_extra={"example": "Reduces wildfire response time from hours to under 3 minutes, potentially saving thousands of acres of forest, reducing carbon emissions by 40%, and protecting surrounding residential areas."}
    )
    techStack: List[str] = Field(
        ...,
        min_length=1,
        description="Suggested technical stack including programming languages, frameworks, hardware, and infrastructure.",
        json_schema_extra={"example": [
            "Python",
            "FastAPI",
            "PyTorch",
            "YOLOv9",
            "Raspberry Pi / NVIDIA Jetson",
            "Iridium Satellite SBD",
            "PostgreSQL / PostGIS",
            "React",
            "Docker"
        ]}
    )
    difficulty: str = Field(
        ...,
        description="Assessed technical and engineering difficulty level (e.g., Beginner, Intermediate, Advanced, Hard).",
        json_schema_extra={"example": "Advanced"}
    )
    estimatedTime: str = Field(
        ...,
        description="Realistic estimated time required to design, develop, and test an MVP.",
        json_schema_extra={"example": "2 - 3 months"}
    )


# ---------------------------------------------------------
# Phase 3: Similarity & Embedding Models
# ---------------------------------------------------------

class SimilarityCheckRequest(BaseModel):
    """Request payload for generating embeddings to evaluate idea similarity."""
    title: str = Field(
        ...,
        min_length=1,
        max_length=300,
        description="The title of the project or idea.",
        json_schema_extra={"example": "Autonomous Drone Fleet for Precision Crop Spraying"}
    )
    description: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="Detailed description of the project or idea.",
        json_schema_extra={"example": "A swarm of autonomous drones that coordinate via mesh network to detect crop diseases and apply targeted organic pesticides."}
    )

    @field_validator("title", "description")
    @classmethod
    def validate_not_blank(cls, value: str, info) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError(f"'{info.field_name}' must not be empty or solely whitespace.")
        return stripped


class SimilarityCheckResponse(BaseModel):
    """Response model containing dense vector embedding."""
    embedding: List[float] = Field(
        ...,
        description="Dense vector embedding generated by OpenAI text-embedding-3-small.",
        json_schema_extra={"example": [
            -0.006929283495992422,
            -0.005336422007530928,
            -0.00045471321791410446,
            0.02404634654521942,
            0.01523485779762268
        ]}
    )


# ---------------------------------------------------------
# Phase 4: Roadmap Generator Models
# ---------------------------------------------------------

class RoadmapPhase(BaseModel):
    """Individual phase in a software development roadmap."""
    phase: str = Field(
        ...,
        description="Name of the development phase (e.g. Planning, Backend, Testing).",
        json_schema_extra={"example": "Planning"}
    )
    tasks: List[str] = Field(
        ...,
        min_length=1,
        description="List of actionable, concrete engineering and design tasks.",
        json_schema_extra={"example": [
            "Define project scope, user stories, and acceptance criteria",
            "Establish technical requirements and hardware constraints",
            "Set up version control, branching strategy, and team milestones"
        ]}
    )


class RoadmapGenerateRequest(BaseModel):
    """Request payload for generating a software development roadmap."""
    title: str = Field(
        ...,
        min_length=1,
        max_length=300,
        description="The project or product title.",
        json_schema_extra={"example": "Smart Solar Irrigation System"}
    )
    description: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="Detailed description of the problem and background.",
        json_schema_extra={"example": "An automated solar-powered irrigation system that uses IoT soil sensors to optimize water usage for crops in drought-prone areas."}
    )
    solution: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="Proposed solution architecture and technological strategy.",
        json_schema_extra={"example": "Deploy IoT soil moisture sensors transmitting telemetry via LoRaWAN to an edge microcontroller managing solenoid valves. Cloud backend performs analytics and forecasting."}
    )
    category: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Primary industry or domain category of the project.",
        json_schema_extra={"example": "Agriculture"}
    )

    @field_validator("title", "description", "solution", "category")
    @classmethod
    def validate_not_blank(cls, value: str, info) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError(f"'{info.field_name}' must not be empty or solely whitespace.")
        return stripped


class RoadmapGenerateResponse(BaseModel):
    """Response model containing structured multi-phase development roadmap."""
    roadmap: List[RoadmapPhase] = Field(
        ...,
        min_length=1,
        description="Sequential list of software engineering and deployment phases.",
        json_schema_extra={"example": [
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
                    "Bench-test soil moisture sensor calibration curves",
                    "Research low-power sleep modes for microcontroller battery optimization"
                ]
            },
            {
                "phase": "UI/UX",
                "tasks": [
                    "Design wireframes for farmer dashboard and mobile telemetry view",
                    "Create Figma prototype with solar battery and soil status widgets",
                    "Conduct usability walkthroughs with agricultural domain testers"
                ]
            },
            {
                "phase": "Backend",
                "tasks": [
                    "Develop FastAPI microservices for device ingestion and telemetry API",
                    "Implement TimescaleDB time-series schema for sensor logging",
                    "Build automated rule engine for moisture thresholds and valve actuation"
                ]
            },
            {
                "phase": "Frontend",
                "tasks": [
                    "Build responsive React/Next.js dashboard with real-time WebSocket updates",
                    "Implement interactive farm field map with zone moisture overlays",
                    "Integrate authentication and multi-farm role-based access control"
                ]
            },
            {
                "phase": "AI Development",
                "tasks": [
                    "Train predictive irrigation model using local weather APIs and soil history",
                    "Build water-consumption anomaly detection service",
                    "Export quantized inference model for scheduled backend cron runs"
                ]
            },
            {
                "phase": "Testing",
                "tasks": [
                    "Execute unit and integration tests across API endpoints",
                    "Conduct end-to-end hardware-in-the-loop (HIL) stress testing",
                    "Perform load testing on telemetry ingestion pipelines"
                ]
            },
            {
                "phase": "Deployment",
                "tasks": [
                    "Containerize services using Docker and Docker Compose",
                    "Set up CI/CD pipeline with GitHub Actions for automated deployment",
                    "Deploy backend on AWS ECS and configure HTTPS domains and alerts"
                ]
            },
            {
                "phase": "Future Improvements",
                "tasks": [
                    "Add satellite NDVI imagery overlay for macro crop health analysis",
                    "Integrate automated drone inspection sync for localized field anomalies",
                    "Enable multilingual voice notifications for field operators"
                ]
            }
        ]}
    )


# ---------------------------------------------------------
# Phase 5 / Complete Pipeline: Integrated Processing Models
# ---------------------------------------------------------

class IdeaProcessRequest(BaseModel):
    """Request payload to execute the full AI pipeline for an idea."""
    title: str = Field(
        ...,
        min_length=1,
        max_length=300,
        description="The title of the project or idea.",
        json_schema_extra={"example": "Smart Solar Irrigation System"}
    )
    description: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="Detailed description of the project, problem statement, and goals.",
        json_schema_extra={"example": "An automated solar-powered irrigation system that uses IoT soil sensors to optimize water usage for crops in drought-prone areas."}
    )

    @field_validator("title", "description")
    @classmethod
    def validate_not_blank(cls, value: str, info) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError(f"'{info.field_name}' must not be empty or solely whitespace.")
        return stripped


class IdeaProcessResponse(BaseModel):
    """Unified response containing outputs from all 4 pipeline stages."""
    category: CategoryEnum = Field(
        ...,
        description="Classified primary industry/domain category.",
        json_schema_extra={"example": "Agriculture"}
    )
    tags: List[str] = Field(
        ...,
        min_length=5,
        max_length=8,
        description="5 to 8 technical and architectural tags.",
        json_schema_extra={"example": [
            "IoT Sensors",
            "Solar Energy",
            "Automated Irrigation",
            "Precision Agriculture",
            "Water Conservation",
            "Edge Computing"
        ]}
    )
    solution: str = Field(
        ...,
        description="Detailed proposed solution blueprint.",
        json_schema_extra={"example": "Deploy IoT soil moisture sensors transmitting telemetry via LoRaWAN to an edge microcontroller managing solenoid valves. Cloud backend performs analytics and forecasting."}
    )
    impact: str = Field(
        ...,
        description="Expected measurable impact and outcomes.",
        json_schema_extra={"example": "Reduces farm water usage by 40% and increases crop yields by 25%."}
    )
    techStack: List[str] = Field(
        ...,
        description="Suggested technologies, languages, and frameworks.",
        json_schema_extra={"example": [
            "Python",
            "FastAPI",
            "TimescaleDB",
            "Next.js",
            "LoRaWAN",
            "Docker"
        ]}
    )
    difficulty: str = Field(
        ...,
        description="Assessed engineering complexity level.",
        json_schema_extra={"example": "Intermediate"}
    )
    estimatedTime: str = Field(
        ...,
        description="Estimated MVP development timeline.",
        json_schema_extra={"example": "4 - 6 weeks"}
    )
    embedding: List[float] = Field(
        ...,
        description="1536-dimensional dense vector embedding from text-embedding-3-small.",
        json_schema_extra={"example": [
            -0.006929283495992422,
            -0.005336422007530928,
            0.02404634654521942
        ]}
    )
    roadmap: List[RoadmapPhase] = Field(
        ...,
        description="Sequential 9-phase software engineering roadmap.",
        json_schema_extra={"example": [
            {
                "phase": "Planning",
                "tasks": ["Define project scope and deliverables"]
            }
        ]}
    )
