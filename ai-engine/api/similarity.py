"""Similarity API router for IdeaForge AI Engine (Phase 3)."""

from fastapi import APIRouter, Depends, HTTPException, status

from models.request_models import (
    SimilarityCheckRequest,
    SimilarityCheckResponse,
)
from services.similarity_service import SimilarityService, similarity_service

router = APIRouter(
    prefix="/api/similarity",
    tags=["Similarity & Embeddings"],
)


@router.post(
    "/check",
    response_model=SimilarityCheckResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate Idea Embedding for Semantic Similarity",
    description="""
Generates a 1536-dimensional dense vector embedding from a project's `title` and `description` using OpenAI's **`text-embedding-3-small`** model.

### Notes:
- Embeddings can be stored in downstream vector databases (e.g. MongoDB Atlas Vector Search, Pinecone, Qdrant) for cosine similarity checks.
- Returns raw vector embeddings directly without database side-effects.
""",
    responses={
        200: {
            "description": "Successfully generated dense vector embedding.",
            "content": {
                "application/json": {
                    "example": {
                        "embedding": [
                            -0.006929283495992422,
                            -0.005336422007530928,
                            -0.00045471321791410446,
                            0.02404634654521942,
                            0.01523485779762268
                        ]
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
            "description": "Bad Gateway - Invalid response from OpenAI.",
        },
        503: {
            "description": "Service Unavailable - OpenAI connectivity issue.",
        },
    },
)
async def check_similarity_embedding(
    request: SimilarityCheckRequest,
    service: SimilarityService = Depends(lambda: similarity_service),
) -> SimilarityCheckResponse:
    """Generates embedding vector for idea similarity.
    
    Args:
        request: Validated title and description payload.
        service: Injected SimilarityService instance.
        
    Returns:
        SimilarityCheckResponse containing the embedding vector.
    """
    try:
        result = service.get_idea_embedding(
            title=request.title,
            description=request.description,
        )
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during embedding generation: {str(e)}"
        )
