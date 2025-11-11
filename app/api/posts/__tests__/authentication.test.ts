import { GET } from '../route';
import { NextRequest } from 'next/server';
import { HTTP_STATUS } from '@/app/lib/constants';
import {
  mockGetServerSession,
  setupAuthenticatedSession,
  setupUnauthenticatedSession,
  mockGetPostsFromDatabase,
} from './setup';

describe('GET /api/posts - Authentication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns 401 Unauthorized when session is not available', async () => {
    setupUnauthenticatedSession();

    const request = new NextRequest(new URL('http://localhost:3000/api/posts'));
    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
    const data = await response.json();
    expect(data).toEqual({ error: 'Unauthorized' });
  });

  test('proceeds with GET request when session exists', async () => {
    setupAuthenticatedSession();
    mockGetPostsFromDatabase.mockResolvedValueOnce([]);

    const request = new NextRequest(new URL('http://localhost:3000/api/posts'));
    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.OK);
  });

  test('verifies getServerSession is called during request', async () => {
    setupAuthenticatedSession();
    mockGetPostsFromDatabase.mockResolvedValueOnce([]);

    const request = new NextRequest(new URL('http://localhost:3000/api/posts'));
    await GET(request);

    expect(mockGetServerSession).toHaveBeenCalled();
  });
});
