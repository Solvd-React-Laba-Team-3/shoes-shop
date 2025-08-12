import { Header } from '@/components/common/Header';
import { Sidebar } from '@/components/common/Sidebar';
import { authOptions } from '@/constants/authConfig';
import Box from '@mui/material/Box';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/sign-in');

  return (
    <>
      <Header />
      <Box
        sx={{
          display: { md: 'grid', xs: 'flex' },
          gridTemplateColumns: '320px 1fr',
        }}
        component="main"
      >
        <Sidebar />
        <Box
          sx={{ padding: { md: '38px 53px', xs: '12px 20px' }, width: '100%' }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
}
