'use server';

import { revalidatePath } from 'next/cache';
import z from 'zod';
import { UpdateAndAddState } from '../../lib/type/actionType';
import { updatePost } from '@/app/lib/services/postService';

const UpdatePostSchema = z.object({
  id: z.string().min(1, 'Post ID is required'),
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
});

export async function updatePostAction(
  prevState: UpdateAndAddState,
  formData: FormData
): Promise<UpdateAndAddState> {
  const rawData = {
    id: formData.get('id') as string,
    title: formData.get('title'),
    body: formData.get('body'),
  };
  const validationResult = UpdatePostSchema.safeParse(rawData);

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
      message: 'Validation failed',
    };
  }
  try {
    const { id, title, body } = validationResult.data;
    await updatePost(id, { title, body });

    // Revalidate the posts list and detail page
    revalidatePath('/dashboard', 'layout');

    return {
      message: '',
      errors: {},
    };
  } catch (error) {
    const getErrorMessage =
      error instanceof Error ? error.message : String(error);
    console.error('Database Error:', {
      getErrorMessage,
      postId: rawData.id,
      error,
    });
    return {
      message: 'An error occurred while updating the post',
      errors: {},
    };
  }
}
