import CloseIcon from '@mui/icons-material/Close';
import {
  AppBar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import ResoDescriptions, { ResoDescriptionColumnType } from 'components/ResoDescriptions';
import { sortBy, uniq } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Order, OrderDetail, OrderItem, OrderStatus } from 'types/order';
import request from 'utils/axios';
import { fCurrency } from 'utils/formatNumber';
import OrderItemSummary from './OrderItemSummary';

type Props = {
  orderId?: number | null;
  onClose: () => any;
  onUpdate: () => any;
};

export const ORDER_STATUS_OPTONS = [
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
];
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const OrderDetailDialog = ({ orderId, onClose, onUpdate }: Props) => {
  const [open, setOpen] = useState(Boolean(orderId));
  const theme = useTheme();
  const { data, isLoading } = useQuery(
    ['orders', orderId],
    () =>
      request.get<{ data: OrderDetail }>(`/stores/150/orders/${orderId}`).then((res) => res.data),
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
      title: 'Trạng thái',
      dataIndex: 'order_status',
      valueEnum: ORDER_STATUS_OPTONS,
    },
    {
      title: 'Thời gian',
      dataIndex: 'check_in_date',
      valueType: 'datetime',
      span: 2,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'final_amount',
      valueType: 'money',
    },
  ];
  const orders = sortBy(data?.data.list_order_details ?? [], (o) => o.supplier_id);
  const suppliers = uniq(orders.map((order) => order.supplier_store_name));

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
        </Toolbar>
      </AppBar>
      <Box pt={4}>
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
              <Box my={2}>
                <Stack spacing={1} direction="row">
                  {suppliers.map((s) => (
                    <Chip key={s} label={s} />
                  ))}
                </Stack>
              </Box>
              <Box>
                <Typography mb={2} variant="h5">
                  Đơn hàng
                </Typography>
                {orders.map((order, idx) => (
                  <OrderItemSummary
                    orderItem={order}
                    key={order.order_detail_id}
                    isEndItem={idx === orders.length - 1}
                  />
                ))}
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
          <Stack py={2} px={1} direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={onClose} color="inherit">
              Quay lại
            </Button>
            {data?.data.order_status === OrderStatus.NEW && (
              <Button onClick={onUpdate}>Cập nhật</Button>
            )}
          </Stack>
        </Box>
      </Box>
    </Dialog>
  );
};

export default OrderDetailDialog;
