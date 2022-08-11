import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  AppBar,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Collapse,
  Container,
  Dialog,
  DialogContent,
  DialogContentText,
  Divider,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import ConfirmDialog from 'components/confirm-dialog/ConfirmDialog';
import Page from 'components/Page';
import ResoDescriptions, { ResoDescriptionColumnType } from 'components/ResoDescriptions';
import { sortBy, uniq } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router';
import { Order, OrderDetail, OrderStatus, PaymentType } from 'types/order';
import { Store } from 'types/store';
import request from 'utils/axios';
import { formatCurrency, getAreaStorage } from 'utils/utils';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PATH_DASHBOARD } from 'routes/paths';
export const ORDER_STATUS_OPTIONS = [
  {
    label: 'Tất cả',
    value: OrderStatus.All,
  },
  {
    label: 'Mới',
    value: OrderStatus.New,
    color: 'warning',
  },
  {
    label: 'Đã Nhận đơn',
    value: OrderStatus.Assigned,
    color: 'warning',
  },
  {
    label: 'Đã lấy đơn',
    value: OrderStatus.PickedUp,
    color: 'warning',
  },
  {
    label: 'Hoàn thành',
    value: OrderStatus.Delivered,
    color: 'success',
  },
  {
    label: 'Đã Huỷ',
    value: OrderStatus.Cancel,
    color: 'warning',
  },
];
export const PAYMENT_TYPE_OPTIONS = [
  {
    label: 'Tiền mặt',
    value: PaymentType.Cash,
    color: 'success',
  },
  {
    label: 'Chuyển khoản ngân hàng',
    value: PaymentType.CreditPayment,
    color: 'success',
  },
  {
    label: 'Momo',
    value: PaymentType.Momo,
    color: 'success',
  },
  {
    label: 'Đã thanh toán trước',
    value: PaymentType.Paid,
    color: 'success',
  },
];

const OrderDetailPage = () => {
  const [confirmPaymentOrder, setConfirmPaymentOrder] = useState<PaymentType | null>(null);
  const [confirmStatusOrder, setConfirmStatusOrder] = useState<OrderStatus | null>(null);
  const nav = useNavigate();
  const { orderId } = useParams();

  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
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
    // {
    //   title: 'Email',
    //   dataIndex: 'customerEmail',
    //   span: 2,
    // },
  ];
  // const orders = sortBy(data?.data.list_order_details ?? [], (o) => o.supplier_id);
  // const suppliers = uniq(orders.map((order) => order.supplier_store_name));
  // const [openCollapse, setOpenCollapse] = useState<string[]>([]);
  // const getNoteOfSupplier = (storeName: string) => {
  //   const values = orders.find((e) => e.supplier_store_name === storeName);
  //   return values?.supplier_notes![0]?.content;
  // };

  // const getOrdersOfSupplier = (storeName: string) =>
  //   orders.filter((e) => e.supplier_store_name === storeName);

  // const handlerExpand = (key: string) => {
  //   let idx = openCollapse?.findIndex((e) => e === key);
  //   if (idx != null && idx >= 0) {
  //     let state = [...openCollapse];
  //     state?.splice(idx, 1);
  //     setOpenCollapse(state ?? []);
  //   } else setOpenCollapse([...openCollapse, key]);
  // };

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

  // @ts-ignore
  return (
    <Page title={'Chi tiết đơn hàng'}>
      <Stack paddingTop={-2} spacing={1} sx={{ px: 2 }} alignItems="center" direction="row">
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
              column={2}
            />
            <ResoDescriptions
              title="Thông tin giao hàng"
              labelProps={{ fontWeight: 'bold' }}
              columns={customerColumns as any}
              datasource={data}
              column={2}
            />
            {/* <Box sx={{ pt: 2, pb: 10 }}>
                <Stack spacing={1} direction="column">
                  {suppliers.map((s) => (
                    <Stack key={s}>
                      <Card
                        variant="elevation"
                        onClick={() => handlerExpand(s)}
                        aria-controls="example-collapse-text"
                        sx={{
                          p: 1.5,
                          bgcolor: (theme) => theme.palette.background.paper,
                        }}
                      >
                        <Box>
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="h6">Đơn hàng cho {s}</Typography>
                            <KeyboardArrowDownIcon
                              style={{
                                transform: Boolean(openCollapse?.find((e) => e === s))
                                  ? 'rotate(00deg)'
                                  : 'rotate(180deg)',
                              }}
                            />
                          </Stack>
                        </Box>
                        <Collapse in={!Boolean(openCollapse?.find((e) => e === s))}>
                          <Box sx={{ mb: 1 }} id="example-collapse-text">
                            <Typography variant="subtitle1">
                              Ghi chú : {getNoteOfSupplier(s)}
                            </Typography>
                            <OrderListItem orderList={getOrdersOfSupplier(s)} />
                          </Box>
                        </Collapse>
                      </Card>
                    </Stack>
                  ))}
                </Stack>
              </Box> */}
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
                    : `Xác nhận thanh toán bằng Chuyển khoản`
                }
                onClose={() => setConfirmPaymentOrder(null)}
                onOk={() => handleUpdatePaymentTypeOrder(confirmPaymentOrder ?? PaymentType.Cash)}
                open={Boolean(confirmPaymentOrder)}
              />

              <Box>
                <Button
                  endIcon={<ClearIcon />}
                  variant="outlined"
                  size="large"
                  onClick={() => setConfirmStatusOrder(OrderStatus.Cancel)}
                  color="error"
                >
                  Hủy đơn
                </Button>
              </Box>
              <Box>
                {data?.status === OrderStatus.New ? (
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
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Page>
  );
};

export default OrderDetailPage;
