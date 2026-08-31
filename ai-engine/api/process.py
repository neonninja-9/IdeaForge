"""Integrated AI Pipeline API router for IdeaForge AI Engine."""

from fastapi import APIRouter, Depends, HTTPException, status

from models.request_models import (
    IdeaProcessRequest,
    IdeaProcessResponse,
)
from services.pipeline_service import PipelineService, pipeline_service

router = APIRouter(
    prefix="/api",
    tags=["Integrated AI Pipeline"],
)


@router.post(
    "/process",
    response_model=IdeaProcessResponse,
    status_code=status.HTTP_200_OK,
    summary="Execute Full 4-Stage AI Processing Pipeline",
    description="""
Executes the full end-to-end IdeaForge AI intelligence pipeline in the following sequential order:

1. **Category Classifier**: Categorizes the idea into 1 of 10 domains and generates 5–8 technical tags (GPT-5.6).
2. **Solution Generator**: Formulates the architectural solution, expected impact, tech stack, difficulty, and timeline (GPT-5.6).
3. **Similarity Checker**: Generates a 1536-dimensional dense vector embedding (text-embedding-3-small).
4. **Roadmap Generator**: Generates a structured 9-phase software engineering roadmap utilizing the classified category and generated solution (GPT-5.6).

### Notes:
- Returns one combined JSON object with all fields.
- Zero database side-effects or persistent storage.
""",
    responses={
        200: {
            "description": "Successfully executed full AI processing pipeline.",
            "content": {
                "application/json": {
                    "example": {
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
                            0.02404634654521942
                        ],
                        "roadmap": [
                            {
                                "phase": "Planning",
                                "tasks": ["Define project scope and deliverables"]
                            }
                        ]
                    }
                }
            },
        },
        422: {
            "description": "Validation Error (e.g., empty title or description).",
        },
        500: {
            "description": "Internal Server Error or missing OpenAI configuration.",
        },
        502: {
            "description": "Bad Gateway - AI model returned an unparseable response.",
        },
        503: {
            "description": "Service Unavailable - OpenAI connectivity issue.",
        },
    },
)
async def process_idea(
    request: IdeaProcessRequest,
    service: PipelineService = Depends(lambda: pipeline_service),
) -> IdeaProcessResponse:
    """Orchestrates all four AI engine modules and returns combined payload.
    
    Args:
        request: Validated title and description payload.
        service: Injected PipelineService instance.
        
    Returns:
        IdeaProcessResponse containing the combined output.
    """
    try:
        result = service.process_idea_pipeline(
            title=request.title,
            description=request.description,
        )
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during pipeline execution: {str(e)}"
        )
