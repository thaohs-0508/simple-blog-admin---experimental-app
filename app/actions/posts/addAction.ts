'use server';
import { addPostToDatabase } from '@/app/lib/data/mock-data';
import { UpdateAndAddState } from '@/app/lib/type/actionType';
import z from 'zod';

const AddPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
});
export async function addAction(
  prevState: UpdateAndAddState,
  formData: FormData
) {
  const rawData = {
    title: formData.get('title'),
    body: formData.get('body'),
  };
  const validationResult = AddPostSchema.safeParse(rawData);

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
      message: 'Validation failed',
    };
  }
  try {
    const { title, body } = validationResult.data;
    await addPostToDatabase({
      title,
      body,
    });
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
