export interface Thread {
  id: number;
  username: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
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