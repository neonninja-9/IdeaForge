"""Pipeline Orchestrator Service for IdeaForge AI Engine.

Coordinates sequential execution across all four AI modules:
1. Category Classification (GPT-5.6)
2. Solution Generation (GPT-5.6)
3. Similarity & Embedding Generation (text-embedding-3-small)
4. Software Engineering Roadmap Generation (GPT-5.6)

Note: No database persistence is performed in this service.
"""

import logging
import time
from typing import Optional
from fastapi import HTTPException, status

from models.request_models import IdeaProcessResponse
from services.openai_service import OpenAIService, openai_service
from services.solution_service import SolutionService, solution_service
from services.similarity_service import SimilarityService, similarity_service
from services.roadmap_service import RoadmapService, roadmap_service

logger = logging.getLogger(__name__)


class PipelineService:
    """Orchestrates end-to-end idea processing through the four AI engine microservice stages."""

    def __init__(
        self,
        cat_service: Optional[OpenAIService] = None,
        sol_service: Optional[SolutionService] = None,
        sim_service: Optional[SimilarityService] = None,
        rdm_service: Optional[RoadmapService] = None,
    ):
        self.category_service = cat_service or openai_service
        self.solution_service = sol_service or solution_service
        self.similarity_service = sim_service or similarity_service
        self.roadmap_service = rdm_service or roadmap_service

    def process_idea_pipeline(self, title: str, description: str) -> IdeaProcessResponse:
        """Executes the complete four-step processing pipeline for an idea.
        
        Execution Order:
        1. Category Classifier -> Extracts Category & Tags
        2. Solution Generator -> Generates Proposed Solution, Impact, Tech Stack, Difficulty, Estimated Time
        3. Similarity Checker -> Generates Dense Vector Embedding
        4. Roadmap Generator -> Produces Multi-Phase Software Roadmap using Solution & Category
        
        Args:
            title: Project or idea title.
            description: Problem statement and project description.
            
        Returns:
            Unified IdeaProcessResponse containing results from all 4 stages.
            
        Raises:
            HTTPException: If any pipeline stage fails or encounters API errors.
        """
        start_time = time.perf_counter()
        logger.info(f"Starting full AI processing pipeline for idea: '{title[:50]}'")

        try:
            # -------------------------------------------------------------
            # Stage 1: Category Classifier
            # -------------------------------------------------------------
            stage1_start = time.perf_counter()
            logger.info("[Pipeline Stage 1/4] Running Category Classifier...")
            category_res = self.category_service.classify_project_category(
                title=title,
                description=description
            )
            logger.info(
                f"[Pipeline Stage 1/4] Completed in {time.perf_counter() - stage1_start:.2f}s: "
                f"Category='{category_res.category.value}', Tags Count={len(category_res.tags)}"
            )

            # -------------------------------------------------------------
            # Stage 2: Solution Generator
            # -------------------------------------------------------------
            stage2_start = time.perf_counter()
            logger.info("[Pipeline Stage 2/4] Running Solution Generator...")
            solution_res = self.solution_service.generate_solution(
                title=title,
                description=description
            )
            logger.info(
                f"[Pipeline Stage 2/4] Completed in {time.perf_counter() - stage2_start:.2f}s: "
                f"Difficulty='{solution_res.difficulty}', TechStack Count={len(solution_res.techStack)}"
            )

            # -------------------------------------------------------------
            # Stage 3: Similarity Checker (Vector Embedding)
            # -------------------------------------------------------------
            stage3_start = time.perf_counter()
            logger.info("[Pipeline Stage 3/4] Running Similarity Embedding Generator...")
            similarity_res = self.similarity_service.get_idea_embedding(
                title=title,
                description=description
            )
            logger.info(
                f"[Pipeline Stage 3/4] Completed in {time.perf_counter() - stage3_start:.2f}s: "
                f"Embedding Vector Dimensions={len(similarity_res.embedding)}"
            )

            # -------------------------------------------------------------
            # Stage 4: Roadmap Generator
            # -------------------------------------------------------------
            stage4_start = time.perf_counter()
            logger.info("[Pipeline Stage 4/4] Running Roadmap Generator...")
            roadmap_res = self.roadmap_service.generate_roadmap(
                title=title,
                description=description,
                solution=solution_res.solution,
                category=category_res.category.value
            )
            logger.info(
                f"[Pipeline Stage 4/4] Completed in {time.perf_counter() - stage4_start:.2f}s: "
                f"Roadmap Phases Count={len(roadmap_res.roadmap)}"
            )

            total_duration = time.perf_counter() - start_time
            logger.info(f"Full AI Pipeline executed successfully in {total_duration:.2f}s.")

            # Construct unified response
            return IdeaProcessResponse(
                category=category_res.category,
                tags=category_res.tags,
                solution=solution_res.solution,
                impact=solution_res.impact,
                techStack=solution_res.techStack,
                difficulty=solution_res.difficulty,
                estimatedTime=solution_res.estimatedTime,
                embedding=similarity_res.embedding,
                roadmap=roadmap_res.roadmap
            )

        except HTTPException:
            raise
        except Exception as e:
            logger.exception(f"Unexpected failure in AI pipeline orchestrator: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"An error occurred during pipeline orchestration: {str(e)}"
            )


# Singleton instance for dependency injection
pipeline_service = PipelineService()
