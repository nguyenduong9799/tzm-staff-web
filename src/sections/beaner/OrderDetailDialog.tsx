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
import ResoDescriptions, { ResoDescriptionColumnType } from 'components/ResoDescriptions';
import { sortBy, uniq } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Order, OrderDetail, OrderStatus, PaymentType } from 'types/order';
import { Store } from 'types/store';
import request from 'utils/axios';
import { formatCurrency, getAreaStorage } from 'utils/utils';
import OrderListItem from './OrderListItem';

type Props = {
  orderId?: number | null;
  onClose?: () => any;
  onUpdate?: () => any;
  current?: number;
  onNext?: () => any;
  onPrevious?: () => any;
  onDelete?: () => any;
  total?: number;
};

export const ORDER_STATUS_OPTIONS = [
  {
    label: 'Tất cả',
    value: '',
  },
  {
    label: 'Mới',
    value: OrderStatus.NEW,
    color: 'warning',
  },
  {
    label: 'Hoàn thành',
    value: OrderStatus.DONE,
    color: 'success',
  },
  {
    label: 'Huỷ',
    value: OrderStatus.CANCLE,
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
    label: 'Xu',
    value: PaymentType.CreditPayment,
    color: 'success',
  },
  {
    label: 'Momo',
    value: PaymentType.Momo,
    color: 'success',
  },
];
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const OrderDetailDialog = ({
  orderId,
  onClose,
  onUpdate,
  onPrevious,
  onNext,
  total,
  current,
  onDelete,
}: Props) => {
  const [open, setOpen] = useState(Boolean(orderId));
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const store: Store = getAreaStorage() ?? {};
  const storeId = store.id;
  const { data, isLoading, refetch } = useQuery(
    [storeId, 'orders', orderId],
    () =>
      request
        .get<{ data: OrderDetail }>(`/stores/${storeId}/orders/${orderId}`)
        .then((res) => res.data),
    {
      enabled: Boolean(orderId),
    }
  );

  useEffect(() => {
    setOpen(Boolean(orderId));
  }, [orderId]);

  const orderColumns: ResoDescriptionColumnType<Order>[] = [
    {
      title: 'Số sản phẩm',
      dataIndex: 'master_product_quantity',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'final_amount',
      valueType: 'money',
      render: (_, { final_amount, payment_type }) => (
        <Typography variant="subtitle2" fontWeight="bold">
          {payment_type == PaymentType.Cash || payment_type == PaymentType.Momo
            ? formatCurrency(final_amount)
            : `${final_amount} xu`}
        </Typography>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'order_status',
      valueEnum: ORDER_STATUS_OPTIONS,
      span: 2,
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'payment_type',
      valueEnum: PAYMENT_TYPE_OPTIONS,
      span: 2,
    },
    {
      title: 'Địa chỉ giao',
      dataIndex: 'delivery_address',
      span: 2,
    },
    {
      title: 'Thời gian',
      dataIndex: 'check_in_date',
      valueType: 'datetime',
      span: 2,
    },
  ];
  const customerColumns: ResoDescriptionColumnType<Order>[] = [
    {
      title: 'Tên khách hàng',
      dataIndex: ['customer', 'name'],
      span: 2,
    },
    {
      title: 'SDT',
      dataIndex: ['customer', 'phone_number'],
      render: (phone) => <a href={`tel: ${phone}`}>{phone}</a>,
      span: 2,
    },
  ];
  const orders = sortBy(data?.data.list_order_details ?? [], (o) => o.supplier_id);
  const suppliers = uniq(orders.map((order) => order.supplier_store_name));
  const [openCollapse, setOpenCollapse] = useState<string[]>([]);
  const getNoteOfSupplier = (storeName: string) => {
    const values = orders.find((e) => e.supplier_store_name === storeName);
    return values?.supplier_notes![0]?.content;
  };

  const getOrdersOfSupplier = (storeName: string) =>
    orders.filter((e) => e.supplier_store_name === storeName);

  const handlerExpand = (key: string) => {
    let idx = openCollapse?.findIndex((e) => e === key);
    if (idx != null && idx >= 0) {
      let state = [...openCollapse];
      state?.splice(idx, 1);
      setOpenCollapse(state ?? []);
    } else setOpenCollapse([...openCollapse, key]);
  };

  const handleUpdatePaymentTypeOrder = () =>
    request
      .put(`/orders/${orderId}/payment`, { payment_type: PaymentType.Momo })
      .then(() => {
        enqueueSnackbar('Cập nhật thành công', { variant: 'success' });
        refetch();
        return true;
      })
      .catch((error) => {
        enqueueSnackbar(error?.message ?? 'Có lỗi xảy ra! Vui lòng thử lại.', { variant: 'error' });
        return false;
      });

  // @ts-ignore
  return (
    <Dialog
      maxWidth="lg"
      fullScreen
      open={open}
      scroll="body"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      TransitionComponent={Transition}
    >
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Đơn hàng {data?.data.invoice_id}
          </Typography>
          {data?.data.payment_type == PaymentType.CreditPayment ? (
            <Chip color={'primary'} variant={'outlined'} label={'Đã Thanh toán'} />
          ) : (
            <Chip color={'primary'} variant={'outlined'} label={'Chưa Thanh toán'} />
          )}
        </Toolbar>
      </AppBar>
      <Box pt={2}>
        {isLoading && (
          <Box p={4} textAlign="center">
            <CircularProgress />
          </Box>
        )}
        {!isLoading && (
          <DialogContent sx={{ my: 4, pb: 4 }}>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              <ResoDescriptions
                title="Thông tin"
                labelProps={{ fontWeight: 'bold' }}
                columns={orderColumns as any}
                datasource={data?.data}
                column={2}
              />
              <ResoDescriptions
                title="Khách hàng"
                labelProps={{ fontWeight: 'bold' }}
                columns={customerColumns as any}
                datasource={data?.data}
                column={2}
              />
              <Box sx={{ pt: 2 }}>
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
              </Box>
            </DialogContentText>
          </DialogContent>
        )}
        <Box
          position="fixed"
          width="100%"
          sx={{
            left: 0,
            bottom: 0,
            borderTop: '1px solid #cccccc6f',
            textAlign: 'right',
            zIndex: 10,
            bgcolor: theme.palette.background.default,
          }}
        >
          <Stack>
            <Stack py={2} px={1} direction="row" spacing={2} justifyContent="space-between">
              <ConfirmDialog
                title={`Xác nhận thanh toán bằng momo`}
                onClose={() => {
                  setOpenPaymentDialog(false);
                }}
                onOk={handleUpdatePaymentTypeOrder}
                open={openPaymentDialog}
              />
              <Box>
                {data?.data.order_status === OrderStatus.NEW && (
                  <Button onClick={onDelete} color="error">
                    Hủy đơn
                  </Button>
                )}
              </Box>
              <Box>
                {data?.data.payment_type === PaymentType.Cash &&
                  data?.data.order_status === OrderStatus.NEW && (
                    <Button onClick={() => setOpenPaymentDialog(true)}>Thanh toán Momo</Button>
                  )}
                {data?.data.order_status === OrderStatus.NEW && (
                  <Button onClick={onUpdate}>Cập nhật</Button>
                )}
              </Box>
            </Stack>
            <Stack
              py={2}
              px={1}
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
              paddingTop={-10}
            >
              <Button onClick={onNext} color="inherit">
                Trước
              </Button>
              <Box textAlign="center" mx="auto">
                <Typography>
                  {current} / {total}
                </Typography>
              </Box>
              <Button onClick={onPrevious} color="inherit">
                Tiếp theo
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Dialog>
  );
};

export default OrderDetailDialog;
