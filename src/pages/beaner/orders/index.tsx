import { CloseFullscreen, FilterList, Replay } from '@mui/icons-material';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneAndroidOutlinedIcon from '@mui/icons-material/PhoneAndroidOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
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
import ConfirmDialog from 'components/confirm-dialog/ConfirmDialog';
import ConfirmOrderModal from 'components/confirmBeforeOrder';
import OrderFilter from 'components/filter';
import useConfirmOrder from 'hooks/useConfirmOrder';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import OrderDetailDialog from 'sections/beaner/OrderDetailDialog';
import { Order, OrderResponse, OrderStatus, PaymentType } from 'types/order';
import { Store } from 'types/store';
import request from 'utils/axios';
import { formatCurrency, getAreaStorage } from 'utils/utils';
import Page from '../../../components/Page';
type Props = {};

const BeanerOrderList = (props: Props) => {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [confirmOrderId, setConfirmOrderId] = useState<number | null>(null);
  const [confirmOrderIdc, setConfirmOrderIdc] = useState<number | null>(null);
  const [showCOnfirmModal, setShowCOnfirmModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const store: Store = getAreaStorage() ?? {};
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

  console.log('orders :>> ', orders);
  const currentIdx = selectedOrderId ? orders?.findIndex((o) => o.id === selectedOrderId) : -1;

  const confirmCheckedOrder = async (isNotify?: boolean) => {
    let success = true;
    if (isNotify) {
      await request.get(`/stores/${storeId}/orders/notification`).catch(() => {
        success = false;
      });
    }
    if (success) {
      enqueueSnackbar('Xác nhận thành công', {
        variant: 'success',
      });
      updateConfirm();
      setShowCOnfirmModal(false);
    }
  };

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
        <CardActionArea onClick={() => setSelectedOrderId(order.id)}>
          <Box sx={{ px: 2, pt: 1 }}>
            <Stack spacing={2} direction="row">
              <Typography variant="h5">{order.orderCode}</Typography>
              {order.status === OrderStatus.Delivered && (
                <Chip color="success" size="small" label={'Hoàn thành'} />
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
          <Button onClick={() => setSelectedOrderId(order.id)} size="small" color="primary">
            Chi tiết
          </Button>
        </CardActions>
      </Card>
    );
  };

  const handleUpdateOrder = () =>
    request
      .put(`/orders/${confirmOrderId}/status`, { status: OrderStatus.Delivered })
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
  const handleDeleteOrder = () =>
    request
      .put(`/stores/${storeId}/orders/${confirmOrderIdc}`, 4)
      .then(() => {
        setConfirmOrderIdc(null);
        setSelectedOrderId(null);
        enqueueSnackbar('Cancel thành công', { variant: 'success' });
        fetchOrders();
        return true;
      })
      .catch((error) => {
        setConfirmOrderIdc(null);
        enqueueSnackbar(error?.message ?? 'Có lỗi xảy ra! Vui lòng thử lại.', { variant: 'error' });
        return false;
      });

  const today = new Date();
  const totalOrder = orders?.length;
  const totalOrder1 = orders?.length;

  // const totalFinalAmount = (
  //   orders?.filter((e) => e.paymentMethod === PaymentType.Cash) ?? []
  // ).reduce((total, order) => total + order.final_amount, 0);

  // const totalFinalAmountMomo = (
  //   orders?.filter((e) => e.paymentMethod === PaymentType.Momo) ?? []
  // ).reduce((total, order) => total + order.final_amount, 0);

  // const totalFinalAmountCoin = (
  //   orders?.filter((e) => e.paymentMethod === PaymentType.CreditPayment) ?? []
  // ).reduce((total, order) => total + order.final_amount, 0);

  // const totalProduct = (orders ?? []).reduce(
  //   (total, order) => total + order.master_product_quantity,
  //   0
  // );

  const filterOrderStatus = (status?: OrderStatus) => {
    filterForm.setValue('Status', status ?? OrderStatus.All);
  };

  const countTotalFilter = Object.values(filters).filter((v) => v != null).length;
  const renderConfirmButton = () => {
    if (totalOrder === 0 || isConfirmed) {
      return null;
    }

    return (
      <Box
        sx={{
          bgcolor: (theme) => theme.palette.background.default,
          position: 'fixed',
          bottom: 0,
          left: 0,
          p: 1,
          width: '100%',
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <Button onClick={() => setShowCOnfirmModal(true)} variant="outlined" fullWidth>
          Xác nhận bắt đầu giao
        </Button>
      </Box>
    );
  };

  return (
    <Page title="Danh sách đơn hàng">
      {renderConfirmButton()}
      <ConfirmOrderModal
        onConfirm={confirmCheckedOrder}
        open={showCOnfirmModal}
        onClose={() => setShowCOnfirmModal(false)}
      />
      <Container>
        <Box textAlign="center" mb={4}>
          <Typography mb={2} variant="h4">
            Danh sách đơn hàng
            {/* {`: Từ ${transformdatefilter['from-date']} Đến ${transformdatefilter['to-date']}`} */}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Card sx={{ p: 1, mx: 'auto', textAlign: 'left' }}>
              <Stack direction="column" justifyContent="space-between">
                <Stack direction="row" justifyContent="space-between" spacing={1}>
                  <Typography variant="body1">Tổng đơn:</Typography>
                  <Typography fontWeight="bold">{totalOrder ?? 0} </Typography>
                </Stack>
                {/* <Stack direction="row" justifyContent="space-between" spacing={1}>
                  <Typography variant="body1">Tổng phần:</Typography>
                  <Typography fontWeight="bold">{totalProduct ?? 0} </Typography>
                </Stack> */}
              </Stack>
            </Card>
            {/* <Card sx={{ p: 1, width: '60%', mx: 'auto', textAlign: 'left' }}>
              <Stack direction="column" justifyContent="space-between">
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Typography variant="body2">Tổng tiền mặt:</Typography>
                  <Typography fontWeight="bold">{formatCurrency(totalFinalAmount)} </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Typography variant="body2">Tổng Momo:</Typography>
                  <Typography fontWeight="bold">{formatCurrency(totalFinalAmountMomo)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Typography variant="body2">Tổng xu:</Typography>
                  <Typography fontWeight="bold">{totalFinalAmountCoin} xu</Typography>
                </Stack>
              </Stack>
            </Card> */}
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
          <ConfirmDialog
            title={`Xác nhận hủy đơn hàng`}
            onClose={() => {
              setConfirmOrderIdc(null);
            }}
            onOk={handleDeleteOrder}
            open={Boolean(confirmOrderIdc)}
          />
          <Stack direction="row" spacing={1} mb={2} justifyContent="space-between">
            <Stack direction="row" spacing={1}>
              <Chip
                label="Mới"
                variant={filters.Status === OrderStatus.New ? 'filled' : 'outlined'}
                onClick={() => filterOrderStatus(OrderStatus.New)}
              />
              <Chip
                label="Hoàn thành"
                variant={filters.Status === OrderStatus.Delivered ? 'filled' : 'outlined'}
                onClick={() => filterOrderStatus(OrderStatus.Delivered)}
              />
              <Chip
                label="Đã huỷ"
                variant={filters.Status === OrderStatus.Removed ? 'filled' : 'outlined'}
                onClick={() => filterOrderStatus(OrderStatus.Removed)}
              />
              <Chip
                label="Tất cả"
                variant={filters.Status === OrderStatus.All ? 'filled' : 'outlined'}
                onClick={() => filterOrderStatus()}
              />
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
                  onDelete={() => setConfirmOrderIdc(selectedOrderId)}
                  current={currentIdx! + 1}
                  total={totalOrder1}
                  onNext={() => {
                    console.log('orders[currentIdx - 1]', orders![currentIdx! - 1]);
                    if (currentIdx! > 0) setSelectedOrderId(orders![currentIdx! - 1].id);
                  }}
                  onPrevious={() => {
                    if (currentIdx! < totalOrder1! - 1) {
                      setSelectedOrderId(orders![currentIdx! + 1].id);
                    }
                  }}
                />
              )}
            </Box>
          </Stack>
          <Stack direction="row" justifyContent="start">
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
