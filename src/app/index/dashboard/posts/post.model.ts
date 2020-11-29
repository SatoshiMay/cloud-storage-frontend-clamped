export interface Post {
  _id: string;
  from: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar: string
  };
  replyTo?: string;
  replies?: Post[];
  message: string;
  likes: number;
  created: string;
}
