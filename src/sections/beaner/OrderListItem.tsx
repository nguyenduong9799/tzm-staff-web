import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { OrderItem } from 'types/order';
import { ProductType } from 'utils/constants';
import { fCurrency } from 'utils/formatNumber';

type Props = {
  orderList: OrderItem[];
};
const OrderListItem = ({ orderList }: Props) => (
  <Box>
    {orderList
      .filter((order) => order.product_type !== ProductType.GIFT_PRODUCT)
      .map((order, idx) => (
        <Stack mb={2} pb={2} direction="row" key={order.order_detail_id} spacing={1}>
          <Box width="40px">
            <Typography variant="caption">{order.quantity}x</Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="body1">{order.product_name}</Typography>
            <Stack spacing={0.5}>
              {order.list_of_childs.map((childItem) => (
                <Typography variant="body2" key={childItem.order_detail_id}>
                  {childItem.quantity} x {childItem.product_name}
                </Typography>
              ))}
            </Stack>
          </Box>
          <Box width="90px" textAlign="right">
            <Typography>{fCurrency(order.final_amount)}</Typography>
          </Box>
        </Stack>
      ))}
    {orderList.filter((order) => order.product_type === ProductType.GIFT_PRODUCT).length === 0 ? (
      <Box></Box>
    ) : (
      <Box>
        <Typography mb={2} variant="h6">
          Quà tặng
        </Typography>
        {orderList
          .filter((order) => order.product_type === ProductType.GIFT_PRODUCT)
          .map((order, idx) => (
            <Stack mb={2} pb={2} direction="row" key={order.order_detail_id} spacing={1}>
              <Box width="40px">
                <Typography variant="caption">{order.quantity}x</Typography>
              </Box>
              <Box flex={1}>
                <Typography variant="body1">{order.product_name}</Typography>
                <Stack spacing={0.5}>
                  {order.list_of_childs.map((childItem) => (
                    <Typography variant="body2" key={childItem.order_detail_id}>
                      {childItem.quantity} x {childItem.product_name}
                    </Typography>
                  ))}
                </Stack>
              </Box>
              <Box width="90px" textAlign="right">
                <Typography>{fCurrency(order.final_amount)}</Typography>
              </Box>
            </Stack>
          ))}
      </Box>
    )}
  </Box>
);

export default OrderListItem;
