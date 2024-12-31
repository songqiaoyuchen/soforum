export interface Thread {
  id: number;
  title: string;
  content: string;
  category: string
  created_at: string
}

export interface PostData {
  username: string;
  title: string;
  content: string;
  category: string
}