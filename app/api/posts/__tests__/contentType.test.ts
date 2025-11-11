import { GET } from '../route';
import { NextRequest } from 'next/server';
import { HTTP_STATUS } from '@/app/lib/constants';
import { setupAuthenticatedSession, mockGetPostsFromDatabase } from './setup';

describe('GET /api/posts - Content Type Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupAuthenticatedSession();
  });

  test('accepts request with no Content-Type header', async () => {
    mockGetPostsFromDatabase.mockResolvedValueOnce([]);

    const request = new NextRequest(new URL('http://localhost:3000/api/posts'));
    const response = await GET(request);

    expect(response.status).not.toBe(HTTP_STATUS.BAD_REQUEST);
  });

  test('rejects request with invalid Content-Type header', async () => {
    const request = new NextRequest(
      new URL('http://localhost:3000/api/posts'),
      {
        headers: {
          'Content-Type': 'text/plain',
        },
      }
    );

    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
    const data = await response.json();
    expect(data).toEqual({ error: 'Invalid Content-Type header' });
  });

  test('accepts request with application/json Content-Type', async () => {
    mockGetPostsFromDatabase.mockResolvedValueOnce([]);

    const request = new NextRequest(
      new URL('http://localhost:3000/api/posts'),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.OK);
  });

  test('accepts request with application/json charset', async () => {
    mockGetPostsFromDatabase.mockResolvedValueOnce([]);

    const request = new NextRequest(
      new URL('http://localhost:3000/api/posts'),
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      }
    );

    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.OK);
  });

  test('rejects request with xml Content-Type', async () => {
    const request = new NextRequest(
      new URL('http://localhost:3000/api/posts'),
      {
        headers: {
          'Content-Type': 'application/xml',
        },
      }
    );

    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
  });

  test('rejects request with html Content-Type', async () => {
    const request = new NextRequest(
      new URL('http://localhost:3000/api/posts'),
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );

    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
  });
});
