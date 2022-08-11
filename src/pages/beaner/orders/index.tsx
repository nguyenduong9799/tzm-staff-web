import { FilterList, Replay } from '@mui/icons-material';

import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import OrderFilter from 'components/filter';
import useConfirmOrder from 'hooks/useConfirmOrder';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import { Order, OrderResponse, OrderStatus, PaymentType } from 'types/order';
import { Store } from 'types/store';
import request from 'utils/axios';
import { getAreaStorage } from 'utils/utils';
import Page from '../../../components/Page';
type Props = {};

const BeanerOrderList = (props: Props) => {
  const store: Store = getAreaStorage() ?? {};
  const navigate = useNavigate();
  const storeId = store.id;
  const [isConfirmed, updateConfirm] = useConfirmOrder();
  const [openFilter, setOpenFilter] = useState(false);
  const filterForm = useForm({
    defaultValues: {
      Status: OrderStatus.New,
    },
  });

  const filters = filterForm.watch();

  // console.log(transformdatefilter['from-date']);
  const {
    data,
    refetch: fetchOrders,
    isFetching,
  } = useQuery([storeId, 'beaner-orders', filters], () =>
    request
      .get(`/orders`, {
        params: filters,
      })
      .then((res) => res.data)
  );
  const getListOrder = (data: OrderResponse) => {
    let listOrder: Order[] = [];
    if (data != null) {
      listOrder = data?.results;
    } else listOrder = [];

    return listOrder;
  };
  console.log('Response DATA', data);
  const orderResponse: OrderResponse = data;

  const orders = useMemo(
    () => (data !== undefined || data !== null ? getListOrder(orderResponse) : null),
    [orderResponse, data]
  );

  const renderOrder = (order: Order) => {
    const isCancled = order.status === OrderStatus.Removed;
    console.log('order', order);
    return order == null ? (
      <Typography> Hiện không có đơn hàng nào</Typography>
    ) : (
      <Card
        elevation={isCancled ? 0 : 1}
        key={order.id}
        sx={{
          bgcolor: (theme) =>
            isCancled ? theme.palette.background.neutral : theme.palette.background.paper,
        }}
      >
        <CardActionArea
          onClick={() => navigate(PATH_DASHBOARD.beaner.orders.orderDetail(order.id))}
        >
          <Box sx={{ px: 1, pt: 1 }}>
            <Stack spacing={2} direction="row">
              <Typography variant="h5">{order.orderCode}</Typography>
              {order.status === OrderStatus.Delivered && (
                <Chip color="success" size="small" label={'Hoàn thành'} />
              )}
              {order.status === OrderStatus.Assigned && (
                <Chip color="info" size="small" label={'Đã nhận đơn'} />
              )}
              {order.status === OrderStatus.PickedUp && (
                <Chip color="primary" size="small" label={'Đã lấy hàng'} />
              )}
              {order.status === OrderStatus.New && (
                <Chip color="warning" label={'Mới'} size="small" />
              )}
              {order.status === OrderStatus.Cancel && (
                <Chip color="error" label={'Đã Hủy'} size="small" />
              )}
            </Stack>
            <Box sx={{ pt: 1 }} justifyContent="space-between">
              <Typography>Điểm lấy: {order.fromStation.address}</Typography>
              <Typography>Điểm giao: {order.toStation.address}</Typography>
              <Typography>Giờ đặt: {new Date(order.createdAt).toLocaleTimeString()}</Typography>
            </Box>
          </Box>
        </CardActionArea>
        <CardActions>
          <Button
            onClick={() => {
              navigate(PATH_DASHBOARD.beaner.orders.orderDetail(order.id));
            }}
            size="small"
            color="primary"
          >
            Chi tiết
          </Button>
        </CardActions>
      </Card>
    );
  };

  const today = new Date();
  const totalOrder = orders?.filter(
    (item: Order) => item.createdAt.substring(0, 10) === today.toJSON().substring(0, 10)
  ).length;
  const totalOrderPaid = orders?.filter(
    (item: Order) =>
      item.createdAt.substring(0, 10) === today.toJSON().substring(0, 10) &&
      item.paymentMethod === PaymentType.Paid
  ).length;

  const totalOrderCOD = orders?.filter(
    (item: Order) =>
      item.createdAt.substring(0, 10) === today.toJSON().substring(0, 10) &&
      item.paymentMethod !== PaymentType.Paid
  ).length;

  const totalNewOrder = orders?.filter(
    (item: Order) =>
      item.createdAt.substring(0, 10) === today.toJSON().substring(0, 10) &&
      item.status === OrderStatus.New
  ).length;
  const totalAssignedOrder = orders?.filter(
    (item: Order) =>
      item.createdAt.substring(0, 10) === today.toJSON().substring(0, 10) &&
      item.status === OrderStatus.Assigned
  ).length;
  const totalPickedUpOrder = orders?.filter(
    (item: Order) =>
      item.createdAt.substring(0, 10) === today.toJSON().substring(0, 10) &&
      item.status === OrderStatus.PickedUp
  ).length;
  const totalDeliveredOrder = orders?.filter(
    (item: Order) =>
      item.createdAt.substring(0, 10) === today.toJSON().substring(0, 10) &&
      item.status === OrderStatus.Delivered
  ).length;

  const filterOrderStatus = (status?: OrderStatus) => {
    filterForm.setValue('Status', status!);
  };

  const countTotalFilter = Object.values(filters).filter((v) => v != null).length;

  return (
    <Page title="Danh sách đơn hàng">
      <Container>
        <Box textAlign="center" mb={1}>
          <Typography variant="h4">
            Danh sách đơn hàng
            {/* {`: Từ ${transformdatefilter['from-date']} Đến ${transformdatefilter['to-date']}`} */}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Card sx={{ p: 1, width: '50%', mx: 'auto', textAlign: 'left' }}>
              <Stack direction="column" justifyContent="space-between">
                <Stack direction="row" justifyContent="space-between" spacing={1}>
                  <Typography variant="body1">Tổng đơn:</Typography>
                  <Typography fontWeight="bold">{totalOrder ?? 0} </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" spacing={1}>
                  <Typography variant="body1">Đã thanh toán :</Typography>
                  <Typography fontWeight="bold">{totalOrderPaid ?? 0} </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" spacing={1}>
                  <Typography variant="body1">Đơn COD :</Typography>
                  <Typography fontWeight="bold">{totalOrderCOD ?? 0} </Typography>
                </Stack>
              </Stack>
            </Card>
            <Card sx={{ p: 1, width: '50%', mx: 'auto', textAlign: 'left' }}>
              <Stack direction="column" justifyContent="space-between">
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Typography variant="body2">Đơn mới:</Typography>
                  <Typography fontWeight="bold">{totalNewOrder} </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Typography variant="body2">Đơn đã nhận:</Typography>
                  <Typography fontWeight="bold">{totalAssignedOrder}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Typography variant="body2">Đơn đã lấy:</Typography>
                  <Typography fontWeight="bold">{totalPickedUpOrder}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Typography variant="body2">Đơn đã giao:</Typography>
                  <Typography fontWeight="bold">{totalDeliveredOrder}</Typography>
                </Stack>
              </Stack>
            </Card>
          </Stack>
        </Box>
        <Box>
          <Stack direction="column" spacing={1} mb={1} justifyContent="space-between">
            <Stack direction="row" spacing={1}>
              <Chip
                label="Mới"
                variant={filters.Status === OrderStatus.New ? 'filled' : 'outlined'}
                onClick={() => filterOrderStatus(OrderStatus.New)}
              />
              <Chip
                label="Đã nhận đơn"
                variant={filters.Status === OrderStatus.Assigned ? 'filled' : 'outlined'}
                onClick={() => filterOrderStatus(OrderStatus.Assigned)}
              />
              <Chip
                label="Đã lấy hàng"
                variant={filters.Status === OrderStatus.PickedUp ? 'filled' : 'outlined'}
                onClick={() => filterOrderStatus(OrderStatus.PickedUp)}
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              <Chip
                label="Hoàn thành"
                variant={filters.Status === OrderStatus.Delivered ? 'filled' : 'outlined'}
                onClick={() => filterOrderStatus(OrderStatus.Delivered)}
              />
              <Chip
                label="Đã huỷ"
                variant={filters.Status === OrderStatus.Cancel ? 'filled' : 'outlined'}
                onClick={() => filterOrderStatus(OrderStatus.Cancel)}
              />
              {/* <Chip
                label="Tất cả"
                variant={filters.Status === OrderStatus.All ? 'filled' : 'outlined'}
                onClick={() => filterOrderStatus(OrderStatus.All)}
              /> */}
            </Stack>

            <FormProvider {...filterForm}>
              <OrderFilter
                onReset={() =>
                  filterForm.reset({
                    Status: OrderStatus.New,
                  })
                }
                open={openFilter}
                onClose={() => setOpenFilter(false)}
              />
            </FormProvider>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Button
              color="inherit"
              sx={{ mb: 2 }}
              endIcon={<FilterList />}
              onClick={() => setOpenFilter(true)}
            >
              Bộ lọc
              {countTotalFilter !== 0 && (
                <Chip sx={{ height: 24, ml: 1 }} label={countTotalFilter} color="primary" />
              )}
            </Button>
            <Box>
              {isFetching ? (
                <Box textAlign="center">
                  <CircularProgress />
                </Box>
              ) : (
                <Box>
                  <IconButton size="large" color="primary" onClick={() => fetchOrders()}>
                    <Replay />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Stack>
        </Box>

        <Box>
          <Stack spacing={2}>
            {orders == null || orders === undefined ? (
              <Typography> Không có đơn hàng nào</Typography>
            ) : (
              orders
                .filter(
                  (item: Order) =>
                    item.createdAt.substring(0, 10) === today.toJSON().substring(0, 10)
                )
                .map(renderOrder)
            )}
          </Stack>
        </Box>
      </Container>
    </Page>
  );
};
export default BeanerOrderList;
