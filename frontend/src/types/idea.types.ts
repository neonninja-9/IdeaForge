/**
 * Idea Types
 * ----------
 * TypeScript interfaces for the ideas system.
 */

export interface Category {
  id: string;
  _id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface Tag {
  id: string;
  _id: string;
  name: string;
  slug: string;
}

export interface IdeaAuthor {
  _id: string;
  id?: string;
  username: string;
}

export interface Attachment {
  name: string;
  url: string;
  type: string;
  size?: number;
}

export interface RoadmapPhase {
  phase: string;
  tasks: string[];
}

export interface Idea {
  id: string;
  _id: string;
  title: string;
  problem: string;
  solution: string;
  impact?: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  suggestedTechStack?: string;
  techStack?: string[];
  estimatedTime?: string;
  roadmap?: RoadmapPhase[];
  status: "draft" | "published";
  attachments?: Attachment[];
  workflow?: string;
  architecture?: string;
  author: IdeaAuthor;
  category: Category;
  tags: Tag[];
  voteCount: number;
  commentCount: number;
  hasVoted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  _id: string;
  text: string;
  idea: string;
  user: { _id: string; id?: string; username: string };
  createdAt: string;
}

export interface IdeasListResponse {
  status: "success";
  data: {
    ideas: Idea[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface IdeaDetailResponse {
  status: "success";
  data: {
    idea: Idea;
  };
}

export interface CategoriesResponse {
  status: "success";
  data: {
    categories: Category[];
  };
}

export interface TagsResponse {
  status: "success";
  data: {
    tags: Tag[];
  };
}

export interface CommentsResponse {
  status: "success";
  data: {
    comments: Comment[];
  };
}

export interface VoteToggleResponse {
  status: "success";
  data: {
    voted: boolean;
    voteCount: number;
  };
}

export interface DashboardResponse {
  status: "success";
  data: {
    stats: {
      ideasCount: number;
      totalVotes: number;
      totalComments: number;
    };
    ideas: Idea[];
    total?: number;
    page?: number;
    totalPages?: number;
  };
}

export interface MyIdeasResponse {
  status: "success";
  data: {
    ideas: Idea[];
    total?: number;
    page?: number;
    totalPages?: number;
  };
}

export interface CreateIdeaPayload {
  title: string;
  problem: string;
  solution: string;
  impact?: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category?: string;
  tags?: string[];
  suggestedTechStack?: string;
  status?: "draft" | "published";
  attachments?: Attachment[];
}

export interface NotificationItem {
  id: string;
  _id?: string;
  recipient: string;
  actor: { _id: string; id?: string; username: string; avatarUrl?: string };
  type: "vote" | "comment" | "mention" | "system" | "solution" | "upvote";
  idea?: { _id: string; id?: string; title: string };
  read: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  status: "success";
  data: {
    notifications: NotificationItem[];
    unreadCount: number;
  };
}

export interface FavoritesResponse {
  status: "success";
  data: {
    favorites: string[];
    ideas?: Idea[];
  };
}

export interface AlternativeSolution {
  id: string;
  _id: string;
  idea: string;
  author: { _id: string; id?: string; username: string; avatar?: string };
  title: string;
  description: string;
  techStack?: string;
  upvotes: number;
  upvotedBy: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SolutionsListResponse {
  status: "success";
  data: {
    solutions: AlternativeSolution[];
  };
}

export interface SolutionResponse {
  status: "success";
  data: {
    solution: AlternativeSolution;
  };
}

export interface SolutionVoteToggleResponse {
  status: "success";
  data: {
    voted: boolean;
    upvotes: number;
  };
}

/* ── ForgeCoins / Wallet ────────────────────────────────────── */

export interface Wallet {
  balance: number;
  lifetimeEarnings: number;
}

export interface WalletTransaction {
  id: string;
  amount: number;
  type: string;
  reason: string;
  relatedIdea: { id: string; title: string } | null;
  balanceAfter: number;
  createdAt: string;
}

export interface WalletResponse {
  status: "success";
  data: { wallet: Wallet };
}

export interface TransactionsResponse {
  status: "success";
  data: {
    transactions: WalletTransaction[];
    total: number;
    page: number;
    totalPages: number;
  };
}
