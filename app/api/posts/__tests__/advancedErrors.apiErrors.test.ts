import { GET } from '../route';
import { NextRequest } from 'next/server';
import { HTTP_STATUS } from '@/app/lib/constants';
import { setupAuthenticatedSession, mockGetPostsFromDatabase } from './setup';

describe('GET /api/posts - API Error Responses', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupAuthenticatedSession();
  });

  test('handles 500 Server Error from API', async () => {
    mockGetPostsFromDatabase.mockRejectedValueOnce(
      new Error('Database connection failed')
    );

    const request = new NextRequest(new URL('http://localhost:3000/api/posts'));
    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.SERVER_ERROR);
    const data = await response.json();
    expect(data.error).toBe('Failed to fetch posts');
  });

  test('handles 503 Service Unavailable from API', async () => {
    mockGetPostsFromDatabase.mockRejectedValueOnce(
      new Error('Service temporarily unavailable')
    );

    const request = new NextRequest(new URL('http://localhost:3000/api/posts'));
    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.SERVER_ERROR);
  });

  test('handles rate limiting (429) from API', async () => {
    // Simulate rate limit error from upstream service
    mockGetPostsFromDatabase.mockRejectedValueOnce(
      new Error('Too many requests')
    );

    const request = new NextRequest(new URL('http://localhost:3000/api/posts'));
    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.SERVER_ERROR);
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });
});
