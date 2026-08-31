"""Similarity Service module for IdeaForge AI Engine (Phase 3).

Formats project data and interfaces with EmbeddingService to produce
dense vector embeddings for semantic similarity comparisons.
Note: No database or vector search operations are performed in this service.
"""

import logging
from typing import List, Optional

from models.request_models import SimilarityCheckResponse
from services.embedding_service import EmbeddingService, embedding_service

logger = logging.getLogger(__name__)


class SimilarityService:
    """Service to coordinate embedding generation for idea similarity checks."""

    def __init__(self, emb_service: Optional[EmbeddingService] = None):
        self.embedding_service = emb_service or embedding_service

    @staticmethod
    def format_idea_text(title: str, description: str) -> str:
        """Combines title and description into a structured representation for embedding.
        
        Args:
            title: Project or idea title.
            description: Project or idea description.
            
        Returns:
            Normalized combined text string.
        """
        return f"Title: {title.strip()}\n\nDescription: {description.strip()}"

    def get_idea_embedding(
        self,
        title: str,
        description: str,
        model: Optional[str] = None
    ) -> SimilarityCheckResponse:
        """Generates embedding for an idea's combined title and description.
        
        Args:
            title: Project title.
            description: Project description.
            model: Optional model override.
            
        Returns:
            SimilarityCheckResponse containing the embedding vector.
        """
        combined_text = self.format_idea_text(title=title, description=description)
        logger.info(f"Generating idea embedding for title: '{title[:50]}'")

        embedding_vector = self.embedding_service.generate_embedding(
            text=combined_text,
            model=model
        )

        return SimilarityCheckResponse(embedding=embedding_vector)


# Singleton instance for dependency injection
similarity_service = SimilarityService()
