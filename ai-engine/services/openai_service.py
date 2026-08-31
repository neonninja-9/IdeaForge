"""OpenAI Service module for IdeaForge AI Engine.

Handles OpenAI API initialization, prompt execution with GPT-5.6,
structured JSON response parsing, and robust error handling.
"""

import json
import logging
import os
from typing import Optional
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

from models.request_models import CategoryClassifyResponse, CategoryEnum
from prompts.category_prompt import (
    CATEGORY_CLASSIFICATION_SYSTEM_PROMPT,
    build_category_classification_user_prompt,
)
from utils.helpers import extract_and_parse_json

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

# Default model configuration
DEFAULT_MODEL = os.getenv("OPENAI_MODEL", "gpt-5.6")


class OpenAIService:
    """Service wrapper for interacting with OpenAI API."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            logger.warning(
                "OPENAI_API_KEY is not set in environment or .env file. "
                "Calls to OpenAI API will fail until configured."
            )
        self.client = OpenAI(api_key=self.api_key) if self.api_key else None

    def _get_client(self) -> OpenAI:
        """Ensures OpenAI client is initialized with valid API key."""
        if not self.client:
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="OPENAI_API_KEY is not configured on the server. Please check your .env file."
                )
            self.client = OpenAI(api_key=api_key)
        return self.client

    def classify_project_category(
        self,
        title: str,
        description: str,
        model: Optional[str] = None
    ) -> CategoryClassifyResponse:
        """Classifies a project idea into one of 10 categories and generates 5-8 technical tags.
        
        Args:
            title: Project/Idea title.
            description: Project/Idea detailed description.
            model: OpenAI model name (defaults to 'gpt-5.6' or OPENAI_MODEL env var).
            
        Returns:
            CategoryClassifyResponse with category and tags.
            
        Raises:
            HTTPException: With appropriate status codes for API, auth, or parsing errors.
        """
        client = self._get_client()
        target_model = model or DEFAULT_MODEL

        system_prompt = CATEGORY_CLASSIFICATION_SYSTEM_PROMPT
        user_prompt = build_category_classification_user_prompt(title=title, description=description)

        try:
            logger.info(f"Calling OpenAI model '{target_model}' for category classification.")
            
            response = client.chat.completions.create(
                model=target_model,
                temperature=0.2,
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
            )

            raw_content = response.choices[0].message.content
            if not raw_content:
                logger.error("OpenAI returned an empty completion content.")
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="AI service returned an empty response."
                )

            # Parse JSON content
            parsed_data = extract_and_parse_json(raw_content)
            if not parsed_data:
                logger.error(f"Failed to parse JSON from AI response: {raw_content}")
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Failed to parse JSON response from the AI model."
                )

            # Extract category and tags
            raw_category = parsed_data.get("category", "").strip()
            raw_tags = parsed_data.get("tags", [])

            # Normalization fallback for category if slight casing difference occurs
            matched_category = None
            for valid_cat in CategoryEnum:
                if valid_cat.value.lower() == raw_category.lower():
                    matched_category = valid_cat
                    break

            if not matched_category:
                logger.warning(f"AI returned unexpected category '{raw_category}'. Defaulting or checking fuzzy match.")
                # Fallback to Social Impact or throw validation error
                matched_category = CategoryEnum.SOCIAL_IMPACT

            # Clean and sanitize tags: ensure unique, stripped, non-empty
            cleaned_tags = []
            seen = set()
            for tag in raw_tags:
                if isinstance(tag, str) and tag.strip():
                    cleaned_tag = tag.strip()
                    if cleaned_tag.lower() not in seen:
                        seen.add(cleaned_tag.lower())
                        cleaned_tags.append(cleaned_tag)

            # Enforce 5 to 8 tags constraint
            if len(cleaned_tags) < 5:
                # Pad with relevant domain fallback if needed
                domain_fallbacks = ["System Architecture", "Scalability", "API Integration", "Cloud Infrastructure", "Data Pipeline"]
                for fb in domain_fallbacks:
                    if len(cleaned_tags) >= 5:
                        break
                    if fb.lower() not in seen:
                        seen.add(fb.lower())
                        cleaned_tags.append(fb)
            elif len(cleaned_tags) > 8:
                cleaned_tags = cleaned_tags[:8]

            return CategoryClassifyResponse(
                category=matched_category,
                tags=cleaned_tags
            )

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
            logger.exception(f"Unexpected error in category classification: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal classification error: {str(e)}"
            )


# Singleton instance for dependency injection
openai_service = OpenAIService()