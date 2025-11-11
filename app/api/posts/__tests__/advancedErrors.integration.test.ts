import { GET } from '../route';
import { NextRequest } from 'next/server';
import { HTTP_STATUS } from '@/app/lib/constants';
import {
  setupAuthenticatedSession,
  mockGetPostsFromDatabase,
  mockGetPostByIdFromDatabase,
} from './setup';

describe('GET /api/posts - Integration Scenarios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupAuthenticatedSession();
  });

  describe('Multiple Sequential Requests', () => {
    test('handles sequential successful requests', async () => {
      const mockPosts = [
        {
          id: 'post-1',
          title: 'Post 1',
          body: 'Body 1',
          userId: 'user-1',
        },
      ];

      // First request succeeds
      setupAuthenticatedSession();
      mockGetPostsFromDatabase.mockResolvedValueOnce(mockPosts as any);
      let request = new NextRequest(new URL('http://localhost:3000/api/posts'));
      let response = await GET(request);
      expect(response.status).toBe(HTTP_STATUS.OK);

      // Second request succeeds
      setupAuthenticatedSession();
      mockGetPostsFromDatabase.mockResolvedValueOnce(mockPosts as any);
      request = new NextRequest(new URL('http://localhost:3000/api/posts'));
      response = await GET(request);
      expect(response.status).toBe(HTTP_STATUS.OK);
    });

    test('recovers from error on subsequent successful request', async () => {
      // First request fails
      setupAuthenticatedSession();
      mockGetPostsFromDatabase.mockRejectedValueOnce(
        new Error('Network timeout')
      );
      let request = new NextRequest(new URL('http://localhost:3000/api/posts'));
      let response = await GET(request);
      expect(response.status).toBe(HTTP_STATUS.SERVER_ERROR);

      // Second request succeeds (recovery)
      setupAuthenticatedSession();
      mockGetPostsFromDatabase.mockResolvedValueOnce([
        {
          id: 'post-1',
          title: 'Post 1',
          body: 'Body 1',
          userId: 'user-1',
        },
      ] as any);
      request = new NextRequest(new URL('http://localhost:3000/api/posts'));
      response = await GET(request);
      expect(response.status).toBe(HTTP_STATUS.OK);
      const data = await response.json();
      expect(data[0].id).toBe('post-1');
    });
  });

  describe('Single Post Retrieval Errors', () => {
    test('handles single post fetch with network error', async () => {
      setupAuthenticatedSession();
      mockGetPostByIdFromDatabase.mockRejectedValueOnce(
        new Error('ECONNRESET: Connection reset by peer')
      );

      const request = new NextRequest(
        new URL('http://localhost:3000/api/posts?id=post-1')
      );
      const response = await GET(request);

      expect(response.status).toBe(HTTP_STATUS.SERVER_ERROR);
    });

    test('handles mixed success and failure for post retrieval', async () => {
      mockGetPostByIdFromDatabase
        .mockResolvedValueOnce({
          id: 'post-1',
          title: 'Post 1',
          body: 'Body 1',
          userId: 'user-1',
        })
        .mockRejectedValueOnce(new Error('Database error'))
        .mockResolvedValueOnce({
          id: 'post-3',
          title: 'Post 3',
          body: 'Body 3',
          userId: 'user-1',
        });

      // First request - success
      setupAuthenticatedSession();
      const request1 = new NextRequest(
        new URL('http://localhost:3000/api/posts?id=post-1')
      );
      const response1 = await GET(request1);
      expect(response1.status).toBe(HTTP_STATUS.OK);

      // Second request - error
      setupAuthenticatedSession();
      const request2 = new NextRequest(
        new URL('http://localhost:3000/api/posts?id=post-2')
      );
      const response2 = await GET(request2);
      expect(response2.status).toBe(HTTP_STATUS.SERVER_ERROR);

      // Third request - success
      setupAuthenticatedSession();
      const request3 = new NextRequest(
        new URL('http://localhost:3000/api/posts?id=post-3')
      );
      const response3 = await GET(request3);
      expect(response3.status).toBe(HTTP_STATUS.OK);
    });
  });
});
