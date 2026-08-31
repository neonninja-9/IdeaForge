"""Solution Generation Service module for IdeaForge AI Engine (Phase 2).

Leverages OpenAI GPT-5.6 to formulate comprehensive technical proposals,
impact assessments, tech stack recommendations, difficulty ratings, and MVP timelines.
"""

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

from models.request_models import SolutionGenerateResponse
from prompts.solution_prompt import (
    SOLUTION_GENERATION_SYSTEM_PROMPT,
    build_solution_generation_user_prompt,
)
from utils.helpers import extract_and_parse_json

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

# Default model configuration
DEFAULT_MODEL = os.getenv("OPENAI_MODEL", "gpt-5.6")


class SolutionService:
    """Service wrapper for generating architecture and solution proposals using OpenAI."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            logger.warning(
                "OPENAI_API_KEY is not set in environment or .env file. "
                "Calls to OpenAI API will fail until configured."
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

    def generate_solution(
        self,
        title: str,
        description: str,
        model: Optional[str] = None
    ) -> SolutionGenerateResponse:
        """Generates a complete solution proposal including architecture, impact, tech stack, difficulty, and timeline.
        
        Args:
            title: Project or idea title.
            description: Detailed problem and solution requirements.
            model: OpenAI model identifier (defaults to 'gpt-5.6' or OPENAI_MODEL env var).
            
        Returns:
            SolutionGenerateResponse with structured proposal details.
            
        Raises:
            HTTPException: In case of authentication, rate limit, network, or parsing errors.
        """
        client = self._get_client()
        target_model = model or DEFAULT_MODEL

        system_prompt = SOLUTION_GENERATION_SYSTEM_PROMPT
        user_prompt = build_solution_generation_user_prompt(title=title, description=description)

        try:
            logger.info(f"Calling OpenAI model '{target_model}' for solution generation.")

            response = client.chat.completions.create(
                model=target_model,
                temperature=0.3,
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
            )

            raw_content = response.choices[0].message.content
            if not raw_content:
                logger.error("OpenAI returned empty completion content for solution generation.")
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="AI service returned an empty response."
                )

            # Parse JSON content
            parsed_data = extract_and_parse_json(raw_content)
            if not parsed_data:
                logger.error(f"Failed to parse JSON from AI solution response: {raw_content}")
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Failed to parse JSON response from the AI model."
                )

            # Extract fields with safe fallbacks
            solution_text = str(parsed_data.get("solution", "")).strip()
            impact_text = str(parsed_data.get("impact", "")).strip()
            raw_tech_stack = parsed_data.get("techStack", [])
            difficulty = str(parsed_data.get("difficulty", "Intermediate")).strip()
            estimated_time = str(parsed_data.get("estimatedTime", "4-6 weeks")).strip()

            # Clean and sanitize tech stack items
            cleaned_tech_stack = []
            seen = set()
            if isinstance(raw_tech_stack, list):
                for tech in raw_tech_stack:
                    if isinstance(tech, str) and tech.strip():
                        t_str = tech.strip()
                        if t_str.lower() not in seen:
                            seen.add(t_str.lower())
                            cleaned_tech_stack.append(t_str)

            if not cleaned_tech_stack:
                cleaned_tech_stack = ["Python", "FastAPI", "React", "PostgreSQL", "Docker"]

            if not solution_text:
                solution_text = f"Architectural implementation plan for {title} featuring modular services and cloud-native infrastructure."

            if not impact_text:
                impact_text = "Delivers high operational efficiency, scalability, and measurable domain value."

            return SolutionGenerateResponse(
                solution=solution_text,
                impact=impact_text,
                techStack=cleaned_tech_stack,
                difficulty=difficulty if difficulty else "Intermediate",
                estimatedTime=estimated_time if estimated_time else "4-6 weeks"
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
            logger.exception(f"Unexpected error in solution generation: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal solution generation error: {str(e)}"
            )


# Singleton instance for dependency injection
solution_service = SolutionService()
