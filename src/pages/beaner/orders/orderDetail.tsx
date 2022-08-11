import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import ConfirmDialog from 'components/confirm-dialog/ConfirmDialog';
import Page from 'components/Page';
import ResoDescriptions, { ResoDescriptionColumnType } from 'components/ResoDescriptions';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router';
import {
  Order,
  OrderStatus,
  ORDER_STATUS_OPTIONS,
  PaymentType,
  PAYMENT_TYPE_OPTIONS,
} from 'types/order';
import request from 'utils/axios';
import { formatCurrency } from 'utils/utils';

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PATH_DASHBOARD } from 'routes/paths';
import { FormProvider, useForm } from 'react-hook-form';
import InputDialog from 'components/input-dialog/InputDialog';

const OrderDetailPage = () => {
  const [confirmPaymentOrder, setConfirmPaymentOrder] = useState<PaymentType | null>(null);
  const [confirmStatusOrder, setConfirmStatusOrder] = useState<OrderStatus | null>(null);
  const [openCancelDialog, setOpenCancelDialog] = useState<boolean>(false);
  const nav = useNavigate();
  const { orderId } = useParams();

  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const cancelForm = useForm({
    defaultValues: {
      Status: OrderStatus.Cancel,
      cancelReason: '',
    },
  });
  const cancel = cancelForm.watch();
  console.log('cancel', cancel);
  const { data, isLoading, refetch } = useQuery(
    ['orders', orderId],
    () => request.get<Order>(`/orders/${orderId}`).then((res) => res.data),
    {
      enabled: Boolean(orderId),
    }
  );
  console.log('data', data);

  const orderColumns: ResoDescriptionColumnType<Order>[] = [
    {
      title: 'Mã đơn',
      dataIndex: 'orderCode',
      span: 2,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'orderAmount',
      valueType: 'money',
      render: (_, { orderAmount }) => (
        <Typography variant="subtitle1" fontWeight="bold">
          {formatCurrency(orderAmount)}
        </Typography>
      ),
    },
    {
      title: 'Phí Ship',
      dataIndex: 'shippingFee',
      valueType: 'money',
      render: (_, { shippingFee }) => (
        <Typography variant="subtitle1" fontWeight="bold">
          {formatCurrency(shippingFee)}
        </Typography>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      valueEnum: ORDER_STATUS_OPTIONS,
      span: 2,
    },
    {
      title: 'PT Thanh toán',
      dataIndex: 'paymentMethod',
      valueEnum: PAYMENT_TYPE_OPTIONS,
      span: 2,
    },
    {
      title: 'Thời gian đặt',
      dataIndex: 'createdAt',
      valueType: 'datetime',
      span: 2,
    },
  ];

  const fromStationColumns: ResoDescriptionColumnType<Order>[] = [
    {
      title: 'Điểm lấy',
      dataIndex: ['fromStation', 'address'],
      span: 2,
      render: (_, { fromStation }) => (
        <Typography variant="subtitle1" fontWeight="bold">
          {fromStation.address}
        </Typography>
      ),
    },
    {
      title: 'Tên người gửi',
      dataIndex: ['fromStation', 'code'],
      span: 2,
      render: (_, { fromStation }) => (
        <Typography variant="subtitle1" fontWeight="bold">
          {fromStation.code}
        </Typography>
      ),
    },
  ];
  const customerColumns: ResoDescriptionColumnType<Order>[] = [
    {
      title: 'Điểm giao',
      dataIndex: ['toStation', 'address'],
      span: 2,
      render: (_, { toStation }) => (
        <Typography variant="subtitle1" fontWeight="bold">
          {toStation.address}
        </Typography>
      ),
    },
    {
      title: 'Người nhận',
      dataIndex: 'customerName',
      span: 2,
      render: (_, { customerName }) => (
        <Typography variant="subtitle1" fontWeight="bold">
          {customerName}
        </Typography>
      ),
    },
    {
      title: 'SDT',
      dataIndex: 'customerPhone',
      render: (phone) => <a href={`tel: ${phone}`}>{phone}</a>,
      span: 2,
    },
  ];

  const handleUpdatePaymentTypeOrder = (paymentType: PaymentType) =>
    request
      .put(`/orders/${orderId}/status`, { paymentMethod: paymentType })
      .then(() => {
        enqueueSnackbar('Cập nhật thành công', { variant: 'success' });
        setConfirmPaymentOrder(null);
        refetch();
        return true;
      })
      .catch((error) => {
        enqueueSnackbar(error?.message ?? 'Có lỗi xảy ra! Vui lòng thử lại.', { variant: 'error' });
        return false;
      });

  const handleUpdateOrder = (status: OrderStatus) =>
    request
      .put(`/orders/${orderId}/status`, { status: status })
      .then(() => {
        enqueueSnackbar('Cập nhật thành công', { variant: 'success' });
        setConfirmStatusOrder(null);
        refetch();
        return true;
      })
      .catch((error) => {
        enqueueSnackbar(error?.message ?? 'Có lỗi xảy ra! Vui lòng thử lại.', { variant: 'error' });
        return false;
      });
  const handleCancleOrder = (value: any) =>
    request
      .put(`/orders/${orderId}/status`, value)
      .then(() => {
        enqueueSnackbar('Cập nhật thành công', { variant: 'success' });
        setConfirmStatusOrder(null);
        refetch();
        return true;
      })
      .catch((error) => {
        enqueueSnackbar(error?.message ?? 'Có lỗi xảy ra! Vui lòng thử lại.', { variant: 'error' });
        return false;
      });

  // @ts-ignore
  return (
    <Page title={'Chi tiết đơn hàng'}>
      <Stack spacing={1} sx={{ px: 2 }} alignItems="center" direction="row">
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => nav(PATH_DASHBOARD.beaner.orders.root)}
          aria-label="close"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography sx={{ px: 1 }} variant="h5">
          {data?.orderCode}
        </Typography>
        {data?.paymentMethod === PaymentType.Paid ? (
          <Chip color={'primary'} variant={'outlined'} label={'Đã Thanh toán'} />
        ) : (
          <Chip color={'primary'} variant={'outlined'} label={'Thanh toán khi nhận hàng'} />
        )}
      </Stack>

      <Box sx={{ px: 2 }}>
        {isLoading && (
          <Box p={4} textAlign="center">
            <CircularProgress />
          </Box>
        )}
        {!isLoading && (
          <Box>
            <ResoDescriptions
              title="Thông tin đơn hàng"
              labelProps={{ fontWeight: 'bold' }}
              columns={orderColumns as any}
              datasource={data}
              column={2}
            />
            <ResoDescriptions
              title="Thông tin lấy hàng"
              labelProps={{ fontWeight: 'bold' }}
              columns={fromStationColumns as any}
              datasource={data}
              column={1}
            />
            <ResoDescriptions
              title="Thông tin giao hàng"
              labelProps={{ fontWeight: 'bold' }}
              columns={customerColumns as any}
              datasource={data}
              column={1}
            />
          </Box>
        )}
        <Box
          position="fixed"
          width="100%"
          sx={{
            left: 0,
            bottom: 0,
            borderTop: '1px solid #cccccc6f',
            textAlign: 'center',
            zIndex: 10,
            bgcolor: theme.palette.background.default,
          }}
        >
          {data?.paymentMethod !== PaymentType.Paid && data?.status !== OrderStatus.Cancel && (
            <Box>
              <Typography variant="subtitle1" sx={{ alignSelf: 'start', px: 1, pt: 1 }}>
                Phương thức thanh toán
              </Typography>
              <Stack
                py={1}
                px={1}
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
              >
                {data?.paymentMethod !== PaymentType.Momo && data?.status !== OrderStatus.Cancel && (
                  <Button
                    variant="outlined"
                    size="medium"
                    onClick={() => setConfirmPaymentOrder(PaymentType.Momo)}
                  >
                    Momo
                  </Button>
                )}
                {data?.paymentMethod !== PaymentType.CreditPayment &&
                  data?.status !== OrderStatus.Cancel && (
                    <Button
                      variant="outlined"
                      size="medium"
                      onClick={() => setConfirmPaymentOrder(PaymentType.CreditPayment)}
                    >
                      Chuyển khoản
                    </Button>
                  )}
                {data?.paymentMethod !== PaymentType.Cash && data?.status !== OrderStatus.Cancel && (
                  <Button
                    variant="outlined"
                    size="medium"
                    onClick={() => setConfirmPaymentOrder(PaymentType.Cash)}
                  >
                    Tiền mặt
                  </Button>
                )}
              </Stack>
            </Box>
          )}
          <Box
            sx={{
              left: 0,
              bottom: 0,
              borderTop: '1px solid #cccccc6f',
              textAlign: 'center',
              bgcolor: theme.palette.background.default,
            }}
          >
            <Stack
              paddingTop={-5}
              py={2}
              px={1}
              direction="row"
              spacing={2}
              justifyContent="space-between"
            >
              <ConfirmDialog
                title={
                  confirmPaymentOrder === PaymentType.Momo
                    ? `Xác nhận thanh toán bằng Momo`
                    : confirmPaymentOrder === PaymentType.CreditPayment
                    ? `Xác nhận thanh toán bằng Chuyển khoản`
                    : `Xác nhận thanh toán bằng Tiền Mặt`
                }
                onClose={() => setConfirmPaymentOrder(null)}
                onOk={() => handleUpdatePaymentTypeOrder(confirmPaymentOrder ?? PaymentType.Cash)}
                open={Boolean(confirmPaymentOrder)}
              />
              {data?.status !== OrderStatus.Cancel && (
                <Box>
                  <Button
                    endIcon={<ClearIcon />}
                    variant="outlined"
                    size="large"
                    onClick={() => setOpenCancelDialog(true)}
                    color="error"
                  >
                    Hủy đơn
                  </Button>
                </Box>
              )}

              <Box>
                {data?.status === OrderStatus.New || data?.status === OrderStatus.Cancel ? (
                  <Button
                    endIcon={<ArrowForwardIcon />}
                    variant="contained"
                    size="large"
                    onClick={() => setConfirmStatusOrder(OrderStatus.Assigned)}
                  >
                    Nhận đơn
                  </Button>
                ) : data?.status === OrderStatus.Assigned ? (
                  <Button
                    endIcon={<ArrowForwardIcon />}
                    variant="contained"
                    size="large"
                    onClick={() => setConfirmStatusOrder(OrderStatus.PickedUp)}
                  >
                    Lấy hàng
                  </Button>
                ) : data?.status === OrderStatus.PickedUp ? (
                  <Button
                    endIcon={<CheckIcon />}
                    variant="contained"
                    size="large"
                    onClick={() => setConfirmStatusOrder(OrderStatus.Delivered)}
                  >
                    Hoàn thành
                  </Button>
                ) : (
                  <Box />
                )}
                <ConfirmDialog
                  title={
                    confirmStatusOrder === OrderStatus.Assigned
                      ? `Xác nhận tiếp nhận đơn hàng`
                      : confirmStatusOrder === OrderStatus.PickedUp
                      ? `Xác nhận lấy hàng từ nơi bán`
                      : confirmStatusOrder === OrderStatus.Delivered
                      ? `Xác nhận lấy hàng từ nơi bán`
                      : `Xác nhận hủy đơn hàng`
                  }
                  onClose={() => setConfirmStatusOrder(null)}
                  onOk={() => handleUpdateOrder(confirmStatusOrder ?? OrderStatus.New)}
                  open={Boolean(confirmStatusOrder)}
                />
                <FormProvider {...cancelForm}>
                  <InputDialog
                    onReset={() =>
                      cancelForm.reset({
                        cancelReason: '',
                      })
                    }
                    open={openCancelDialog}
                    onClose={() => setOpenCancelDialog(false)}
                    onOk={() => cancelForm.handleSubmit(handleCancleOrder)()}
                    title={'Xác nhận hủy đơn hàng'}
                    name={'cancelReason'}
                    content={'Lý do hủy đơn'}
                  />
                </FormProvider>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Page>
  );
};

export default OrderDetailPage;
