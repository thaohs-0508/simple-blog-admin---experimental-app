import { GET } from '../route';
import { NextRequest } from 'next/server';
import { HTTP_STATUS } from '@/app/lib/constants';
import { setupAuthenticatedSession, mockGetPostsFromDatabase } from './setup';

describe('GET /api/posts - Network Errors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupAuthenticatedSession();
  });

  test('handles network timeout gracefully (ECONNRESET)', async () => {
    mockGetPostsFromDatabase.mockRejectedValueOnce(
      new Error('ECONNRESET: Connection reset by peer')
    );

    const request = new NextRequest(new URL('http://localhost:3000/api/posts'));
    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.SERVER_ERROR);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Failed to fetch posts');
  });

  test('handles connection refused (ECONNREFUSED)', async () => {
    mockGetPostsFromDatabase.mockRejectedValueOnce(
      new Error('ECONNREFUSED: Connection refused')
    );

    const request = new NextRequest(new URL('http://localhost:3000/api/posts'));
    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.SERVER_ERROR);
    const data = await response.json();
    expect(data.error).toBe('Failed to fetch posts');
  });

  test('handles network unreachable (ENETUNREACH)', async () => {
    mockGetPostsFromDatabase.mockRejectedValueOnce(
      new Error('ENETUNREACH: Network is unreachable')
    );

    const request = new NextRequest(new URL('http://localhost:3000/api/posts'));
    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.SERVER_ERROR);
  });

  test('handles DNS resolution failure (ENOTFOUND)', async () => {
    mockGetPostsFromDatabase.mockRejectedValueOnce(
      new Error('ENOTFOUND: getaddrinfo ENOTFOUND localhost')
    );

    const request = new NextRequest(new URL('http://localhost:3000/api/posts'));
    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.SERVER_ERROR);
  });
});
