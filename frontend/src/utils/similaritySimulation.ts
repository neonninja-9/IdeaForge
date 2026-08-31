import { DEMO_IDEAS_DATABASE, type DemoIdea } from "../data/demoIdeasDatabase";

export interface SimilarMatch {
  idea: DemoIdea;
  similarityScore: number; // 0 - 100%
  overlapReasons: string[];
  differentiationAngle: string;
}

export interface SimulationResult {
  noveltyScore: number; // 0 - 100%
  marketSaturation: "Emerging / Low Competition" | "Active Innovation Sector" | "Established & Competitive";
  topMatches: SimilarMatch[];
  uniqueStrengths: string[];
  strategicOpportunity: string;
  scannedCount: number;
}

// Stop words filter for text analysis
const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
  "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
  "can", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing",
  "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't",
  "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers",
  "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in",
  "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't",
  "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought",
  "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll",
  "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their",
  "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll",
  "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very",
  "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's",
  "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's",
  "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your",
  "yours", "yourself", "yourselves", "project", "idea", "tool", "app", "system", "platform", "user"
]);

function extractKeywords(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
  return new Set(words);
}

function calculateJaccard(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export function runIdeaSimilaritySimulation(userIdea: {
  title: string;
  problem: string;
  solution: string;
  tags?: string[];
  category?: string;
}): SimulationResult {
  const userTitleTokens = extractKeywords(userIdea.title);
  const userProblemTokens = extractKeywords(userIdea.problem);
  const userSolutionTokens = extractKeywords(userIdea.solution);
  const userAllTokens = new Set([...userTitleTokens, ...userProblemTokens, ...userSolutionTokens]);
  const userTagsLower = new Set((userIdea.tags || []).map(t => t.toLowerCase()));

  const matchesWithScores: Array<{ idea: DemoIdea; score: number; reasons: string[]; angle: string }> = [];

  for (const demo of DEMO_IDEAS_DATABASE) {
    const demoTitleTokens = extractKeywords(demo.title);
    const demoProblemTokens = extractKeywords(demo.problem);
    const demoSolutionTokens = extractKeywords(demo.solution);
    const demoAllTokens = new Set([...demoTitleTokens, ...demoProblemTokens, ...demoSolutionTokens]);
    const demoTagsLower = new Set(demo.tags.map(t => t.toLowerCase()));

    // 1. Textual Semantic Similarity (weight 45%)
    const titleSim = calculateJaccard(userTitleTokens, demoTitleTokens) * 1.5;
    const bodySim = calculateJaccard(userAllTokens, demoAllTokens);
    const textScore = Math.min(1, titleSim * 0.4 + bodySim * 0.6);

    // 2. Tag & Focus Intersection (weight 35%)
    let tagIntersection = 0;
    for (const tag of userTagsLower) {
      if (demoTagsLower.has(tag) || demo.tags.some(dt => dt.toLowerCase().includes(tag) || tag.includes(dt.toLowerCase()))) {
        tagIntersection++;
      }
    }
    const tagScore = userTagsLower.size > 0 ? Math.min(1, tagIntersection / Math.max(1, Math.min(3, userTagsLower.size))) : 0.2;

    // 3. Category Correlation (weight 20%)
    const categoryMatch = userIdea.category && (
      demo.category.toLowerCase().includes(userIdea.category.toLowerCase()) ||
      userIdea.category.toLowerCase().includes(demo.category.toLowerCase())
    ) ? 1.0 : 0.1;

    // Combined Raw Score: 0 to 1
    const rawScore = (textScore * 0.45) + (tagScore * 0.35) + (categoryMatch * 0.20);
    
    // Scale and calibrate to realistic 25% - 88% range
    let scaledScore = Math.round(Math.min(92, Math.max(22, rawScore * 100 * 1.3 + (tagIntersection > 0 ? 15 : 5))));

    // Identify overlap reasons
    const reasons: string[] = [];
    if (tagIntersection > 0) {
      const shared = demo.tags.filter(t => userTagsLower.has(t.toLowerCase()));
      if (shared.length > 0) reasons.push(`Shared focus in ${shared.slice(0, 2).join(" & ")}`);
    }
    if (titleSim > 0.1 || bodySim > 0.15) {
      reasons.push(`Targeting similar domain: ${demo.focusArea}`);
    } else {
      reasons.push(`Adjacent approach within ${demo.category}`);
    }

    // Determine differentiation angle
    let angle = demo.differentiator;
    if (userIdea.title.toLowerCase().includes("ai") || userIdea.problem.toLowerCase().includes("ai")) {
      angle = `Your emphasis on specific problem workflows vs their focus on ${demo.focusArea}.`;
    }

    matchesWithScores.push({
      idea: demo,
      score: scaledScore,
      reasons,
      angle
    });
  }

  // Sort descending by similarity score
  matchesWithScores.sort((a, b) => b.score - a.score);

  const topMatches: SimilarMatch[] = matchesWithScores.slice(0, 3).map(m => ({
    idea: m.idea,
    similarityScore: m.score,
    overlapReasons: m.reasons,
    differentiationAngle: m.angle
  }));

  const highestSimilarity = topMatches[0]?.similarityScore || 30;
  const noveltyScore = Math.max(52, Math.min(96, Math.round(100 - (highestSimilarity * 0.6) + Math.random() * 6)));

  let marketSaturation: SimulationResult["marketSaturation"] = "Active Innovation Sector";
  if (noveltyScore >= 82) {
    marketSaturation = "Emerging / Low Competition";
  } else if (noveltyScore <= 68) {
    marketSaturation = "Established & Competitive";
  }

  // Generate dynamic unique strengths
  const uniqueStrengths: string[] = [
    `Distinct problem framing centered on real-world workflow efficiency.`,
    `Opportunity to offer a lighter, more targeted user experience than legacy alternatives.`,
    `High synergy potential for open-source community contributions and modular extensions.`
  ];

  const strategicOpportunity = noveltyScore >= 80
    ? "High novelty index! You have a strong early-mover advantage to capture this specific pain point before larger competitors pivot."
    : "Proven market demand! Focus on superior developer ergonomics, faster time-to-value, and specialized niche integrations.";

  return {
    noveltyScore,
    marketSaturation,
    topMatches,
    uniqueStrengths,
    strategicOpportunity,
    scannedCount: DEMO_IDEAS_DATABASE.length
  };
}

export default runIdeaSimilaritySimulation;
