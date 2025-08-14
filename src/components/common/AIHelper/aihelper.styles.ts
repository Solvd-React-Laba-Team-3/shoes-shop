import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

export const StyledContainer = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'collapsed',
})<{ collapsed: boolean }>(({ collapsed }) => ({
  position: 'fixed',
  bottom: 10,
  right: 10,
  zIndex: 700,
  padding: `14px 0px`,
  width: '420px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  borderRadius: '16px',
  backgroundColor: '#fff',
  height: collapsed ? '65px' : '500px',
  transition: 'height 0.3s ease-in-out',
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

    '& ul': {
      paddingLeft: '10px',
    },
  })
);
