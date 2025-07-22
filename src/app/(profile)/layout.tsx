import { Header } from '@/components/common/Header';
import { Sidebar } from '@/components/common/Sidebar';
import Box from '@mui/material/Box';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Box
        sx={{ display: 'grid', gridTemplateColumns: '320px 1fr' }}
        component="main"
      >
        <Sidebar />
        {children}
      </Box>
    </>
  );
}
