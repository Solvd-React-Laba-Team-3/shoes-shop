import { Header } from '@/components/common/Header';
import { Sidebar } from '@/components/common/Sidebar';
import { authOptions } from '@/constants/authConfig';
import Box from '@mui/material/Box';
import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const headersList = await headers();
  headersList.forEach(console.log);

  const pathname = headersList.get('x-pathname') || '';

  if (!session) redirect('/auth/sign-in?next=' + pathname);

  return (
    <>
      <Header />
      <Box
        sx={{
          display: { md: 'grid', xs: 'flex' },
          gridTemplateColumns: '300px 1fr',
        }}
        component="main"
      >
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Sidebar />
        </Box>
        <Box
          sx={{
            padding: {
              md: '32px 24px',
              lg: '38px 53px',
              xs: '12px 16px',
              sm: '12px 24px',
            },
            width: '100%',
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
}
