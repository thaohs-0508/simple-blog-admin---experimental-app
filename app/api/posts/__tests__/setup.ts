// Import mocks (declared in jest.setup.server.ts)
import { getServerSession } from 'next-auth';
import {
  getPostsFromDatabase,
  getPostByIdFromDatabase,
} from '@/app/lib/data/mock-data';

export const mockGetServerSession = getServerSession as jest.Mock;
export const mockGetPostsFromDatabase = getPostsFromDatabase as jest.Mock;
export const mockGetPostByIdFromDatabase = getPostByIdFromDatabase as jest.Mock;

// Get the fetch mock - it's set up in jest.setup.server.ts
export function getMockFetch(): jest.Mock {
  return global.fetch as jest.Mock;
}

/**
 * Setup mocks for a valid authenticated session
 */
export const setupAuthenticatedSession = (): void => {
  mockGetServerSession.mockResolvedValueOnce({
    user: { id: 'user-1', name: 'Test User', email: 'test@example.com' },
  });
};

/**
 * Setup mocks for an unauthenticated session
 */
export const setupUnauthenticatedSession = (): void => {
  mockGetServerSession.mockResolvedValueOnce(null);
};

/**
 * Common test utilities
 */
export const testUtils = {
  createMockPost: (overrides = {}) => ({
    id: 'post-1',
    title: 'Test Post',
    body: 'Test Body',
    userId: 'user-1',
    ...overrides,
  }),

  createMockPosts: (count: number = 2) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `post-${i + 1}`,
      title: `Test Post ${i + 1}`,
      body: `Test Body ${i + 1}`,
      userId: 'user-1',
    }));
  },
};
