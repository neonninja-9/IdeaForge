"""Roadmap Generation API router for IdeaForge AI Engine (Phase 4)."""

from fastapi import APIRouter, Depends, HTTPException, status

from models.request_models import (
    RoadmapGenerateRequest,
    RoadmapGenerateResponse,
)
from services.roadmap_service import RoadmapService, roadmap_service

router = APIRouter(
    prefix="/api/roadmap",
    tags=["Roadmap Generation"],
)


@router.post(
    "/generate",
    response_model=RoadmapGenerateResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate Full Software Development Roadmap",
    description="""
Analyzes a project's `title`, `description`, `solution`, and `category` using GPT-5.6 to formulate an end-to-end software development roadmap.

### Included Phases:
- **Planning**: Scope, architecture, milestone setup.
- **Research**: Feasibility and trade-off evaluation.
- **UI/UX**: Wireframing, interface mockups, user experience flow.
- **Backend**: API development, database schemas, messaging.
- **Frontend**: Client-side dashboards, state management, components.
- **AI Development**: Machine learning models, pipelines, or intelligent automations (if applicable).
- **Testing**: Unit, integration, E2E, and load testing.
- **Deployment**: Dockerization, CI/CD, cloud infrastructure.
- **Future Improvements**: Scalability, post-launch features, enhancements.
""",
    responses={
        200: {
            "description": "Successfully generated development roadmap.",
            "content": {
                "application/json": {
                    "example": {
                        "roadmap": [
                            {
                                "phase": "Planning",
                                "tasks": [
                                    "Define system requirements, SRS, and architecture diagrams",
                                    "Establish MVP scope and agile milestone schedule",
                                    "Set up code repositories and CI/CD foundations"
                                ]
                            },
                            {
                                "phase": "Research",
                                "tasks": [
                                    "Conduct hardware and protocol feasibility benchmarking",
                                    "Evaluate database performance trade-offs"
                                ]
                            },
                            {
                                "phase": "UI/UX",
                                "tasks": [
                                    "Design user flow wireframes and interactive prototypes",
                                    "Create reusable design token library in Figma"
                                ]
                            },
                            {
                                "phase": "Backend",
                                "tasks": [
                                    "Implement REST API endpoints using FastAPI",
                                    "Design database schema and migrations"
                                ]
                            },
                            {
                                "phase": "Frontend",
                                "tasks": [
                                    "Build responsive dashboard in Next.js / React",
                                    "Integrate telemetry charts and real-time state"
                                ]
                            },
                            {
                                "phase": "AI Development",
                                "tasks": [
                                    "Develop ML prediction pipeline and train initial model",
                                    "Quantize model for low-latency production inference"
                                ]
                            },
                            {
                                "phase": "Testing",
                                "tasks": [
                                    "Write comprehensive unit and integration tests",
                                    "Perform automated security auditing and load testing"
                                ]
                            },
                            {
                                "phase": "Deployment",
                                "tasks": [
                                    "Containerize applications with Docker",
                                    "Configure automated GitHub Actions deployment pipeline"
                                ]
                            },
                            {
                                "phase": "Future Improvements",
                                "tasks": [
                                    "Implement multi-region high availability",
                                    "Incorporate automated anomaly detection notifications"
                                ]
                            }
                        ]
                    }
                }
            },
        },
        422: {
            "description": "Validation Error (e.g., empty title, description, solution, or category).",
        },
        500: {
            "description": "Internal Server Error or missing OpenAI configuration.",
        },
        502: {
            "description": "Bad Gateway - Invalid or unparseable response from OpenAI.",
        },
        503: {
            "description": "Service Unavailable - OpenAI connectivity issue.",
        },
    },
)
async def generate_roadmap(
    request: RoadmapGenerateRequest,
    service: RoadmapService = Depends(lambda: roadmap_service),
) -> RoadmapGenerateResponse:
    """Endpoint to generate complete software development roadmap.
    
    Args:
        request: Validated title, description, solution, and category payload.
        service: Injected RoadmapService instance.
        
    Returns:
        RoadmapGenerateResponse containing ordered phase list with tasks.
    """
    try:
        result = service.generate_roadmap(
            title=request.title,
            description=request.description,
            solution=request.solution,
            category=request.category,
        )
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during roadmap generation: {str(e)}"
        )
