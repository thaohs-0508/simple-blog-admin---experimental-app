import prisma from '../prisma';

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error(`Error fetching user with email ${email}:`, error);
    throw new Error('Failed to fetch user');
  }
};

export const createUser = async (
  name: string,
  email: string,
  hashedPassword: string,
  role: string = 'user'
) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
};
