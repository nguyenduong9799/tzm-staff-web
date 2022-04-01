import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { OrderItem } from 'types/order';
import { ProductType } from 'utils/constants';
import { fCurrency } from 'utils/formatNumber';
import { formatCurrency } from 'utils/utils';

type Props = {
  orderList: OrderItem[];
};
const OrderListItem = ({ orderList }: Props) => (
  <Box>
    {orderList
      .filter((order) => order.product_type !== ProductType.GIFT_PRODUCT)
      .map((order, idx) => (
        <Stack pb={1} direction="row" key={order.order_detail_id} spacing={1}>
          <Box flex={1}>
            <Typography variant="body2">{order.quantity} x</Typography>
          </Box>
          <Box flex={10}>
            <Typography variant="body1">{order.product_name}</Typography>
            <Stack spacing={0.5}>
              {order.list_of_childs.map((childItem) => (
                <Typography variant="body2" key={childItem.order_detail_id}>
                  {childItem.quantity} x {childItem.product_name}
                </Typography>
              ))}
            </Stack>
            {order.product_name?.toLowerCase()?.includes('combo') ? (
              <Typography variant="body2">{order.product_description}</Typography>
            ) : (
              <Typography />
            )}
          </Box>
          <Box flex={4} textAlign="right">
            <Typography>{formatCurrency(order.final_amount)}</Typography>
          </Box>
        </Stack>
      ))}
    {orderList.filter((order) => order.product_type === ProductType.GIFT_PRODUCT).length === 0 ? (
      <Box />
    ) : (
      <Box>
        <Typography mb={1} variant="h6">
          Quà tặng
        </Typography>
        {orderList
          .filter((order) => order.product_type === ProductType.GIFT_PRODUCT)
          .map((order, idx) => (
            <Stack mb={2} pb={2} direction="row" key={order.order_detail_id} spacing={1}>
              <Box flex={1}>
                <Typography variant="body2">{order.quantity}x</Typography>
              </Box>
              <Box flex={10}>
                <Typography variant="body1">{order.product_name}</Typography>
                <Stack spacing={0.5}>
                  {order.product_name?.toLowerCase()?.includes('combo') ? (
                    <Typography variant="body2">{order.product_description}</Typography>
                  ) : (
                    <Typography />
                  )}
                </Stack>
                {order.product_name.includes('combo') ? (
                  <Typography variant="body2"> có combo {order.description}</Typography>
                ) : (
                  <Typography>Ko có combo</Typography>
                )}
              </Box>
              <Box flex={4} textAlign="right">
                <Typography>{fCurrency(order.final_amount)} Bean</Typography>
              </Box>
            </Stack>
          ))}
      </Box>
    )}
  </Box>
);

export default OrderListItem;
