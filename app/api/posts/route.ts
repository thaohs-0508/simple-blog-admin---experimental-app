import { NextResponse, NextRequest } from 'next/server';
import { HTTP_STATUS } from '@/app/lib/constants';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOptions';
import { getAllPosts, getPostById } from '@/app/lib/services/postService';

const CONTENT_TYPE_JSON = 'application/json';

function validateContentType(request: NextRequest): boolean {
  const contentType = request.headers.get('content-type');
  return !contentType || contentType.includes(CONTENT_TYPE_JSON);
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: HTTP_STATUS.UNAUTHORIZED }
    );
  }
  try {
    // Validate content type early
    if (!validateContentType(request)) {
      return NextResponse.json(
        { error: 'Invalid Content-Type header' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('id');

    if (postId) {
      if (typeof postId !== 'string' || postId.trim().length === 0) {
        return NextResponse.json(
          { error: 'Invalid post ID' },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }

      const post = await getPostById(postId);
      if (!post) {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: HTTP_STATUS.NOT_FOUND }
        );
      }
      return NextResponse.json(post);
    }

    const posts = await getAllPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Failed to fetch posts:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: HTTP_STATUS.SERVER_ERROR }
    );
  }
}
