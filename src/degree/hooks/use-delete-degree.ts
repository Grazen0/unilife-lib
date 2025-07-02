import { useApiClient } from '@/api/hooks/use-api-client';
import { usePendingCallback } from '@/common/hooks/use-pending';

interface UseDeleteDegreeOptions {
  degreeId: string;
  callback: () => void;
}

export const useDeleteDegree = ({
  degreeId,
  callback,
}: UseDeleteDegreeOptions) => {
  const { apiClient } = useApiClient();

  const [pending, deleteDegree] = usePendingCallback(async () => {
    await apiClient.removeDegree(undefined, { params: { id: degreeId } });
    callback();
  }, [apiClient, degreeId, callback]);

  return { pending, deleteDegree };
};
