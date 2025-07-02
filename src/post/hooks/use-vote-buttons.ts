import { useApiClient } from '@/api/hooks/use-api-client';
import { useState } from 'react';

export interface UseVoteButtonsOptions {
  postId: string;
  postScore: number;
  originalVote?: number;
}

export const useVoteButtons = ({
  postId,
  originalVote,
  postScore,
}: UseVoteButtonsOptions) => {
  const { apiClient } = useApiClient();
  const [localCurrentVote, setLocalCurrentVote] = useState(originalVote ?? 0);

  const upvote = async () => {
    if (localCurrentVote === 1) {
      await apiClient.removePostVote(undefined, { params: { id: postId } });
      setLocalCurrentVote(0);
    } else {
      await apiClient.upvotePost(undefined, { params: { id: postId } });
      setLocalCurrentVote(1);
    }
  };

  const downvote = async () => {
    if (localCurrentVote === -1) {
      await apiClient.removePostVote(undefined, { params: { id: postId } });
      setLocalCurrentVote(0);
    } else {
      await apiClient.downvotePost(undefined, { params: { id: postId } });
      setLocalCurrentVote(-1);
    }
  };

  const displayScore = postScore - (originalVote ?? 0) + localCurrentVote;

  return { displayScore, localCurrentVote, upvote, downvote };
};
