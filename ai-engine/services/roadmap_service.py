"""Roadmap Generation Service module for IdeaForge AI Engine (Phase 4).

Leverages OpenAI GPT-5.6 to generate structured multi-phase software engineering
roadmaps with detailed, actionable tasks for project execution.
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

from models.request_models import RoadmapGenerateResponse, RoadmapPhase
from prompts.roadmap_prompt import (
    ROADMAP_GENERATION_SYSTEM_PROMPT,
    build_roadmap_generation_user_prompt,
)
from utils.helpers import extract_and_parse_json

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

# Default model configuration
DEFAULT_MODEL = os.getenv("OPENAI_MODEL", "gpt-5.6")


class RoadmapService:
    """Service wrapper for generating project development roadmaps using OpenAI."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            logger.warning(
                "OPENAI_API_KEY is not set in environment or .env file. "
                "Calls to Roadmap API will fail until configured."
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

    def generate_roadmap(
        self,
        title: str,
        description: str,
        solution: str,
        category: str,
        model: Optional[str] = None
    ) -> RoadmapGenerateResponse:
        """Generates a complete multi-phase software engineering roadmap.
        
        Args:
            title: Project title.
            description: Problem & idea description.
            solution: Proposed solution architecture.
            category: Industry or domain category.
            model: OpenAI model identifier (defaults to 'gpt-5.6' or OPENAI_MODEL env var).
            
        Returns:
            RoadmapGenerateResponse containing ordered phase list with tasks.
            
        Raises:
            HTTPException: In case of authentication, rate limit, network, or parsing errors.
        """
        client = self._get_client()
        target_model = model or DEFAULT_MODEL

        system_prompt = ROADMAP_GENERATION_SYSTEM_PROMPT
        user_prompt = build_roadmap_generation_user_prompt(
            title=title,
            description=description,
            solution=solution,
            category=category
        )

        try:
            logger.info(f"Calling OpenAI model '{target_model}' for roadmap generation.")

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
                logger.error("OpenAI returned empty completion content for roadmap generation.")
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="AI service returned an empty response."
                )

            # Parse JSON content
            parsed_data = extract_and_parse_json(raw_content)
            if not parsed_data:
                logger.error(f"Failed to parse JSON from AI roadmap response: {raw_content}")
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Failed to parse JSON response from the AI model."
                )

            raw_roadmap = parsed_data.get("roadmap", [])
            phases: List[RoadmapPhase] = []

            if isinstance(raw_roadmap, list):
                for item in raw_roadmap:
                    if isinstance(item, dict):
                        phase_name = str(item.get("phase", "")).strip()
                        raw_tasks = item.get("tasks", [])
                        
                        cleaned_tasks = []
                        if isinstance(raw_tasks, list):
                            for task in raw_tasks:
                                if isinstance(task, str) and task.strip():
                                    cleaned_tasks.append(task.strip())

                        if phase_name and cleaned_tasks:
                            phases.append(
                                RoadmapPhase(
                                    phase=phase_name,
                                    tasks=cleaned_tasks
                                )
                            )

            # Fallback if no valid phases parsed
            if not phases:
                logger.warning("Roadmap response contained no valid phases. Applying standard scaffold fallback.")
                standard_phases = [
                    ("Planning", [f"Define architectural specifications and MVP scope for {title}", "Align domain requirements"]),
                    ("Research", ["Perform technology evaluation and feasibility analysis"]),
                    ("UI/UX", ["Create user workflow wireframes and interface mockups"]),
                    ("Backend", ["Develop core REST/GraphQL API microservices", "Configure database schema"]),
                    ("Frontend", ["Implement interactive user interfaces and dashboards"]),
                    ("AI Development", ["Integrate intelligent microservices and data pipelines"]),
                    ("Testing", ["Execute automated test suite and user acceptance testing"]),
                    ("Deployment", ["Containerize application and deploy CI/CD pipeline"]),
                    ("Future Improvements", ["Scale infrastructure and plan post-launch feature iterations"]),
                ]
                phases = [RoadmapPhase(phase=name, tasks=tasks) for name, tasks in standard_phases]

            return RoadmapGenerateResponse(roadmap=phases)

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
            logger.exception(f"Unexpected error in roadmap generation: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal roadmap generation error: {str(e)}"
            )


# Singleton instance for dependency injection
roadmap_service = RoadmapService()
