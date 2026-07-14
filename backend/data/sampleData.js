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
    discription: "A web app that generates music playlists based on the user's current mood and weather conditions.",
    userid: "user_alice_123",
    problem: "Existing playlist generators rely only on genre or simple history, ignoring real-time environmental context."
  },
  {
    title: "Smart Garden Monitoring System",
    discription: "An IoT application that tracks soil moisture, temperature, and light levels, notifying users when to water.",
    userid: "user_bob_456",
    problem: "People often forget to water houseplants, leading to under-watering or over-watering."
  }
];

export { sampleUsers, sampleIdeas };