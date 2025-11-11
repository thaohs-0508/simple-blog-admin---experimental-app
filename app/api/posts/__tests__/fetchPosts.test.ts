import { GET } from '../route';
import { NextRequest } from 'next/server';
import { HTTP_STATUS } from '@/app/lib/constants';
import {
  setupAuthenticatedSession,
  mockGetPostsFromDatabase,
  testUtils,
} from './setup';

describe('GET /api/posts - Fetch All Posts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupAuthenticatedSession();
  });

  test('returns all posts when no postId is provided', async () => {
    const mockPosts = testUtils.createMockPosts(2);
    mockGetPostsFromDatabase.mockResolvedValueOnce(mockPosts);

    const request = new NextRequest(new URL('http://localhost:3000/api/posts'));
    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.OK);
    const data = await response.json();
    expect(data).toEqual(mockPosts);
    expect(data).toHaveLength(2);
  });

  test('returns correct data format for posts', async () => {
    const mockPosts = [
      testUtils.createMockPost({
        id: 'post-123',
        title: 'Test Post',
        image: '/images/test.jpg',
      }),
    ];
    mockGetPostsFromDatabase.mockResolvedValueOnce(mockPosts);

    const request = new NextRequest(new URL('http://localhost:3000/api/posts'));
    const response = await GET(request);

    const data = await response.json();
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('title');
    expect(data[0]).toHaveProperty('body');
    expect(data[0]).toHaveProperty('userId');
  });

  test('returns empty array when no posts exist', async () => {
    mockGetPostsFromDatabase.mockResolvedValueOnce([]);

    const request = new NextRequest(new URL('http://localhost:3000/api/posts'));
    const response = await GET(request);

    const data = await response.json();
    expect(data).toEqual([]);
  });

  test('handles large number of posts efficiently', async () => {
    const mockPosts = testUtils.createMockPosts(100);
    mockGetPostsFromDatabase.mockResolvedValueOnce(mockPosts);

    const request = new NextRequest(new URL('http://localhost:3000/api/posts'));
    const response = await GET(request);

    const data = await response.json();
    expect(data).toHaveLength(100);
  });
});
