import { useApiClient } from '@/api/hooks/use-api-client';
import { usePendingCallback } from '@/common/hooks/use-pending';

interface UseDeleteUniversityOptions {
  universityId: string;
  afterDelete: () => void;
}

export const useDeleteUniversity = ({
  universityId,
  afterDelete,
}: UseDeleteUniversityOptions) => {
  const { apiClient } = useApiClient();

  const [pending, deleteUniversity] = usePendingCallback(async () => {
    await apiClient.removeUniversity(undefined, {
      params: { id: universityId },
    });
    afterDelete();
  }, [apiClient, universityId, afterDelete]);

  return { pending, deleteUniversity };
};
