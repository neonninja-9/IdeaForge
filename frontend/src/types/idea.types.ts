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
  type: "vote" | "comment" | "mention" | "system";
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
