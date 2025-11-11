import { GET } from '../route';
import { NextRequest } from 'next/server';
import { HTTP_STATUS } from '@/app/lib/constants';
import {
  setupAuthenticatedSession,
  mockGetPostsFromDatabase,
  mockGetPostByIdFromDatabase,
} from './setup';

describe('GET /api/posts - Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupAuthenticatedSession();
  });

  test('handles very large response payload', async () => {
    // Create a very large post payload
    const largePosts = Array.from({ length: 1000 }, (_, i) => ({
      id: `post-${i}`,
      title: `Post ${i}`,
      body: `Body ${i}`.repeat(100),
      userId: 'user-1',
    }));

    mockGetPostsFromDatabase.mockResolvedValueOnce(largePosts as any);

    const request = new NextRequest(new URL('http://localhost:3000/api/posts'));
    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.OK);
    const data = await response.json();
    expect(data.length).toBe(1000);
  });

  test('handles null response from database', async () => {
    mockGetPostsFromDatabase.mockResolvedValueOnce(null as any);

    const request = new NextRequest(new URL('http://localhost:3000/api/posts'));
    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.OK);
    const data = await response.json();
    expect(data).toEqual(null);
  });

  test('handles undefined in response data', async () => {
    mockGetPostsFromDatabase.mockResolvedValueOnce([
      { id: 'post-1', title: 'Post 1', body: undefined, userId: 'user-1' },
    ] as any);

    const request = new NextRequest(new URL('http://localhost:3000/api/posts'));
    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.OK);
    const data = await response.json();
    expect(data[0].body).toBeUndefined();
  });

  test('handles empty string postId parameter', async () => {
    mockGetPostsFromDatabase.mockResolvedValueOnce([]);

    const request = new NextRequest(
      new URL('http://localhost:3000/api/posts?id=')
    );
    const response = await GET(request);

    // Empty ID should fall through to fetch all posts
    expect(response.status).toBe(HTTP_STATUS.OK);
  });

  test('handles postId with special characters', async () => {
    setupAuthenticatedSession();
    mockGetPostByIdFromDatabase.mockResolvedValueOnce({
      id: 'post-@#$%',
      title: 'Special Post',
      body: 'Body',
      userId: 'user-1',
    });

    const request = new NextRequest(
      new URL('http://localhost:3000/api/posts?id=post-@%23$%25')
    );
    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.OK);
  });
});
