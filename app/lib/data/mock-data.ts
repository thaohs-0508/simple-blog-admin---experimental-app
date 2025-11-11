import { PostModel } from './models/postModel';
import UserModel from './models/userModel';
import { mapToUserModel } from './mappers/userMapper';

const API_MOCK_URL =
  process.env.NEXT_PUBLIC_API_MOCK_URL || 'http://localhost:3001';
export async function getPostsFromDatabase(): Promise<Array<PostModel>> {
  const res = await fetch(`${API_MOCK_URL}/posts`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch posts from API');
  }
  const posts: Array<PostModel> = await res.json();
  return posts;
}

export async function getPostByIdFromDatabase(
  postId: string
): Promise<PostModel | null> {
  const res = await fetch(`${API_MOCK_URL}/posts/${postId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error('Failed to fetch post from API');
  }
  const post: PostModel = await res.json();
  return post;
}

export async function deletePostFromDatabase(postId: string) {
  const res = await fetch(`${API_MOCK_URL}/posts/${postId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error('Failed to delete post from API');
  }
  return true;
}

export async function updatePostInDatabase(
  postId: string,
  updatedData: Partial<PostModel>
) {
  const existingPost = await getPostByIdFromDatabase(postId);
  if (!existingPost) {
    throw new Error('Post not found');
  }
  const mergedData = { ...existingPost, ...updatedData };
  const res = await fetch(`${API_MOCK_URL}/posts/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mergedData),
  });
  if (!res.ok) {
    throw new Error('Failed to update post in API');
  }
  return true;
}

export async function addPostToDatabase(postData: {
  title: string;
  body: string;
}) {
  const res = await fetch(`${API_MOCK_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });
  if (!res.ok) {
    throw new Error('Failed to add post to API');
  }
  const newPost: PostModel = await res.json();
  return newPost;
}
