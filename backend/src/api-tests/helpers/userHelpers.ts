import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface TestUser {
  id: string;
  email: string;
  username: string;
  password: string;
}

interface CreateTestUserOptions {
  email?: string;
  username?: string;
  password?: string;
  role?: string;
  verified?: boolean;
}

/**
 * Creates a test user in the database with optional custom properties
 * @param options - Optional configuration for the test user
 * @returns The created test user object
 */
export async function createTestUser(
  options: CreateTestUserOptions = {}
): Promise<TestUser> {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(7);
  
  const email = options.email || `test-${timestamp}-${randomSuffix}@example.com`;
  const username = options.username || `testuser-${timestamp}-${randomSuffix}`;
  const password = options.password || 'TestPassword123!';
  const role = options.role || 'user';
  const verified = options.verified !== undefined ? options.verified : true;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      role,
      emailVerified: verified,
    },
  });

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    password, // Return the plain text password for testing purposes
  };
}

/**
 * Generates an authentication token for a test user
 * @param userId - The ID of the user
 * @param options - Optional JWT options
 * @returns JWT authentication token
 */
export function getAuthToken(
  userId: string,
  options: { expiresIn?: string; role?: string } = {}
): string {
  const secret = process.env.JWT_SECRET || 'test-secret-key';
  const expiresIn = options.expiresIn || '1h';
  
  const payload = {
    userId,
    role: options.role || 'user',
  };

  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * Cleans up a test user from the database
 * @param userId - The ID of the user to delete
 */
export async function cleanupTestUser(userId: string): Promise<void> {
  try {
    // Delete related data first (adjust based on your schema)
    await prisma.session.deleteMany({
      where: { userId },
    });

    await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    // Delete the user
    await prisma.user.delete({
      where: { id: userId },
    });
  } catch (error) {
    console.error(`Failed to cleanup test user ${userId}:`, error);
    // Don't throw to prevent test failures during cleanup
  }
}

/**
 * Cleans up multiple test users from the database
 * @param userIds - Array of user IDs to delete
 */
export async function cleanupTestUsers(userIds: string[]): Promise<void> {
  await Promise.all(userIds.map(id => cleanupTestUser(id)));
}

/**
 * Creates a test user and returns both user data and auth token
 * @param options - Optional configuration for the test user
 * @returns Object containing user data and auth token
 */
export async function createAuthenticatedTestUser(
  options: CreateTestUserOptions = {}
) {
  const user = await createTestUser(options);
  const token = getAuthToken(user.id, { role: options.role });

  return {
    user,
    token,
    authHeader: `Bearer ${token}`,
  };
}

/**
 * Finds a user by email
 * @param email - The email address to search for
 * @returns The user object or null if not found
 */
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

/**
 * Finds a user by username
 * @param username - The username to search for
 * @returns The user object or null if not found
 */
export async function findUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
  });
}

/**
 * Updates a test user's properties
 * @param userId - The ID of the user to update
 * @param data - The data to update
 */
export async function updateTestUser(userId: string, data: any) {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
}

/**
 * Cleanup function to be used in afterEach/afterAll hooks
 * Removes all test users created during tests
 */
export async function cleanupAllTestUsers(): Promise<void> {
  try {
    await prisma.user.deleteMany({
      where: {
        OR: [
          { email: { contains: 'test-' } },
          { username: { contains: 'testuser-' } },
        ],
      },
    });
  } catch (error) {
    console.error('Failed to cleanup all test users:', error);
  }
}

/**
 * Closes the Prisma client connection
 * Should be called after all tests complete
 */
export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}
