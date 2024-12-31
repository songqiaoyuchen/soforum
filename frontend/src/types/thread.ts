export interface Thread {
  id: number;
  username: string;
  title: string;
  content: string;
  category: string
  created_at: string
}

export interface PostData {
  title: string;
  content: string;
  category: string
}