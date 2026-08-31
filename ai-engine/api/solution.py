"""Solution Generation API router for IdeaForge AI Engine (Phase 2)."""

from fastapi import APIRouter, Depends, HTTPException, status

from models.request_models import (
    SolutionGenerateRequest,
    SolutionGenerateResponse,
)
from services.solution_service import SolutionService, solution_service

router = APIRouter(
    prefix="/api/solution",
    tags=["Solution Generation"],
)


@router.post(
    "/generate",
    response_model=SolutionGenerateResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate Architecture Solution, Impact, Tech Stack & Timeline",
    description="""
Analyzes a project's title and description using GPT-5.6 to formulate a complete technical blueprint:
1. **Proposed Solution**: Technical architecture, key components, algorithms, and workflows.
2. **Expected Impact**: Measurable value proposition, business outcomes, or environmental/social gains.
3. **Suggested Tech Stack**: Languages, frameworks, databases, libraries, protocols, and cloud infrastructure.
4. **Difficulty Level**: Evaluated engineering complexity (`Beginner`, `Intermediate`, `Advanced`, `Expert`).
5. **Estimated Development Time**: Realistic timeline for building a working MVP.
""",
    responses={
        200: {
            "description": "Successfully generated engineering solution proposal.",
            "content": {
                "application/json": {
                    "example": {
                        "solution": "Deploy edge computing sensor nodes communicating via LoRaWAN to a centralized FastAPI backend. Stream real-time anomaly detection with Kafka and store historical metrics in TimescaleDB. Provide a real-time reactive dashboard with Next.js.",
                        "impact": "Reduces operational downtime by 45% and saves up to $150k annually in preventative maintenance costs.",
                        "techStack": [
                            "Python",
                            "FastAPI",
                            "TimescaleDB",
                            "Apache Kafka",
                            "Next.js",
                            "Docker",
                            "LoRaWAN"
                        ],
                        "difficulty": "Intermediate",
                        "estimatedTime": "4-6 weeks"
                    }
                }
            },
        },
        422: {
            "description": "Validation Error (e.g., empty or blank title/description).",
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
async def generate_solution(
    request: SolutionGenerateRequest,
    service: SolutionService = Depends(lambda: solution_service),
) -> SolutionGenerateResponse:
    """Endpoint to generate full architectural solution proposal.
    
    Args:
        request: Validated title and description payload.
        service: Injected SolutionService instance.
        
    Returns:
        SolutionGenerateResponse with architectural proposal, impact, tech stack, difficulty, and timeline.
    """
    try:
        result = service.generate_solution(
            title=request.title,
            description=request.description,
        )
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during solution generation: {str(e)}"
        )
