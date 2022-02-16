import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { OrderItem } from 'types/order';
import { fCurrency } from 'utils/formatNumber';

type Props = {
  orderItem: OrderItem;
  isEndItem?: boolean;
};

const OrderItemSummary = ({ orderItem, isEndItem = false }: Props) => (
  <Stack
    mb={2}
    pb={2}
    direction="row"
    spacing={1}
    sx={{ borderBottom: !isEndItem ? '1px solid #ccc' : 'none' }}
  >
    <Box width="40px">
      <Typography variant="caption">{orderItem.quantity}x</Typography>
    </Box>
    <Box flex={1}>
      <Typography variant="body1">{orderItem.product_name}</Typography>
      <Stack spacing={0.5}>
        {orderItem.list_of_childs.map((childItem) => (
          <Typography variant="body2" key={childItem.order_detail_id}>
            {childItem.quantity} x {childItem.product_name}
          </Typography>
        ))}
      </Stack>
    </Box>
    <Box width="90px" textAlign="right">
      <Typography>{fCurrency(orderItem.final_amount)}</Typography>
    </Box>
  </Stack>
);

export default OrderItemSummary;
