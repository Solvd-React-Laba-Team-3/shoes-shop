import { Order as OrderType } from '@/types/Order';
import { Theme, useMediaQuery } from '@mui/material';
import { formatDate } from '@/lib/utils';
import { theme } from '@/providers/ThemeProvider';
import { FC } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Chip, ChipProps } from '@mui/material';
import { Check, Close, InventoryTwoTone, Sync } from '@mui/icons-material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { styled } from '@mui/material/styles';

interface OrderPreviewProps {
  order: OrderType;
}

interface StyledChipProps extends ChipProps {
  statusColor: string;
}

const StyledChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'statusColor',
})<StyledChipProps>(({ theme, statusColor }) => ({
  backgroundColor: 'inherit',
  ...theme.typography.caption,
  color: statusColor,
  textTransform: 'capitalize',
  fontWeight: 500,
  '.MuiChip-label': {
    [theme.breakpoints.down('lg')]: {
      display: 'none',
    },
  },
}));

const getStatus = (status: string, theme: Theme) => {
  switch (status.toLowerCase()) {
    case 'succeeded':
      return {
        label: 'Received',
        color: theme.palette.success.main,
        icon: <Check style={{ color: theme.palette.success.main }} />,
      };
    case 'requires_payment_method':
      return {
        label: 'In Progress',
        color: theme.palette.grey[900],
        icon: <Sync style={{ color: theme.palette.grey[900] }} />,
      };
    case 'canceled':
      return {
        label: 'Cancelled',
        color: theme.palette.error.main,
        icon: <Close style={{ color: theme.palette.error.main }} />,
      };
    default:
      return {
        label: 'Incomplete',
        color: theme.palette.grey[300],
        icon: <InfoOutlinedIcon style={{ color: theme.palette.grey[300] }} />,
      };
  }
};

export const OrderPreview: FC<OrderPreviewProps> = ({ order }) => {
  const statusInfo = getStatus(order.status, theme);
  const isBetweenMdAndLg = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isBetweenXsAndSm = useMediaQuery(theme.breakpoints.between('xs', 'sm'));

  return (
    <Box
      sx={{
        py: { xs: 0, sm: 2 },
        width: '100%',
        mr: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          paddingLeft: '24px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            width: { md: '200px' },
          }}
        >
          <Typography variant="caption" component={'p'}>
            <strong>N°{order.orderNumber}</strong>
          </Typography>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Typography
              variant="caption"
              component={'p'}
              sx={{
                color: theme.palette.grey[600],
                fontWeight: 400,
              }}
            >
              {formatDate(order.date)}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="caption"
            component={'span'}
            sx={{
              color: theme.palette.grey[600],
              fontWeight: 400,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {!isBetweenMdAndLg ? 'Products: ' : <InventoryTwoTone />}
            <Typography
              component="span"
              variant="caption"
              sx={{
                color: theme.palette.secondary.main,
                fontWeight: 500,
                paddingLeft: '4px',
              }}
            >
              {order.products.length}
            </Typography>
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: { xs: '120px', lg: '340px' },
          }}
        >
          <Typography
            variant="caption"
            component={'span'}
            sx={{
              color: theme.palette.grey[600],
              fontWeight: 400,
              flex: 1,
            }}
          >
            {!isBetweenMdAndLg && !isBetweenXsAndSm ? 'Summary: ' : ''}
            <Typography
              component="span"
              variant="caption"
              sx={{
                color: theme.palette.secondary.main,
                fontWeight: 500,
              }}
            >
              {order.summary}$
            </Typography>
          </Typography>
          <StyledChip
            icon={statusInfo.icon}
            label={statusInfo.label}
            statusColor={statusInfo.color}
          />
        </Box>
      </Box>
    </Box>
  );
};
