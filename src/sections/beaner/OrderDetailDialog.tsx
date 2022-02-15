import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Stack,
  Divider,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import ResoDescriptions, { ResoDescriptionColumnType } from 'components/ResoDescriptions';
import { Order, OrderDetail, OrderItem, OrderStatus } from 'types/order';
import { useQuery } from 'react-query';
import request from 'utils/axios';
import { CircularProgress } from '@mui/material';
import { fCurrency } from 'utils/formatNumber';
import ConfirmDialog from 'components/confirm-dialog/ConfirmDialog';

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

  const renderOrderItem = (orderItem: OrderItem, isEndItem?: boolean) => (
    <Stack
      mb={2}
      pb={2}
      direction="row"
      spacing={1}
      sx={{ borderBottom: !isEndItem ? '1px solid #ccc' : 'none' }}
    >
      <Box width="40px">
        <Typography variant="caption">{orderItem.quantity}x</Typography>
      </Box>
      <Box flex={1}>
        <Typography variant="body1">{orderItem.product_name}</Typography>
        <Stack spacing={0.5}>
          {orderItem.list_of_childs.map((childItem) => (
            <Typography variant="body2" key={childItem.order_detail_id}>
              {childItem.quantity} x {childItem.product_name}
            </Typography>
          ))}
        </Stack>
      </Box>
      <Box width="90px" textAlign="right">
        <Typography>{fCurrency(orderItem.final_amount)}</Typography>
      </Box>
    </Stack>
  );

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
            Đơn hàng US001
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
          <DialogContent sx={{ my: 4 }}>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              <ResoDescriptions
                title="Thông tin"
                labelProps={{ fontWeight: 'bold' }}
                columns={orderColumns as any}
                datasource={data?.data}
                column={2}
              />
              <Box py={4}>
                <Typography mb={2} variant="h5">
                  Đơn hàng
                </Typography>
                {data?.data.list_order_details.map((order, idx) =>
                  renderOrderItem(order, idx === data?.data.list_order_details.length - 1)
                )}
              </Box>
            </DialogContentText>
          </DialogContent>
        )}
        <Box
          position="absolute"
          width="100%"
          sx={{ bottom: 0, borderTop: '1px solid #ccc', textAlign: 'right' }}
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
