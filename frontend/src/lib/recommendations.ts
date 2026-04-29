export function generateTechStack(tags: string[], difficulty: string): string {
  const lowercaseTags = tags.map((t) => t.toLowerCase());

  let frontend = "HTML/CSS/JS (Vanilla)";
  let backend = "Node.js + Express";
  let database = "PostgreSQL";
  const hosting = "Vercel or Render";

  // Frontend logic
  if (lowercaseTags.includes("web") || lowercaseTags.includes("frontend")) {
    frontend = "React or Next.js";
  } else if (lowercaseTags.includes("mobile") || lowercaseTags.includes("ios") || lowercaseTags.includes("android")) {
    frontend = "React Native or Flutter";
  }

  // Backend/AI logic
  if (lowercaseTags.includes("ai") || lowercaseTags.includes("machine learning") || lowercaseTags.includes("data science")) {
    backend = "Python (FastAPI or Flask)";
  } else if (lowercaseTags.includes("blockchain") || lowercaseTags.includes("web3")) {
    backend = "Solidity + Hardhat/Foundry";
  }

  // Database logic
  if (lowercaseTags.includes("nosql") || lowercaseTags.includes("mongodb")) {
    database = "MongoDB";
  } else if (lowercaseTags.includes("realtime") || lowercaseTags.includes("firebase")) {
    database = "Firebase / Supabase";
  }

  // Difficulty scaling
  if (difficulty === "Beginner") {
    return `For a beginner-friendly approach, consider using a simple stack like HTML/CSS/JS with Firebase for backend/database.`;
  }

  return `Suggested Stack: **Frontend**: ${frontend} | **Backend**: ${backend} | **Database**: ${database} | **Hosting**: ${hosting}`;
}
