'use client';

import { useForm } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { settingsSchema, SettingsSchema } from './settings.schema';
import { Avatar, Box, FormLabel } from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import { Button, LabeledTextfield } from '@/components/ui';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { LoaderButton } from '@/components/LoaderButton';
import { useEffect, useRef, useState } from 'react';
import { useUpdateProfile } from '@/api/profile/useUpdateProfile';
import { useUploadFile } from '@/api/uploadFile/useUploadFile';
import { PHONE_REGEX } from '@/constants/phoneRegex';
import { useChangePassword } from '@/api/profile/useChangePassword';

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

  const onSubmit = async (data: SettingsSchema) => {
    if (!session?.user) return;

    if (file) {
      uploadFile(file, {
        onSuccess: ([{ id: avatarId }]) => {
          updateProfile({
            body: {
              username: data.username,
              email: data.email,
              phoneNumber: data.phoneNumber,
              avatar: avatarId,
            },
            token: session?.user?.accessToken,
            id: session?.user?.id,
          });
        },
      });
    } else {
      updateProfile({
        body: {
          username: data.username,
          email: data.email,
          phoneNumber: data.phoneNumber,
          avatar: avatarUrl === null ? null : undefined,
        },
        token: session?.user?.accessToken,
        id: session?.user?.id,
      });
    }

    if (data.password && data.currentPassword && data.confirmPassword) {
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
    }
  };

  useEffect(() => {
    if (session?.user?.avatar) {
      setAvatarUrl(session.user.avatar.url);
    }
  }, [session?.user?.avatar]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
      <Typography variant="h2">My Profile</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '60px' }}>
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
      {uploadingFileError && (
        <FormLabel
          sx={{
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
          error
        >
          <WarningAmberIcon fontSize="small" />
          {uploadingFileError.message}
        </FormLabel>
      )}
      <Typography variant="caption">
        Welcome back! Please enter your details to log into your account.
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: 'grid',
          gridTemplateColumns: '350px 350px',
          gap: '100px',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <LabeledTextfield
            label="Username"
            placeholder="Jane Meldrum"
            {...register('username')}
            error={!!errors.username}
          />
          {errors.username && (
            <FormLabel
              sx={{
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
              error
            >
              <WarningAmberIcon fontSize="small" /> {errors.username.message}
            </FormLabel>
          )}
          <LabeledTextfield
            label="Email"
            placeholder="example@gmail.com"
            {...register('email')}
            error={!!errors.email}
          />
          {errors.email && (
            <FormLabel
              sx={{
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
              error
            >
              <WarningAmberIcon fontSize="small" /> {errors.email.message}
            </FormLabel>
          )}
          <LabeledTextfield
            label="Phone number"
            placeholder="(949) 354-2574"
            {...register('phoneNumber', {
              pattern: PHONE_REGEX,
            })}
            error={!!errors.phoneNumber}
          />
          {errors.phoneNumber && (
            <FormLabel
              sx={{
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
              error
            >
              <WarningAmberIcon fontSize="small" /> {errors.phoneNumber.message}
            </FormLabel>
          )}
          {updatingProfileError && (
            <FormLabel
              sx={{
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
              error
            >
              <WarningAmberIcon fontSize="small" />
              {updatingProfileError.message}
            </FormLabel>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <LabeledTextfield
            label="Current password"
            type="password"
            placeholder="********"
            {...register('currentPassword')}
            error={!!errors.currentPassword}
          />
          {errors.currentPassword && (
            <FormLabel
              sx={{
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
              error
            >
              <WarningAmberIcon fontSize="small" />
              {errors.currentPassword.message}
            </FormLabel>
          )}
          <LabeledTextfield
            label="New password"
            placeholder="********"
            type="password"
            {...register('password')}
            error={!!errors.password}
          />
          {errors.password && (
            <FormLabel
              sx={{
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
              error
            >
              <WarningAmberIcon fontSize="small" /> {errors.password.message}
            </FormLabel>
          )}
          <LabeledTextfield
            label="Confirm password"
            placeholder="********"
            type="password"
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <FormLabel
              sx={{
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
              error
            >
              <WarningAmberIcon fontSize="small" />
              {errors.confirmPassword.message}
            </FormLabel>
          )}
          {changingPasswordError && (
            <FormLabel
              sx={{
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
              error
            >
              <WarningAmberIcon fontSize="small" />
              {changingPasswordError.message}
            </FormLabel>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <LoaderButton
              isSubmitting={
                isUpdatingProfile || isUploadingFile || isChangingPassword
              }
              text="Save changes"
              loadingText="Saving..."
              size="small"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
