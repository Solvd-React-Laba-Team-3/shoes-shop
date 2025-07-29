import {
  Box,
  ButtonGroup,
  Skeleton,
  Stack,
  Typography,
  Button,
} from '@mui/material';

const Cart = () => {
  return (
    <>
      <Box>
        <Box>
          <Typography variant="h2" sx={{ marginBottom: '57px' }}>
            Cart
          </Typography>

          <Stack direction="row" spacing={6} alignItems="flex-start">
            <Skeleton variant="rectangular" width={223} height={214} />

            <Box sx={{ maxWidth: '245px', flexGrow: 1 }}>
              <Skeleton
                variant="text"
                sx={{ fontSize: '30px', fontWeight: 500 }}
              />
              <Skeleton
                variant="text"
                sx={{ fontSize: '20px', fontWeight: 500 }}
              />
              <Skeleton
                variant="text"
                sx={{ fontSize: '25px', fontWeight: 600 }}
              />
            </Box>
          </Stack>
        </Box>

        {/* right part */}
        <Box>
          <Stack spacing={1}>
            <ButtonGroup
              size="small"
              sx={{
                '& .MuiButton-root': {
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',

                  minWidth: 0,
                  padding: 0,
                  border: 'none',
                },
              }}
            >
              <Button sx={{ backgroundColor: '#E8E8E8', color: '#CECECE' }}>
                -
              </Button>
              <Typography sx={{ px: 1, fontWeight: 400 }} variant="h4">
                0
              </Typography>
              <Button sx={{ color: '#FE645E', backgroundColor: '#FFD7D6' }}>
                +
              </Button>
            </ButtonGroup>
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default Cart;
