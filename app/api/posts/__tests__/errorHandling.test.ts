import { GET } from '../route';
import { NextRequest } from 'next/server';
import { HTTP_STATUS } from '@/app/lib/constants';
import {
  setupAuthenticatedSession,
  mockGetPostsFromDatabase,
  mockGetPostByIdFromDatabase,
} from './setup';

describe('GET /api/posts - Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupAuthenticatedSession();
  });

  test('returns 500 Server Error when database fails fetching all posts', async () => {
    mockGetPostsFromDatabase.mockRejectedValueOnce(
      new Error('Database connection failed')
    );

    const request = new NextRequest(new URL('http://localhost:3000/api/posts'));
    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.SERVER_ERROR);
    const data = await response.json();
    expect(data).toEqual({ error: 'Failed to fetch posts' });
  });

  test('returns 500 Server Error when database fails fetching single post', async () => {
    mockGetPostByIdFromDatabase.mockRejectedValueOnce(
      new Error('Database error')
    );

    const request = new NextRequest(
      new URL('http://localhost:3000/api/posts?id=post-1')
    );
    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.SERVER_ERROR);
    const data = await response.json();
    expect(data).toEqual({ error: 'Failed to fetch posts' });
  });

  test('handles timeout errors gracefully', async () => {
    mockGetPostsFromDatabase.mockRejectedValueOnce(
      new Error('Request timeout')
    );

    const request = new NextRequest(new URL('http://localhost:3000/api/posts'));
    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.SERVER_ERROR);
    const data = await response.json();
    expect(data).toEqual({ error: 'Failed to fetch posts' });
  });

  test('handles network errors gracefully', async () => {
    mockGetPostsFromDatabase.mockRejectedValueOnce(
      new Error('Network connection lost')
    );

    const request = new NextRequest(new URL('http://localhost:3000/api/posts'));
    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.SERVER_ERROR);
  });

  test('handles unexpected errors gracefully', async () => {
    mockGetPostsFromDatabase.mockRejectedValueOnce(new Error('Unknown error'));

    const request = new NextRequest(new URL('http://localhost:3000/api/posts'));
    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.SERVER_ERROR);
    const data = await response.json();
    expect(data.error).toBeDefined();
  });

  test('returns proper error structure in response', async () => {
    mockGetPostsFromDatabase.mockRejectedValueOnce(new Error('Test error'));

    const request = new NextRequest(new URL('http://localhost:3000/api/posts'));
    const response = await GET(request);

    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(typeof data.error).toBe('string');
  });
});
