const sampleUsers = [
  {
    username: "alice_dev",
    email: "alice@example.com",
    passwordHash: "$2b$10$abcdefghijklmnopqrstuv", // Mock bcrypt hash
  },
  {
    username: "bob_coder",
    email: "bob@example.com",
    passwordHash: "$2b$10$1234567890abcdefghijkl", // Mock bcrypt hash
  }
];

const sampleIdeas = [
  {
    title: "AI-Powered Playlist Generator",
    solution: "A web app that generates music playlists based on the user's current mood and weather conditions.",
    problem: "Existing playlist generators rely only on genre or simple history, ignoring real-time environmental context.",
    difficulty: "Intermediate",
  },
  {
    title: "Smart Garden Monitoring System",
    solution: "An IoT application that tracks soil moisture, temperature, and light levels, notifying users when to water.",
    problem: "People often forget to water houseplants, leading to under-watering or over-watering.",
    difficulty: "Beginner",
  }
];

export { sampleUsers, sampleIdeas };