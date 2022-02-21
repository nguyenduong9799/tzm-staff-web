import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  Chip,
  Container,
  IconButton,
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
import { formatCurrency } from 'utils/utils';
import { Replay } from '@mui/icons-material';
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
  const [filter, setFilter] = useState<any>({
    'order-status': OrderStatus.NEW,
  });
  const { enqueueSnackbar } = useSnackbar();

  const {
    data,
    refetch: fetchOrders,
    isLoading,
    isFetching,
  } = useQuery(['beaner-orders', filter], () =>
    request
      .get<{ data: OrderResponse[] }>('/stores/150/orders', { params: filter })
      .then((res) => res.data.data[0])
  );

  console.log('isLoading', isLoading);

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
  const totalFinalAmount = (data?.list_of_orders ?? []).reduce(
    (total, order) => total + order.final_amount,
    0
  );
  const filterOrderStatus = (status?: OrderStatus) => {
    setFilter({ 'order-status': status ?? '' });
  };

  return (
    <Page title="Danh sách đơn hàng">
      <Container>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4">Danh sách đơn hàng</Typography>
          <Stack direction="row" spacing={1}>
            <Card sx={{ p: 1, width: '50%', mx: 'auto', textAlign: 'left' }}>
              <Typography variant="body1">Tổng đơn:</Typography>
              <Typography fontWeight="bold">{totalOrder ?? 0} </Typography>
            </Card>
            <Card sx={{ p: 1, width: '50%', mx: 'auto', textAlign: 'left' }}>
              <Typography>Tổng tiền: </Typography>
              <Typography fontWeight="bold">{formatCurrency(totalFinalAmount)}</Typography>
            </Card>
          </Stack>
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
          <Stack direction="row" spacing={1} mb={2} justifyContent="space-between">
            <Stack direction="row" spacing={1}>
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
              <Chip
                label="Tất cả"
                variant={!filter['order-status'] ? 'filled' : 'outlined'}
                onClick={() => filterOrderStatus()}
              />
            </Stack>
            <Box>
              {!isFetching && (
                <Box>
                  <IconButton onClick={() => fetchOrders()}>
                    <Replay />
                  </IconButton>
                </Box>
              )}
              {isFetching ? (
                <Box textAlign="center">
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
          </Stack>
        </Box>
        <Box>
          <Stack spacing={2}>{data?.list_of_orders?.map(renderOrder)}</Stack>
        </Box>
      </Container>
    </Page>
  );
};

export default BeanerOrderList;
