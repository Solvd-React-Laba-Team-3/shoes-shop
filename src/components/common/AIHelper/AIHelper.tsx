'use client';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useState, useRef, useEffect } from 'react';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';
import {
  StyledChatContainer,
  StyledContainer,
  StyledMessageWrapper,
} from './aihelper.styles';
import { Link } from '@/components/ui';
import ReactMarkdown from 'react-markdown';
import { useAIHelperChat } from '@/lib/hooks';
import { MessageFallback } from '../MessageFallback';

export const AIHelper = () => {
  const { history, isCollapsed, sendMessage, isPending, toggleCollapsed } =
    useAIHelperChat();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollChatToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  };

  useEffect(() => {
    if (!isLoading) {
      scrollChatToBottom();
    }
  }, [history, isLoading]);

  useEffect(() => {
    if (!isCollapsed && !isLoading) {
      scrollChatToBottom();
    }
  }, [isCollapsed, isLoading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = () => {
    sendMessage(prompt);
    setPrompt('');
  };

  return (
    <StyledContainer elevation={3} collapsed={isCollapsed || isLoading}>
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
          <StyledChatContainer ref={chatContainerRef}>
            {history.map((message) => (
              <StyledMessageWrapper
                key={message.content}
                sender={message.sender}
              >
                <ReactMarkdown
                  components={{
                    a({ href, children }) {
                      return (
                        <Link href={href} active>
                          {children}
                        </Link>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </StyledMessageWrapper>
            ))}
            {isPending && <MessageFallback align="left" />}
          </StyledChatContainer>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'end',
              padding: '0px 16px',
            }}
          >
            <TextareaAutosize
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  handleSend();
                }
              }}
              placeholder="Type your prompt here..."
              minRows={4}
              maxRows={4}
              spellCheck={false}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                resize: 'none',
              }}
            />
            <IconButton
              onClick={handleSend}
              disabled={!prompt.trim() || isLoading}
              sx={{
                '&.Mui-disabled': {
                  color: (theme) => theme.palette.grey[500],
                },
              }}
            >
              {isPending ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <SendIcon />
              )}
            </IconButton>
          </Box>
        </Box>
      )}
    </StyledContainer>
  );
};
