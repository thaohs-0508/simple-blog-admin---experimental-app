import { GET } from '../route';
import { NextRequest } from 'next/server';
import { HTTP_STATUS } from '@/app/lib/constants';
import { setupAuthenticatedSession, mockGetPostsFromDatabase } from './setup';

describe('GET /api/posts - Invalid Data Format', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupAuthenticatedSession();
  });

  test('handles malformed JSON response', async () => {
    mockGetPostsFromDatabase.mockRejectedValueOnce(
      new SyntaxError('Unexpected token < in JSON at position 0')
    );

    const request = new NextRequest(new URL('http://localhost:3000/api/posts'));
    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.SERVER_ERROR);
    const data = await response.json();
    expect(data.error).toBe('Failed to fetch posts');
  });

  test('handles truncated data response', async () => {
    mockGetPostsFromDatabase.mockRejectedValueOnce(
      new Error('Unexpected end of JSON input')
    );

    const request = new NextRequest(new URL('http://localhost:3000/api/posts'));
    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.SERVER_ERROR);
  });

  test('handles response with missing required fields', async () => {
    // Verify API handles incomplete post data gracefully
    mockGetPostsFromDatabase.mockResolvedValueOnce([
      { id: '1', title: 'Missing body' }, // body is missing
    ] as any);

    const request = new NextRequest(new URL('http://localhost:3000/api/posts'));
    const response = await GET(request);

    expect(response.status).toBe(HTTP_STATUS.OK);
    const data = await response.json();
    expect(data[0]).not.toHaveProperty('body');
  });
});
