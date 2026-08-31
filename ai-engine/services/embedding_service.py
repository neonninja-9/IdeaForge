"""OpenAI Embedding Service for IdeaForge AI Engine (Phase 3).

Generates high-dimensional dense vector embeddings using OpenAI's
'text-embedding-3-small' model with robust error handling.
"""

import logging
import os
from typing import List, Optional
from dotenv import load_dotenv
from fastapi import HTTPException, status
from openai import (
    APIConnectionError,
    APIStatusError,
    AuthenticationError,
    OpenAI,
    OpenAIError,
    RateLimitError,
)

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

# Default embedding model configuration
DEFAULT_EMBEDDING_MODEL = os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")


class EmbeddingService:
    """Service wrapper for interacting with OpenAI Embeddings API."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            logger.warning(
                "OPENAI_API_KEY is not set in environment or .env file. "
                "Calls to Embedding API will fail until configured."
            )
        self.client = OpenAI(api_key=self.api_key) if self.api_key else None

    def _get_client(self) -> OpenAI:
        """Ensures OpenAI client is initialized with a valid API key."""
        if not self.client:
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="OPENAI_API_KEY is not configured on the server. Please check your .env file."
                )
            self.client = OpenAI(api_key=api_key)
        return self.client

    def generate_embedding(
        self,
        text: str,
        model: Optional[str] = None
    ) -> List[float]:
        """Generates a dense vector embedding for a single text input using text-embedding-3-small.
        
        Args:
            text: Text string to embed.
            model: OpenAI embedding model name (defaults to 'text-embedding-3-small').
            
        Returns:
            List of floats representing the embedding vector.
            
        Raises:
            HTTPException: On authentication, rate limit, network, or OpenAI service errors.
        """
        if not text or not text.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Input text for embedding generation cannot be empty."
            )

        client = self._get_client()
        target_model = model or DEFAULT_EMBEDDING_MODEL

        try:
            logger.info(f"Generating embedding using model '{target_model}' for text length {len(text)}.")

            response = client.embeddings.create(
                input=text.strip(),
                model=target_model
            )

            if not response.data or len(response.data) == 0:
                logger.error("OpenAI returned empty embedding data.")
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="AI service returned empty embedding data."
                )

            embedding_vector = response.data[0].embedding
            return embedding_vector

        except AuthenticationError as e:
            logger.error(f"OpenAI Authentication error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"OpenAI authentication failed: Invalid API key. ({str(e)})"
            )
        except RateLimitError as e:
            logger.error(f"OpenAI Rate limit exceeded: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="OpenAI rate limit or quota exceeded. Please try again later."
            )
        except APIConnectionError as e:
            logger.error(f"OpenAI Connection error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Unable to reach OpenAI servers. Please check your network connection."
            )
        except APIStatusError as e:
            logger.error(f"OpenAI API status error ({e.status_code}): {e.message}")
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"OpenAI API returned an error ({e.status_code}): {e.message}"
            )
        except OpenAIError as e:
            logger.error(f"OpenAI general error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"An unexpected OpenAI error occurred: {str(e)}"
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.exception(f"Unexpected error in embedding generation: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal embedding generation error: {str(e)}"
            )


# Singleton instance for dependency injection
embedding_service = EmbeddingService()
