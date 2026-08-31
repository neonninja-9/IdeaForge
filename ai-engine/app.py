"""IdeaForge AI Engine - Main Application Entrypoint.

Phase 1: Project Categorization & Technical Tag Generation Microservice.
Phase 2: Technical Solution & Architecture Proposal Generation Microservice.
Phase 3: Semantic Similarity & Embedding Generation Microservice.
Phase 4: Software Engineering Roadmap Generation Microservice.
Integration: Unified Pipeline Microservice (POST /api/process).
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from api.category import router as category_router
from api.solution import router as solution_router
from api.similarity import router as similarity_router
from api.roadmap import router as roadmap_router
from api.process import router as process_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("ideaforge-ai-engine")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown event handler."""
    logger.info("Starting IdeaForge AI Engine (All Modules & Pipeline Active)...")
    yield
    logger.info("Shutting down IdeaForge AI Engine...")


# Initialize FastAPI Application
app = FastAPI(
    title="IdeaForge AI Engine",
    description="""
# 🚀 IdeaForge AI Engine Microservice

Comprehensive AI-powered microservice suite for the IdeaForge platform.

## Available Endpoints:
* **Full Integrated Pipeline** (`POST /api/process`): Orchestrates all 4 stages sequentially into a single unified JSON payload.
* **Phase 1: Category Classification** (`POST /api/category/classify`): Categorizes project ideas into 10 industry domains and extracts 5–8 technical tags using GPT-5.6.
* **Phase 2: Solution Generation** (`POST /api/solution/generate`): Generates architectural proposals, impact analyses, suggested tech stacks, difficulty levels, and MVP timelines using GPT-5.6.
* **Phase 3: Similarity & Embeddings** (`POST /api/similarity/check`): Generates high-dimensional dense vector embeddings using OpenAI `text-embedding-3-small`.
* **Phase 4: Roadmap Generation** (`POST /api/roadmap/generate`): Generates comprehensive end-to-end software development roadmaps across 9 structured engineering phases using GPT-5.6.
    """,
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# Enable CORS for frontend and backend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers (Preserving all individual modules + unified pipeline)
app.include_router(process_router)
app.include_router(category_router)
app.include_router(solution_router)
app.include_router(similarity_router)
app.include_router(roadmap_router)


@app.get(
    "/",
    tags=["Health & Status"],
    summary="Root Status",
    description="Returns basic information about the microservice."
)
async def root():
    """Root status endpoint."""
    return {
        "service": "IdeaForge AI Engine",
        "version": "2.0.0",
        "features": [
            "POST /api/process (Full Pipeline)",
            "POST /api/category/classify (Phase 1)",
            "POST /api/solution/generate (Phase 2)",
            "POST /api/similarity/check (Phase 3)",
            "POST /api/roadmap/generate (Phase 4)"
        ],
        "status": "online",
        "docs": "/docs",
    }


@app.get(
    "/health",
    tags=["Health & Status"],
    summary="Health Check",
    description="Liveness and health check endpoint for container orchestrators and load balancers."
)
async def health_check():
    """Health check endpoint."""
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status": "healthy",
            "service": "IdeaForge AI Engine",
            "version": "2.0.0",
            "pipeline": "ready"
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.py:app", host="0.0.0.0", port=8000, reload=True)
