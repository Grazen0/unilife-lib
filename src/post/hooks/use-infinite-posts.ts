import { useApiClient } from '@/api/hooks/use-api-client';
import { Api } from '@/api/util/client';
import { ZodiosQueryParamsByAlias } from '@zodios/core';
import { useEffect, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import { PostPageSchema } from '../schemas/post';

export interface UsePostsOptions {
  queries?: ZodiosQueryParamsByAlias<Api, 'getPosts'>;
}

export const useInfinitePosts = ({ queries }: UsePostsOptions) => {
  const { apiClient } = useApiClient();

  const [finished, setFinished] = useState(false);

  const getKey = (
    pageIndex: number,
    previousPage: PostPageSchema | null,
  ): [string, number] | null => {
    if (previousPage && previousPage.content.length === 0) {
      setFinished(true);
      return null;
    }

    return ['posts', pageIndex];
  };

  const {
    data = [],
    isLoading,
    isValidating,
    setSize,
    mutate,
  } = useSWRInfinite(getKey, ([, page]) =>
    apiClient.getPosts({ queries: { ...queries, page } }),
  );

  useEffect(() => {
    setFinished(false);
    mutate(undefined, { revalidate: true });
  }, [queries, setSize, mutate]);

  const fetchMore = () => {
    if (!isLoading && !isValidating && !finished) {
      setSize((prevSize) => prevSize + 1);
    }
  };

  const posts = data.flatMap((page) => page.content);
  return { pages: data, posts, finished, fetchMore };
};
