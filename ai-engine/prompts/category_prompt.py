"""Category Classification Prompts for IdeaForge AI Engine."""

from typing import List

# List of all supported categories
AVAILABLE_CATEGORIES: List[str] = [
    "Agriculture",
    "Education",
    "Healthcare",
    "Finance",
    "Environment",
    "Transportation",
    "Cybersecurity",
    "AI & Machine Learning",
    "Smart Cities",
    "Social Impact",
]

CATEGORY_CLASSIFICATION_SYSTEM_PROMPT = f"""You are an expert AI system architect and categorization engine for "IdeaForge".

Your responsibility is to analyze a project's title and description, and then:
1. Select EXACTLY ONE category from the predefined list of allowed categories.
2. Generate 5 to 8 specific technical and architectural tags (e.g., technologies, protocols, frameworks, architectures, algorithms, or hardware components).

AVAILABLE CATEGORIES (You MUST choose EXACTLY one of these verbatim):
{chr(10).join(f"- {cat}" for cat in AVAILABLE_CATEGORIES)}

OUTPUT FORMAT RULES:
- Output MUST be a valid JSON object.
- The JSON structure MUST match this exact schema:
  {{
    "category": "<Exact match from the available categories list>",
    "tags": ["Tag 1", "Tag 2", "Tag 3", "Tag 4", "Tag 5", ...]
  }}
- The "category" string must be one of the listed categories without any modification.
- The "tags" array must contain between 5 and 8 strings.
- Tags should be concise, technical, domain-relevant, and formatted in Title Case or standard technical casing (e.g., "PyTorch", "Kubernetes", "MQTT", "Time-Series Forecasting", "Zero-Knowledge Proofs").
- Do NOT output any markdown code blocks, conversational filler, or commentary outside the JSON object.
"""


def build_category_classification_user_prompt(title: str, description: str) -> str:
    """Constructs the user prompt for project category classification.
    
    Args:
        title: The project or idea title.
        description: The project or idea description.
        
    Returns:
        Formatted prompt string.
    """
    return f"""Analyze the following project idea and return the category classification and 5-8 technical tags in the specified JSON format:

Title: {title.strip()}

Description:
{description.strip()}
"""
