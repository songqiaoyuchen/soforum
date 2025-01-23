export interface Thread {
  id: number;
  username: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  votes: number;
  created_at: string
}

export interface PostData {
  title: string;
  content: string;
  category: string;
  tags: string[]
}

export interface ThreadComment {
  id: number;
  username: string;
  content: string;
  created_at: string;
}

export interface CommentData {
  content: string;
} 

export interface VoteData {
  vote: 1 | -1;
}