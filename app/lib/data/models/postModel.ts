export interface PostModel {
  id: string;
  title: string;
  userId: string;
  body: string;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
