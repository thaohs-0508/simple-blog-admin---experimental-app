'use client';
import { PostModel } from '@/app/lib/data/models/postModel';
import RenderPostFormInput from './PostFormInput';
import { useRouter } from 'next/navigation';
import { DictType } from '@/app/lib/type/dictType';
import toast from 'react-hot-toast';
import { use, useActionState, useEffect, useState } from 'react';
import { updatePostAction } from '@/app/actions/posts/putAction';
import { addAction } from '@/app/actions/posts/addAction';
import { UpdateAndAddState } from '@/app/lib/type/actionType';
import { error } from 'console';
import { useSession } from 'next-auth/react';

interface PostFormProps {
  postId?: string | undefined;
  postCard?: PostModel | undefined;
  dict: DictType;
  locale: string;
}

export default function PostForm({
  postId,
  postCard,
  locale,
  dict,
}: PostFormProps) {
  const router = useRouter();
  const postDict = dict?.dashboard?.posts;
  const session = useSession();
  const [formData, setFormData] = useState({
    title: postCard?.title || '',
    body: postCard?.body || '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const initialState: UpdateAndAddState = {
    message: '',
    errors: {
      title: [],
      body: [],
    },
  };

  const handleAction = async (
    prevState: UpdateAndAddState | undefined,
    formData: FormData
  ): Promise<UpdateAndAddState> => {
    const state = prevState || initialState;
    if (postId) {
      formData.set('id', postId);
      const result = await updatePostAction(state, formData);
      return result || initialState;
    } else {
      const result = await addAction(state, formData);
      return result || initialState;
    }
  };

  const [state, formAction, isPending] = useActionState(
    handleAction,
    initialState
  ) as [UpdateAndAddState, (payload: FormData) => void, boolean];

  const handleFormSubmit = async (fd: FormData) => {
    fd.set('title', formData.title);
    fd.set('body', formData.body);
    formAction(fd);
  };

  useEffect(() => {
    const errorPropNames = Object.getOwnPropertyNames(state.errors || {});
    const hasErrors = errorPropNames.length > 0;

    if (!state.message && (!state.errors || !hasErrors)) {
      if (!postId) {
        toast.success(
          postDict?.successMessages?.createSuccess ||
            'Post created successfully'
        );
        router.push(`/${locale}/dashboard/posts`);
      } else {
        toast.success(
          postDict?.successMessages?.updateSuccess ||
            'Post updated successfully'
        );
        router.push(`/${locale}/dashboard/posts/${postId}`);
      }
    }

    if (state.message && state.errors && hasErrors) {
      toast.error(postDict?.errorsMessages?.updateFailed ?? state.message);
    }
    if (state.message && !state.errors) {
      toast.error(postDict?.errorsMessages?.server_error ?? state.message);
    }
  }, [state, router, postId, locale, postDict]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
            {postId ? postDict?.editPost : postDict?.addNewPost}
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            {postDict?.formDescription}
          </p>
        </div>

        <form
          action={handleFormSubmit}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 space-y-6 dark:bg-gray-800"
        >
          {postId && <input type="hidden" name="id" value={postId} />}
          <RenderPostFormInput
            label={postDict?.formTitle!}
            value={formData.title}
            onChange={handleInputChange}
            name="title"
            required
            errors={state.errors?.title}
          />

          <RenderPostFormInput
            name="userId"
            value={session.data?.user?.id || ''}
            onChange={() => {}}
            type="hidden"
            label={''}
          />

          <RenderPostFormInput
            label={postDict?.formContent!}
            value={formData.body}
            onChange={handleInputChange}
            name="body"
            rows={6}
            required
            errors={state.errors?.body}
          />

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push(`/${locale}/dashboard/posts`)}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition duration-200"
            >
              {postDict?.cancel}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-linear-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending
                ? 'Saving...'
                : postId
                ? postDict?.editPost
                : postDict?.addPost}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
