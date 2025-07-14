import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button } from '@/components/ui/Button';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import { IconButton } from '@/components/ui/IconButton';

export default function Home() {
  return (
    <>
      <Typography variant="h3" color="textPrimary">
        Shoes Shop - Team 3
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
        }}
      >
        <Button variant="contained" color="primary" size="small">
          Click me
        </Button>
        <IconButton sx={{ backgroundColor: 'grey.200' }}>
          <AccessAlarmIcon />
        </IconButton>
      </Box>
    </>
  );
}
