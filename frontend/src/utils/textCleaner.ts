/**
 * Text Cleaner Utility
 * --------------------
 * Strips conversational preamble phrases, headers, surrounding quotes,
 * and conversational sign-offs from AI-generated responses.
 */

export function cleanAiDescription(text: string): string {
  if (!text || typeof text !== "string") return "";
  let cleaned = text.trim();

  // 1. Remove markdown code blocks if wrapped
  if (cleaned.startsWith("```") && cleaned.endsWith("```")) {
    cleaned = cleaned.replace(/^```(?:markdown|text|json)?\s*\n?/, "").replace(/\n?```\s*$/, "").trim();
  }

  // 2. Remove common AI introductory / conversational preamble lines
  const linePreamblePatterns = [
    // Lines starting with "Here is...", "Here are...", "Here's..."
    /^Here(?:\s+is|\s+are|'s)\b[^\n]*?(?::|\n+)/i,
    // Lines starting with "Sure...", "Certainly...", "Of course..."
    /^(?:Sure|Certainly|Of course|Absolutely)(?:[!,.]|\s+thing)?[^\n]*?(?::|\n+)/i,
    // Lines starting with "Below is...", "I've refined...", "I have refined..."
    /^(?:Below\s+is|I(?:'ve|\s+have)\s+(?:refined|expanded|improved|updated|crafted))[^\n]*?(?::|\n+)/i,
    // Markdown headings or labeled prefixes like "**Refined Problem Statement:**", "### Refined Problem", "Problem Statement:"
    /^(?:#{1,6}\s*|\*{1,2}|_{1,2})?\s*(?:Refined|Revised|Improved|Updated|Polished|Proposed)?\s*(?:Problem(?:\s+Statement|\s+Description)?|Solution(?:\s+Statement|\s+Description)?|Description|Statement)\s*(?::|-)?\s*(?:\*{1,2}|_{1,2})?\s*(?::|-)?\s*(?:\n+|\s+|$)/i,
  ];

  let matched = true;
  while (matched) {
    matched = false;
    for (const pattern of linePreamblePatterns) {
      if (pattern.test(cleaned)) {
        cleaned = cleaned.replace(pattern, "").trim();
        matched = true;
      }
    }
  }

  // 3. Remove leading/trailing quotes if wrapped
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("“") && cleaned.endsWith("”")) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'")) ||
    (cleaned.startsWith("`") && cleaned.endsWith("`"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }

  // 4. Remove leading blockquote markers (> )
  cleaned = cleaned.replace(/^>\s?/gm, "").trim();

  // 5. Remove trailing conversational sign-offs
  cleaned = cleaned.replace(/\n\s*(?:Hope this helps!?|Let me know if you(?:'d like| would like| need) .*\.?)\s*$/i, "").trim();

  return cleaned;
}

export default cleanAiDescription;
