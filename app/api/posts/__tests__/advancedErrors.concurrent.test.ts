import { GET } from '../route';
import { NextRequest } from 'next/server';
import { HTTP_STATUS } from '@/app/lib/constants';
import {
  setupAuthenticatedSession,
  mockGetPostsFromDatabase,
  mockGetPostByIdFromDatabase,
} from './setup';

describe('GET /api/posts - Concurrent Requests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupAuthenticatedSession();
  });

  test('handles sequential requests for different posts', async () => {
    const post1 = {
      id: 'post-1',
      title: 'Post 1',
      body: 'Content 1',
      userId: 'user-1',
    };
    const post2 = {
      id: 'post-2',
      title: 'Post 2',
      body: 'Content 2',
      userId: 'user-1',
    };

    // Setup mocks for sequential requests
    mockGetPostByIdFromDatabase
      .mockResolvedValueOnce(post1 as any)
      .mockResolvedValueOnce(post2 as any);

    // First request for post 1
    setupAuthenticatedSession();
    let request = new NextRequest(
      new URL('http://localhost:3000/api/posts?id=post-1')
    );
    let response = await GET(request);
    expect(response.status).toBe(HTTP_STATUS.OK);

    // Second request for post 2
    setupAuthenticatedSession();
    request = new NextRequest(
      new URL('http://localhost:3000/api/posts?id=post-2')
    );
    response = await GET(request);
    expect(response.status).toBe(HTTP_STATUS.OK);

    // Verify each mock was called correctly
    expect(mockGetPostByIdFromDatabase).toHaveBeenCalledTimes(2);
  });

  test('handles sequential requests when one fails', async () => {
    const post1 = {
      id: 'post-1',
      title: 'Post 1',
      body: 'Content 1',
      userId: 'user-1',
    };

    // Setup: first succeeds, second fails
    mockGetPostByIdFromDatabase
      .mockResolvedValueOnce(post1 as any)
      .mockRejectedValueOnce(new Error('Post not found'));

    // First request succeeds
    setupAuthenticatedSession();
    let request = new NextRequest(
      new URL('http://localhost:3000/api/posts?id=post-1')
    );
    let response = await GET(request);
    expect(response.status).toBe(HTTP_STATUS.OK);

    // Second request fails
    setupAuthenticatedSession();
    request = new NextRequest(
      new URL('http://localhost:3000/api/posts?id=invalid')
    );
    response = await GET(request);
    expect(response.status).toBe(HTTP_STATUS.SERVER_ERROR);

    expect(mockGetPostByIdFromDatabase).toHaveBeenCalledTimes(2);
  });
});
