import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  Chip,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import { Order, OrderResponse, OrderStatus } from 'types/order';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import OrderDetailDialog from 'sections/beaner/OrderDetailDialog';
import request from 'utils/axios';
import Page from '../../../components/Page';
import ConfirmDialog from 'components/confirm-dialog/ConfirmDialog';
import { useSnackbar } from 'notistack';
import { CircularProgress } from '@mui/material';
type Props = {};

const TABLE_HEAD = [
  { id: 'name', label: 'Product', alignRight: false },
  { id: 'createdAt', label: 'Create at', alignRight: false },
  { id: 'inventoryType', label: 'Status', alignRight: false },
  { id: 'price', label: 'Price', alignRight: true },
  { id: '' },
];

const BeanerOrderList = (props: Props) => {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [confirmOrderId, setConfirmOrderId] = useState<number | null>(null);
  const [filter, setFilter] = useState<any>({});
  const { enqueueSnackbar } = useSnackbar();

  const {
    data,
    refetch: fetchOrders,
    isLoading,
  } = useQuery(['beaner-orders', filter], () =>
    request
      .get<{ data: OrderResponse[] }>('/stores/150/orders', { params: filter })
      .then((res) => res.data.data[0])
  );

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

  const handleUpdateOrder = () =>
    request
      .put(`/stores/150/orders/${confirmOrderId}`, 3)
      .then(() => {
        setConfirmOrderId(null);
        setSelectedOrderId(null);
        enqueueSnackbar('Cập nhật thành công', { variant: 'success' });
        fetchOrders();
        return true;
      })
      .catch((error) => {
        setConfirmOrderId(null);
        enqueueSnackbar(error?.message ?? 'Có lỗi xảy ra! Vui lòng thử lại.', { variant: 'error' });
        return false;
      });

  const totalOrder = data?.list_of_orders.length;

  const filterOrderStatus = (status?: OrderStatus) => {
    setFilter({ 'order-status': status ?? '' });
  };

  return (
    <Page title="Danh sách đơn hàng">
      <Container>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4">Danh sách đơn hàng</Typography>
          <Typography variant="body1">{totalOrder ?? 0} đơn hàng</Typography>
        </Box>
        <Box>
          <ConfirmDialog
            title={`Xác nhận hoàn thành đơn hàng`}
            onClose={() => {
              setSelectedOrderId(null);
              setConfirmOrderId(null);
            }}
            onOk={handleUpdateOrder}
            open={Boolean(confirmOrderId)}
          />
          <Stack direction="row" spacing={1} mb={2}>
            <Chip
              label="Tất cả"
              variant={!filter['order-status'] ? 'filled' : 'outlined'}
              onClick={() => filterOrderStatus()}
            />
            <Chip
              label="Mới"
              variant={filter['order-status'] === OrderStatus.NEW ? 'filled' : 'outlined'}
              onClick={() => filterOrderStatus(OrderStatus.NEW)}
            />
            <Chip
              label="Hoàn thành"
              variant={filter['order-status'] === OrderStatus.DONE ? 'filled' : 'outlined'}
              onClick={() => filterOrderStatus(OrderStatus.DONE)}
            />
          </Stack>
          {isLoading ? (
            <Box textAlign="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <OrderDetailDialog
              onUpdate={() => setConfirmOrderId(selectedOrderId)}
              orderId={selectedOrderId}
              onClose={() => setSelectedOrderId(null)}
            />
          )}
        </Box>
        <Box>
          <Stack spacing={2}>{data?.list_of_orders?.reverse().map(renderOrder)}</Stack>
        </Box>
      </Container>
    </Page>
  );
};

export default BeanerOrderList;
