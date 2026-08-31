"""Utility helper functions for IdeaForge AI Engine."""

import json
import re
from typing import Any, Dict, Optional


def extract_and_parse_json(text: str) -> Optional[Dict[str, Any]]:
    """Attempts to extract and parse a valid JSON object from a model response string.
    
    Handles raw JSON as well as JSON enclosed in markdown code blocks.
    
    Args:
        text: Raw response string from LLM.
        
    Returns:
        Parsed dictionary or None if parsing fails.
    """
    if not text:
        return None

    cleaned = text.strip()

    # Direct JSON parse attempt
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # Match JSON block inside ```json ... ``` or ``` ... ```
    json_block_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", cleaned, re.IGNORECASE)
    if json_block_match:
        try:
            return json.loads(json_block_match.group(1).strip())
        except json.JSONDecodeError:
            pass

    # Match first '{' to last '}'
    brace_match = re.search(r"\{[\s\S]*\}", cleaned)
    if brace_match:
        try:
            return json.loads(brace_match.group(0).strip())
        except json.JSONDecodeError:
            pass

    return None
