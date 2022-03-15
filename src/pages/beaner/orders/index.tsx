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
import MenuOutLinedIcon from '@mui/material/Icon';
import ConfirmDialog from 'components/confirm-dialog/ConfirmDialog';
import ConfirmOrderModal from 'components/confirmBeforeOrder';
import OrderFilter from 'components/filter';
import useConfirmOrder from 'hooks/useConfirmOrder';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import OrderDetailDialog from 'sections/beaner/OrderDetailDialog';
import { Order, OrderResponse, OrderStatus } from 'types/order';
import { Store } from 'types/store';
import request from 'utils/axios';
import { formatCurrency, getAreaCookie } from 'utils/utils';
import Page from '../../../components/Page';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

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
  const [showCOnfirmModal, setShowCOnfirmModal] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const store: Store = getAreaCookie() ?? {};
  const storeId = store.id;

  const [isConfirmed, updateConfirm] = useConfirmOrder();

  const [openFilter, setOpenFilter] = useState(false);

  const filterForm = useForm({
    defaultValues: { 'destination-location-id': null, 'order-status': OrderStatus.NEW },
  });

  const filters = filterForm.watch();

  const {
    data,
    refetch: fetchOrders,
    isLoading,
    isFetching,
  } = useQuery([storeId, 'beaner-orders', filters], () =>
    request
      .get<{ data: OrderResponse[] }>(`/stores/${storeId}/orders`, { params: filters })
      .then((res) => res.data.data[0])
  );

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
    const isCancled = order.order_status === OrderStatus.CANCLE;
    return (
      <Card
        elevation={isCancled ? 0 : 1}
        key={order.order_id}
        sx={{ bgcolor: isCancled ? '#ccc' : 'white' }}
      >
        <CardActionArea onClick={() => setSelectedOrderId(order.order_id)}>
          <Box sx={{ px: 2, pt: 1 }}>
            <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h6">
                  {order.invoice_id} {order.customer.name}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocationOnOutlinedIcon sx={{ color: 'warning.main' }} fontSize="small" />
                  <Typography>{order.delivery_address}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccessTimeOutlinedIcon sx={{ color: 'warning.main' }} fontSize="small" />
                  <Typography>{order.time_slot}</Typography>
                </Stack>
              </Box>
              <Box>
                <Typography variant="h6">{order.master_product_quantity} món</Typography>
              </Box>
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
  };

  const handleUpdateOrder = () =>
    request
      .put(`/stores/${storeId}/orders/${confirmOrderId}`, 3)
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

  const totalProduct = (data?.list_of_orders ?? []).reduce(
    (total, order) => total + order.master_product_quantity,
    0
  );

  const filterOrderStatus = (status?: OrderStatus) => {
    filterForm.setValue('order-status', status ?? OrderStatus.ALL);
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
          <Typography variant="h4">Danh sách đơn hàng</Typography>
          <Stack direction="row" spacing={1}>
            <Card sx={{ p: 1, width: '50%', mx: 'auto', textAlign: 'left' }}>
              <Stack direction="row" spacing={1} justifyContent="space-between">
                <Box>
                  <Typography variant="body1">Tổng đơn:</Typography>
                  <Typography fontWeight="bold">{totalOrder ?? 0} </Typography>
                </Box>
                <Box>
                  <Typography variant="body1">Tổng phần:</Typography>
                  <Typography fontWeight="bold">{totalProduct ?? 0} </Typography>
                </Box>
              </Stack>
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
                variant={filters['order-status'] === OrderStatus.NEW ? 'filled' : 'outlined'}
                onClick={() => filterOrderStatus(OrderStatus.NEW)}
              />
              <Chip
                label="Hoàn thành"
                variant={filters['order-status'] === OrderStatus.DONE ? 'filled' : 'outlined'}
                onClick={() => filterOrderStatus(OrderStatus.DONE)}
              />
              <Chip
                label="Đã huỷ"
                variant={filters['order-status'] === OrderStatus.CANCLE ? 'filled' : 'outlined'}
                onClick={() => filterOrderStatus(OrderStatus.CANCLE)}
              />
              <Chip
                label="Tất cả"
                variant={!filters['order-status'] ? 'filled' : 'outlined'}
                onClick={() => filterOrderStatus()}
              />
            </Stack>

            <FormProvider {...filterForm}>
              <OrderFilter
                onReset={() =>
                  filterForm.reset({
                    'destination-location-id': null,
                    'order-status': OrderStatus.NEW,
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
          <Stack spacing={2}>{data?.list_of_orders?.map(renderOrder)}</Stack>
        </Box>
      </Container>
    </Page>
  );
};

export default BeanerOrderList;
