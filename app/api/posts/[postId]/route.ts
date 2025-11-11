import {
  deletePostFromDatabase,
  getPostByIdFromDatabase,
} from '@/app/lib/data/mock-data';
import { NextResponse, NextRequest } from 'next/server';
import { HTTP_STATUS } from '@/app/lib/constants';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOptions';

function validateContentType(request: NextRequest): boolean {
  const contentType = request.headers.get('content-type');
  return (
    !contentType ||
    contentType.includes('application/json') ||
    contentType.includes('text/plain')
  );
}

function validateSession(): boolean {
  const session = getServerSession(authOptions);
  return !!session;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
): Promise<NextResponse> {
  try {
    if (!validateSession()) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }
    const { postId } = await params;
    const post = await getPostByIdFromDatabase(postId);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error('Failed to fetch post:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: HTTP_STATUS.SERVER_ERROR }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
): Promise<NextResponse> {
  try {
    if (!validateContentType(request)) {
      return NextResponse.json(
        { error: 'Invalid Content-Type header' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    if (!validateSession()) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const { postId } = await params;

    if (!postId || typeof postId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Sensitive operation: DELETE requires authentication check
    // TODO: Add authentication verification before deletion
    const post = await getPostByIdFromDatabase(postId);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    // Perform deletion after authentication checks
    await deletePostFromDatabase(postId);

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Failed to delete post:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: HTTP_STATUS.SERVER_ERROR }
    );
  }
}
