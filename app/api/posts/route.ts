import { NextResponse, NextRequest } from 'next/server';
import {
  getPostByIdFromDatabase,
  getPostsFromDatabase,
} from '@/app/lib/data/mock-data';
import { HTTP_STATUS } from '@/app/lib/constants';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOptions';

const CONTENT_TYPE_JSON = 'application/json';

const cacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

function validateContentType(request: NextRequest): boolean {
  const contentType = request.headers.get('content-type');
  return !contentType || contentType.includes(CONTENT_TYPE_JSON);
}

function setCache(data: unknown, status = 200): NextResponse {
  return NextResponse.json(data, { status, headers: cacheHeaders });
}

async function checkPostsAuth(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);

  if (!session) {
    return setCache({ error: 'Unauthorized' }, HTTP_STATUS.UNAUTHORIZED);
  }
  try {
    // Validate content type early
    if (!validateContentType(request)) {
      return setCache(
        { error: 'Invalid Content-Type header' },
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('id');

    if (postId) {
      if (typeof postId !== 'string' || postId.trim().length === 0) {
        return setCache({ error: 'Invalid post ID' }, HTTP_STATUS.BAD_REQUEST);
      }

      const post = await getPostByIdFromDatabase(postId);
      if (!post) {
        return setCache({ error: 'Post not found' }, HTTP_STATUS.NOT_FOUND);
      }
      return setCache(post);
    }

    const posts = await getPostsFromDatabase();
    return setCache(posts);
  } catch (error) {
    console.error('Failed to fetch posts:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return setCache(
      { error: 'Failed to fetch posts' },
      HTTP_STATUS.SERVER_ERROR
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  return checkPostsAuth(request);
}
