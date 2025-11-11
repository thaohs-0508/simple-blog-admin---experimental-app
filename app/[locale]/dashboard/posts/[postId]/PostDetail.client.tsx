'use client';

import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiEdit, FiTrash2 } from 'react-icons/fi';
import { PostModel } from '@/app/lib/data/models/postModel';
import { useState } from 'react';
import {
  POST_DETAIL_CONTENT,
  REQUEST_TIMEOUT,
  TAILWIND,
} from '@/app/lib/constants';
import toast from 'react-hot-toast';
import { DictType } from '@/app/lib/type/dictType';
import { useNavigationLoading } from '@/app/lib/hooks/useNavigationLoading';
export default function RenderPostDetail({
  postId,
  locale,
  dict,
  post,
}: {
  postId: string;
  locale: string;
  dict: DictType;
  post: PostModel;
}) {
  const [isShowConfirm, setIsShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { push } = useNavigationLoading();
  if (!post) {
    return (
      <div className={TAILWIND.CONTAINER}>
        <div className="text-center text-gray-900 dark:text-white">
          {dict?.dashboard?.posts?.notFound || POST_DETAIL_CONTENT.NOT_FOUND}
        </div>
      </div>
    );
  }

  const handleEdit = (): void => {
    // Sensitive operation: requires re-authentication check
    if (!postId) {
      toast.error(dict?.dashboard?.posts?.invalidId!);
      return;
    }
    // TODO: Implement re-authentication middleware before allowing edit
    push(`/${locale}/dashboard/posts/${postId}/edit`);
  };

  const handleDeleteClick = (): void => {
    // Sensitive operation: requires re-authentication check
    if (!postId) {
      toast.error(dict?.dashboard?.posts?.invalidId!);
      return;
    }
    // TODO: Implement re-authentication middleware before allowing delete
    setIsShowConfirm(true);
  };

  const confirmDelete = async (): Promise<void> => {
    try {
      setIsDeleting(true);
      await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      push(`/${locale}/dashboard/posts`);
    } catch (error) {
      console.error('Failed to delete post', {
        postId,
        locale,
        error: error instanceof Error ? error.message : String(error),
      });
      if (error instanceof DOMException && error.name === 'AbortError') {
        toast.error(
          dict?.dashboard?.posts?.deleteTimeout ||
            POST_DETAIL_CONTENT.REQUEST_TIMEOUT
        );
        return;
      } else {
        toast.error(
          dict?.dashboard?.posts?.deleteFailed ||
            POST_DETAIL_CONTENT.DELETE_FAILED
        );
      }
    } finally {
      setIsShowConfirm(false);
      setIsDeleting(false);
    }
  };

  const handleBack = (): void => {
    push(`/${locale}/dashboard/posts`);
  };

  return (
    <div className={TAILWIND.CONTAINER}>
      <button
        onClick={handleBack}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white rounded-lg font-semibold transition duration-200"
      >
        <FiArrowLeft className={TAILWIND.ICON_SIZE} />
        {dict.common?.back || POST_DETAIL_CONTENT.BACK_TO_POSTS}
      </button>

      <h1 className="text-3xl font-bold mb-6">
        {post.title ||
          dict?.dashboard?.posts?.noTitle ||
          POST_DETAIL_CONTENT.NO_TITLE}
      </h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={handleEdit}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-semibold transition duration-200"
        >
          <FiEdit className={TAILWIND.ICON_SIZE} />
          {dict?.dashboard?.posts?.edit || POST_DETAIL_CONTENT.EDIT}
        </button>
        <button
          onClick={handleDeleteClick}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-lg font-semibold transition duration-200"
        >
          <FiTrash2 className={TAILWIND.ICON_SIZE} />
          {dict?.dashboard?.posts?.delete || POST_DETAIL_CONTENT.DELETE}
        </button>
      </div>

      {isShowConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm">
            <p className="mb-4 text-gray-900 dark:text-white">
              {dict?.dashboard?.posts?.confirmDelete ||
                POST_DETAIL_CONTENT.CONFIRM_DELETE}
            </p>
            <div className="flex gap-4">
              <button
                disabled={isDeleting}
                onClick={confirmDelete}
                className={`flex-1 px-4 py-2 rounded font-semibold transition ${
                  isDeleting
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isDeleting
                  ? POST_DETAIL_CONTENT.DELETING
                  : POST_DETAIL_CONTENT.CONFIRM}
              </button>
              <button
                onClick={() => setIsShowConfirm(false)}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold transition"
              >
                {POST_DETAIL_CONTENT.CANCEL}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-300">
        {post.body ||
          dict?.dashboard?.posts?.noContent ||
          POST_DETAIL_CONTENT.NO_CONTENT}
      </div>
    </div>
  );
}
