import { useMutation } from '@tanstack/react-query';
import { fetchApi } from '@/lib/utils';
import { User } from '@/types/User';
import { useSession } from 'next-auth/react';

export type UpdateProfileRequest = {
  body: Partial<Omit<User, 'products' | 'avatar'>> & {
    avatar?: number | null;
  };
  token: string;
  id: number;
};

const updateProfile = async ({
  body,
  token,
  id,
}: UpdateProfileRequest): Promise<User> =>
  await fetchApi<User>({
    endpoint: `/users/${id}`,
    method: 'PUT',
    body,
    token,
  });

export const useUpdateProfile = () => {
  const { update: updateSession } = useSession();

  return useMutation<User, Error, UpdateProfileRequest>({
    mutationFn: updateProfile,
    onSuccess: updateSession,
    onError: (error) => {
      console.error('Profile update failed:', error.message);
    },
  });
};
