import { OpenInFullOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CircularProgress,
  Container,
  Fab,
  Stack,
  Typography,
} from '@mui/material';
import EmptyContent from 'components/EmptyContent';
import Page from 'components/Page';
import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import SupplierOrderDetailDialog from 'sections/beaner/SupplierOrderDetailDialog';
import { Order, OrderResponse } from 'types/order';
import request from 'utils/axios';
import { formatCurrency } from 'utils/utils';

type Props = {};

const SupplierOrderList = (props: Props) => {
  const { supplierId } = useParams();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const { data, isLoading } = useQuery(['suppliers', supplierId, 'orders'], () =>
    request
      .get<{ data: OrderResponse[] }>(`/stores/150/suppliers/${supplierId}/orders`)
      .then((res) => res.data.data[0])
  );

  const orders = useMemo(() => data?.list_of_orders.reverse() ?? [], [data]);
  const totalOrder = orders.length;
  const currentIdx = selectedOrderId ? orders.findIndex((o) => o.order_id === selectedOrderId) : -1;
  const totalFinalAmount = orders.reduce((total, order) => total + order.final_amount, 0);

  const renderOrder = (order: Order) => (
    <Card key={order.order_id}>
      <CardActionArea onClick={() => setSelectedOrderId(order.order_id)}>
        <Box sx={{ px: 2, pt: 1 }}>
          <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6">{order.invoice_id}</Typography>
              <Typography>{order.customer.name}</Typography>
            </Box>
            <Box>{order.master_product_quantity} món</Box>
          </Stack>
        </Box>
      </CardActionArea>
      <CardActions>
        <Button onClick={() => setSelectedOrderId(order.order_id)} size="small" color="primary">
          Chi tiết
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Page title="Danh sách đơn hàng nhà cung cấp">
      <Box textAlign="center" mb={4}>
        <Typography variant="h4">Danh sách đơn hàng</Typography>
        <Typography variant="body1">{totalOrder ?? 0} đơn hàng</Typography>
        <Typography fontWeight="bold">Tổng tiền: {formatCurrency(totalFinalAmount)}</Typography>
      </Box>
      <Container>
        {orders && totalOrder !== 0 && (
          <Box sx={{ position: 'fixed', right: 24, bottom: 24 }}>
            <Fab
              onClick={() => setSelectedOrderId(orders[0].order_id)}
              size="medium"
              aria-label="add"
            >
              <OpenInFullOutlined />
            </Fab>
          </Box>
        )}
        <Box>
          {isLoading ? (
            <Box textAlign="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <SupplierOrderDetailDialog
              supplierId={Number(supplierId)}
              onPrevious={() => {
                console.log('orders[currentIdx - 1]', orders[currentIdx - 1]);
                if (currentIdx > 0) setSelectedOrderId(orders[currentIdx - 1].order_id);
              }}
              onNext={() => {
                if (currentIdx < totalOrder - 1) {
                  setSelectedOrderId(orders[currentIdx + 1].order_id);
                }
              }}
              orderId={selectedOrderId}
              onClose={() => setSelectedOrderId(null)}
            />
          )}
          {totalOrder === 0 && <EmptyContent title="Không có đơn hàng nào" />}
        </Box>
        <Box>
          <Stack spacing={2}>{orders.map(renderOrder)}</Stack>
        </Box>
      </Container>
    </Page>
  );
};

export default SupplierOrderList;
