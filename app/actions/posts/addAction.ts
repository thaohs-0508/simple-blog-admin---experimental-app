'use server';

import { revalidatePath } from 'next/cache';
import { addPost } from '@/app/lib/services/postService';
import { UpdateAndAddState } from '@/app/lib/type/actionType';
import z from 'zod';

const AddPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
  userId: z.string().optional(),
});
export async function addAction(
  prevState: UpdateAndAddState,
  formData: FormData
): Promise<UpdateAndAddState> {
  const rawData = {
    title: formData.get('title'),
    body: formData.get('body'),
    userId: formData.get('userId'),
  };
  const validationResult = AddPostSchema.safeParse(rawData);

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
      message: 'Validation failed',
    };
  }
  try {
    const { title, body, userId } = validationResult.data;
    await addPost(title, body, String(userId));

    revalidatePath('/dashboard', 'layout');

    return {
      message: '',
      errors: {},
    };
  } catch (error) {
    const getErrorMessage =
      error instanceof Error ? error.message : String(error);
    console.error('Database Error:', { getErrorMessage, error });
    return {
      message: 'An error occurred while adding the post',
      errors: {},
    };
  }
}
