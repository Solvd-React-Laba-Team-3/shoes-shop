'use client';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { StyledContainer, StyledMessageWrapper } from './aihelper.styles';
import { Button } from '@/components/ui';

interface Chat {
  message: string;
  sender: 'user' | 'ai';
}

export const AIHelper = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [chat, setChat] = useState<Chat[]>([
    {
      message: 'Hello, how can I help you today?',
      sender: 'ai',
    },
  ]);

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSend = () => {
    setChat([...chat, { message: prompt, sender: 'user' }]);
    setPrompt('');
  };

  return (
    <StyledContainer elevation={3} collapsed={isCollapsed}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 16px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          <Avatar src="/ai-helper-avatar.png" />
          <Typography variant="h6">Shoozie Helper</Typography>
        </Box>
        <IconButton onClick={toggleCollapsed}>
          {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </IconButton>
      </Box>
      {!isCollapsed && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              padding: '16px',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              height: '280px',
              overflowY: 'auto',
            }}
          >
            {chat.map((item) => (
              <StyledMessageWrapper key={item.message} sender={item.sender}>
                <Typography variant="body2">{item.message}</Typography>
              </StyledMessageWrapper>
            ))}
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'end',
              padding: '0px 16px',
              gap: '20px',
            }}
          >
            <TextareaAutosize
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your prompt here..."
              minRows={4}
              maxRows={4}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                resize: 'none',
              }}
            />
            <Button
              size="small"
              onClick={handleSend}
              disabled={!prompt.trim()}
              endIcon={<SendOutlinedIcon />}
            >
              Send
            </Button>
          </Box>
        </Box>
      )}
    </StyledContainer>
  );
};
