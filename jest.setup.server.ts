// Mock next-auth for all server-side tests
jest.mock('next-auth', () => ({
  __esModule: true,
  getServerSession: jest.fn(),
}));

// Mock next-auth/next as well (if used)
jest.mock('next-auth/next', () => ({
  __esModule: true,
  getServerSession: jest.fn(),
}));

// Mock data functions globally
jest.mock('@/app/lib/data/mock-data', () => ({
  __esModule: true,
  getPostsFromDatabase: jest.fn(),
  getPostByIdFromDatabase: jest.fn(),
  deletePostFromDatabase: jest.fn(),
  updatePostInDatabase: jest.fn(),
  addPostToDatabase: jest.fn(),
}));
