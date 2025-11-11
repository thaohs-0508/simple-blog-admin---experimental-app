import { GET } from '../route';
import { NextRequest } from 'next/server';
import { HTTP_STATUS } from '@/app/lib/constants';
import {
  setupAuthenticatedSession,
  mockGetPostByIdFromDatabase,
  mockGetPostsFromDatabase,
  testUtils,
} from './setup';

describe('GET /api/posts - Fetch Single Post by ID', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupAuthenticatedSession();
  });

  test('returns single post when postId is provided', async () => {
    const mockPost = testUtils.createMockPost({ id: 'post-1' });
    mockGetPostByIdFromDatabase.mockResolvedValueOnce(mockPost);

    const request = new NextRequest(
      new URL('http://localhost:3000/api/posts?id=post-1')
    );
    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.OK);
    const data = await response.json();
    expect(data).toEqual(mockPost);
  });

  test('returns 400 Bad Request for empty postId', async () => {
    mockGetPostsFromDatabase.mockResolvedValueOnce([]);

    const request = new NextRequest(
      new URL('http://localhost:3000/api/posts?id=')
    );
    const response = await GET(request);

    // Empty postId falls through to fetch all posts
    expect(response.status).toBe(HTTP_STATUS.OK);
  });

  test('returns 400 Bad Request for whitespace-only postId', async () => {
    const request = new NextRequest(
      new URL('http://localhost:3000/api/posts?id=%20%20%20')
    );
    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
    const data = await response.json();
    expect(data).toEqual({ error: 'Invalid post ID' });
  });

  test('returns 404 Not Found when post does not exist', async () => {
    mockGetPostByIdFromDatabase.mockResolvedValueOnce(null);

    const request = new NextRequest(
      new URL('http://localhost:3000/api/posts?id=non-existent')
    );
    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
    const data = await response.json();
    expect(data).toEqual({ error: 'Post not found' });
  });

  test('returns correct format for single post', async () => {
    const mockPost = testUtils.createMockPost({
      id: 'post-123',
      title: 'Detailed Post',
      body: 'This is a detailed post body',
      image: '/images/detail.jpg',
    });
    mockGetPostByIdFromDatabase.mockResolvedValueOnce(mockPost);

    const request = new NextRequest(
      new URL('http://localhost:3000/api/posts?id=post-123')
    );
    const response = await GET(request);

    const data = await response.json();
    expect(data).toHaveProperty('id', 'post-123');
    expect(data).toHaveProperty('title', 'Detailed Post');
    expect(data).toHaveProperty('body');
    expect(data).toHaveProperty('userId');
  });

  test('retrieves specific post with correct ID', async () => {
    const mockPost = testUtils.createMockPost({ id: 'specific-id' });
    mockGetPostByIdFromDatabase.mockResolvedValueOnce(mockPost);

    const request = new NextRequest(
      new URL('http://localhost:3000/api/posts?id=specific-id')
    );
    const response = await GET(request);

    const data = await response.json();
    expect(data.id).toBe('specific-id');
    expect(mockGetPostByIdFromDatabase).toHaveBeenCalledWith('specific-id');
  });
});
