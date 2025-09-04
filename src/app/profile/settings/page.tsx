'use client';

import { useForm } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { settingsSchema, SettingsSchema } from './settings.schema';
import { Avatar, Box } from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import { Button, LabeledTextfield } from '@/components/ui';
import { useEffect, useRef, useState } from 'react';
import { useUpdateProfile } from '@/api/profile/useUpdateProfile';
import { useUploadFile } from '@/api/uploadFile/useUploadFile';
import { useChangePassword } from '@/api/profile/useChangePassword';
import { FormErrorMessage } from '@/components/ui';

export default function Settings() {
  const { data: session } = useSession();

  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const {
    mutate: updateProfile,
    isPending: isUpdatingProfile,
    error: updatingProfileError,
  } = useUpdateProfile();
  const {
    mutate: uploadFile,
    isPending: isUploadingFile,
    error: uploadingFileError,
  } = useUploadFile();
  const {
    mutate: changePassword,
    isPending: isChangingPassword,
    error: changingPasswordError,
  } = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsSchema>({
    defaultValues: {
      username: session?.user?.username,
      email: session?.user?.email,
      phoneNumber: session?.user?.phoneNumber || null,
      currentPassword: null,
      password: null,
      confirmPassword: null,
    },
    resolver: zodResolver(settingsSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = (
    data: SettingsSchema,
    token: string,
    id: number,
    avatarId?: number | null
  ) => {
    updateProfile({
      body: {
        username: data.username,
        email: data.email,
        phoneNumber: data.phoneNumber,
        avatar: avatarId,
      },
      token,
      id,
    });
  };

  const handleChangePassword = (data: SettingsSchema) => {
    if (!data.password || !data.currentPassword || !data.confirmPassword)
      return;

    changePassword(
      {
        password: data.password,
        currentPassword: data.currentPassword,
        passwordConfirmation: data.confirmPassword,
      },
      {
        onSuccess: () => {
          signOut({
            redirect: true,
            callbackUrl: '/auth/sign-in',
          });
        },
      }
    );
  };

  const onSubmit = async (data: SettingsSchema) => {
    if (!session?.user) return;

    if (file) {
      uploadFile(file, {
        onSuccess: ([{ id: avatarId }]) => {
          handleUpdateProfile(
            data,
            session?.user?.accessToken,
            session?.user?.id,
            avatarId
          );
        },
      });
    } else {
      const avatar = avatarUrl ? undefined : null;

      handleUpdateProfile(
        data,
        session?.user?.accessToken,
        session?.user?.id,
        avatar
      );
    }

    handleChangePassword(data);
  };

  useEffect(() => {
    if (session?.user?.avatar) {
      setAvatarUrl(session.user.avatar.url);
      setFile(null);
    }
  }, [session?.user?.avatar]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
      <Typography variant="h2" component={'h1'}>
        My Profile
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 0, md: '60px' },
          justifyContent: { xs: 'space-between', md: 'normal' },
        }}
      >
        <Avatar
          src={avatarUrl || ''}
          sx={{
            width: '150px',
            height: '150px',
            border: (theme) => `4px solid ${theme.palette.common.white}`,
          }}
          alt={
            session?.user?.avatar?.alternativeText || session?.user?.username
          }
        />
        <Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => inputRef.current?.click()}
            >
              Change photo
            </Button>
            <input
              type="file"
              ref={inputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept="image/*"
              data-testid="file-input"
            />
            <Button
              variant="contained"
              size="small"
              onClick={() => setAvatarUrl(null)}
            >
              Delete
            </Button>
          </Box>
        </Box>
        <FormErrorMessage message={uploadingFileError?.message} />
      </Box>
      <Typography variant="caption" component={'p'}>
        Welcome back! Please enter your details to log into your account.
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '350px 350px' },
          gap: { md: '100px', xs: '20px' },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <LabeledTextfield
            label="Username"
            placeholder="Jane Meldrum"
            {...register('username')}
            error={!!errors.username}
            errorMessage={errors.username?.message}
          />

          <LabeledTextfield
            label="Email"
            placeholder="example@gmail.com"
            {...register('email')}
            error={!!errors.email}
            errorMessage={errors.email?.message}
          />

          <LabeledTextfield
            label="Phone number"
            placeholder="(949) 354-2574"
            {...register('phoneNumber')}
            error={!!errors.phoneNumber || !!updatingProfileError}
            errorMessage={
              errors.phoneNumber?.message || updatingProfileError?.message
            }
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <LabeledTextfield
            label="Current password"
            type="password"
            placeholder="********"
            {...register('currentPassword')}
            error={!!errors.currentPassword}
            errorMessage={changingPasswordError?.message}
          />

          <LabeledTextfield
            label="New password"
            placeholder="********"
            type="password"
            {...register('password')}
            error={!!errors.password}
            errorMessage={errors.password?.message}
          />

          <LabeledTextfield
            label="Confirm password"
            placeholder="********"
            type="password"
            {...register('confirmPassword')}
            error={!!errors.confirmPassword || !!changingPasswordError}
            errorMessage={
              errors.confirmPassword?.message || changingPasswordError?.message
            }
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              loading={
                isUpdatingProfile || isUploadingFile || isChangingPassword
              }
              type="submit"
              size="small"
            >
              Save changes
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
