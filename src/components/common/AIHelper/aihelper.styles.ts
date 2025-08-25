import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

export const StyledContainer = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'collapsed',
})<{ collapsed: boolean }>(({ theme, collapsed }) => ({
  position: 'fixed',
  bottom: 10,
  zIndex: 700,
  padding: collapsed ? '0' : '14px 0px',
  width: collapsed ? 'auto' : '70%',
  height: collapsed ? 'auto' : '500px',
  borderRadius: collapsed ? '50%' : '16px',
  right: 10,
  [theme.breakpoints.up('sm')]: {
    width: '420px',
    padding: `14px 0px`,
    transition: 'height 0.2s ease-in-out',
    borderRadius: '16px',
  },
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '12px',
  backgroundColor: '#fff',
}));

export const StyledChatContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '10px',
  border: `1px solid ${theme.palette.divider}`,
  height: '300px',
  overflowY: 'auto',
}));

export const StyledMessageWrapper = styled(Box)<{ sender: 'user' | 'model' }>(
  ({ theme, sender }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
    borderRadius: '16px',
    borderBottomRightRadius: sender === 'user' ? '4px' : '16px',
    borderBottomLeftRadius: sender === 'user' ? '16px' : '4px',
    padding: '12px 16px',
    backgroundColor:
      sender === 'user' ? theme.palette.primary.main : theme.palette.grey[200],
    color: sender === 'user' ? '#fff' : '#000',
    maxWidth: '70%',
    marginLeft: sender === 'user' ? 'auto' : '16px',
    marginRight: sender === 'user' ? '16px' : 'auto',
    textAlign: sender === 'user' ? 'left' : 'left',
    height: 'fit-content',
    ...theme.typography.caption,

    '& ul': {
      paddingLeft: '10px',
    },
  })
);
