import { getDictionary } from '@/app/lib/get-dictionary';
import RenderPostsList from './PostList';
import { PostModel } from '@/app/lib/data/models/postModel';
import { getAllPosts } from '@/app/lib/services/postService';

type Props = {
  params: Promise<{ locale: 'en' | 'vi' }>;
};

export default async function RenderPostsPage({ params }: Props) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const posts: PostModel[] = await getAllPosts();
  return <RenderPostsList dict={dict} locale={locale} posts={posts} />;
}
