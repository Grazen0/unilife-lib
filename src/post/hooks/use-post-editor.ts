import { useApiClient } from '@/api/hooks/use-api-client';
import { usePendingCallback } from '@/common/hooks/use-pending';
import { pick } from '@/common/util/object';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PostSchema } from '../schemas/post';
import { UpdatePostSchema } from '../schemas/update-post';

export const FormSchema = UpdatePostSchema;
export type FormSchema = z.infer<typeof FormSchema>;

interface UsePostEditorOptions {
  post: PostSchema;
  callback: () => void;
}

export const usePostEditor = ({ post, callback }: UsePostEditorOptions) => {
  const { apiClient } = useApiClient();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: pick(post, 'content', 'tags'),
  });

  const [pending, handleSubmit] = usePendingCallback(
    async (data: FormSchema) => {
      await apiClient.updatePost(data, { params: { id: post.id } });
      callback();
    },
    [callback, apiClient],
  );

  const tags = form.watch('tags');
  const setTags = (tags: string[]) => form.setValue('tags', tags);

  return { form, pending, handleSubmit, tags, setTags };
};
