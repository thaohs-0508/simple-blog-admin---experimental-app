'use server';

import { createUser } from '@/app/lib/services/userService';
import { registerState } from '@/app/lib/type/actionType';
import bcrypt from 'bcryptjs';
import z from 'zod';

const RegisterSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('email is not valid'),
    password: z.string().min(6, 'password is too short'),
    confirmPassword: z.string().min(6, 'confirm password is too short'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export async function registerAction(
  prevState: registerState,
  formData: FormData
): Promise<registerState> {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  };
  const validationResult = RegisterSchema.safeParse(rawData);

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
      message: 'Validation failed',
    };
  }

  try {
    const { name, email, password } = validationResult.data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const res = await createUser(name, email, hashedPassword);

    if (!res) {
      return {
        message: 'Registration failed',
        errors: {},
      };
    }

    return {
      message: '',
      errors: {},
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Xử lý lỗi email trùng
    if (
      errorMessage.includes('Unique constraint failed') ||
      errorMessage.includes('email')
    ) {
      return {
        message: '',
        errors: {
          email: ['Email already exists'],
        },
      };
    }

    return {
      message: errorMessage,
      errors: {},
    };
  }
}
