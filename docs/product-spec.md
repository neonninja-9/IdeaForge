# IdeaForge MVP Product Specification

## 1. Overview
IdeaForge is a web platform where developers, students, and innovators can discover, share, and discuss structured project ideas based on real-world problems. This specification defines a practical Minimum Viable Product (MVP) that can be run locally.

---

## 2. User Roles
- **Guest (Unauthenticated):** Can browse the landing page, explore ideas, use search and filtering, and view individual idea details and their comments.
- **Authenticated User:** Can do everything a Guest can, plus submit new ideas, edit/delete their own ideas, upvote/downvote ideas, post comments on ideas, and delete their own comments.

---

## 3. Core User Journeys
1. **Discovery:** A user lands on the site, navigates to the Explore page, and filters ideas by "Beginner" difficulty and the "Web Development" tag to find a suitable project.
2. **Contribution:** A user registers/logs in, navigates to the Submit Idea page, fills out a structured form detailing a real-world problem and proposed solution, receives an automatic tech stack recommendation, and publishes the idea.
3. **Collaboration:** A user finds an interesting idea, upvotes it, and leaves a comment suggesting an alternative API to use for the implementation.
4. **Management:** A user visits their Dashboard to see their submitted ideas and the engagement (votes/comments) they have received, deciding to edit one to clarify the proposed solution.

---

## 4. Required Pages
- **`/` (Landing Page):** Marketing homepage explaining the value proposition.
- **`/explore`:** The main discovery feed listing all ideas with search, filter, and sort controls.
- **`/ideas/[id]`:** Detail page for a specific idea, showing full information, similar ideas, and the comment thread.
- **`/submit`:** Form for authenticated users to create a new idea.
- **`/dashboard`:** Authenticated user's personal hub showing their submitted ideas and activity summary.
- **`/categories` & `/categories/[slug]`:** Directory of domain categories and ideas within a specific category.
- **`/tags/[slug]`:** Directory of ideas sharing a specific technical tag.
- **`/login` & `/register`:** Authentication pages.

---

## 5. Idea Data Model (Fields)
Every idea will capture the following structured information:
- **Title:** Short, descriptive name of the idea.
- **Problem:** Detailed explanation of the real-world issue being solved.
- **Solution:** Proposed concept or application to solve the problem.
- **Category:** The domain of the problem (e.g., Agriculture, Healthcare, Education). *Only one category per idea.*
- **Tags:** Technical classifications (e.g., AI, React, IoT). *Multiple tags allowed.*
- **Difficulty:** Expected complexity (Beginner, Intermediate, Advanced).
- **Impact:** Expected real-world benefit.
- **Suggested Tech Stack:** Auto-recommended technologies (e.g., Python, Next.js, PostgreSQL).
- **Author:** The user who submitted the idea.
- **Engagement Metrics:** Vote count and comment count.
- **Timestamps:** Created at and Updated at.

---

## 6. Core Features

### Category & Tag Behavior
- **Categories:** Represent the "Domain" (e.g., Environment, Finance). Used for top-level organization.
- **Tags:** Represent the "Technology" or "Methodology" (e.g., Machine Learning, Web App). Used for granular filtering.

### Voting
- Authenticated users can upvote an idea exactly once.
- Users can remove their vote (toggle behavior).
- Total vote count is displayed publicly and used for sorting.

### Comments
- Displayed chronologically on the idea detail page.
- Authenticated users can post comments.
- Authors can delete their own comments.
- Text-only for MVP (no rich media or nested replies).

### Search & Filtering (MVP)
- **Text Search:** Matches against Title, Problem, and Solution fields.
- **Filters:** By Category, Tag, and Difficulty.
- **Sorting:** By Newest, Top Voted, and Most Discussed.
- Implemented via URL query parameters for shareability.

### Tech Stack Recommendations (MVP)
- A deterministic, rule-based matching system (not an external AI API).
- Maps specific Tags, Categories, and Difficulty levels to a predefined set of technologies.
- Evaluated during idea submission and saved to the idea record.

---

## 7. Out-of-Scope Future Features
*These features are acknowledged but excluded from the current MVP to ensure practical, timely delivery:*
- External AI API integrations (e.g., OpenAI for generation or embeddings).
- Complex vector-based similarity search (using simple tag/category overlap for MVP).
- Nested comment threads (replies to replies).
- Rich text editing or image uploads for ideas/comments.
- User profiles (public view of other users).
- Social login (OAuth) - MVP will stick to local email/password.
- Email notifications or password resets.
- Team builder, Hackathon mode, Idea funding, and Research mode.
