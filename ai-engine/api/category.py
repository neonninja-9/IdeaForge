"""Category classification API route for IdeaForge AI Engine."""

from fastapi import APIRouter, Depends, HTTPException, status

from models.request_models import (
    CategoryClassifyRequest,
    CategoryClassifyResponse,
)
from services.openai_service import OpenAIService, openai_service

router = APIRouter(
    prefix="/api/category",
    tags=["Category Classification"],
)


@router.post(
    "/classify",
    response_model=CategoryClassifyResponse,
    status_code=status.HTTP_200_OK,
    summary="Classify Project Category and Generate Technical Tags",
    description="""
Analyzes a project's title and description using GPT-5.6 to:
1. **Select exactly one category** from the 10 supported industry domains.
2. **Generate 5 to 8 technical tags** representing the architectural and technological stack.

### Supported Categories:
- Agriculture
- Education
- Healthcare
- Finance
- Environment
- Transportation
- Cybersecurity
- AI & Machine Learning
- Smart Cities
- Social Impact
""",
    responses={
        200: {
            "description": "Successfully classified project category and generated technical tags.",
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
                            "Sustainable Farming"
                        ]
                    }
                }
            },
        },
        422: {
            "description": "Validation Error (e.g. empty title or description).",
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
async def classify_category(
    request: CategoryClassifyRequest,
    service: OpenAIService = Depends(lambda: openai_service),
) -> CategoryClassifyResponse:
    """Endpoint to classify idea into a category with technical tags.
    
    Args:
        request: Validated input containing title and description.
        service: Injected OpenAIService instance.
        
    Returns:
        CategoryClassifyResponse with category and list of 5-8 tags.
    """
    try:
        result = service.classify_project_category(
            title=request.title,
            description=request.description,
        )
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during classification: {str(e)}"
        )
