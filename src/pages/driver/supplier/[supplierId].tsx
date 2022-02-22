import { ArrowBack, OpenInFullOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CircularProgress,
  Container,
  Divider,
  Fab,
  Stack,
  Typography,
} from '@mui/material';
import EmptyContent from 'components/EmptyContent';
import Page from 'components/Page';
import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import SupplierOrderDetailDialog from 'sections/beaner/SupplierOrderDetailDialog';
import { Order, OrderResponse } from 'types/order';
import request from 'utils/axios';
import { formatCurrency } from 'utils/utils';

type Props = {};

const SupplierOrderList = (props: Props) => {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const { data, isLoading } = useQuery(['suppliers', supplierId, 'orders'], () =>
    request
      .get<{ data: OrderResponse[] }>(`/stores/150/suppliers/${supplierId}/orders`)
      .then((res) => res.data.data[0])
  );

  const orders = useMemo(() => data?.list_of_orders ?? [], [data]);
  const totalOrder = orders.length;
  const currentIdx = selectedOrderId ? orders.findIndex((o) => o.order_id === selectedOrderId) : -1;
  const totalFinalAmount = orders.reduce((total, order) => total + order.final_amount, 0);

  const totalProduct = (data?.list_of_orders ?? []).reduce(
    (total, order) => total + order.master_product_quantity,
    0
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

  return (
    <Page title="Danh sách đơn hàng nhà cung cấp">
      <Container>
        <Box textAlign="center">
          <Typography variant="h4" mb={2}>
            Danh sách đơn hàng
          </Typography>

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
        <Divider sx={{ my: 2 }} />
        <Box sx={{ position: 'fixed', zIndex: 99, left: 24, bottom: 24 }}>
          <Fab
            onClick={() => navigate(PATH_DASHBOARD.driver.suppliers.root)}
            size="medium"
            aria-label="add"
            color="secondary"
          >
            <ArrowBack />
          </Fab>
        </Box>
        {orders && totalOrder !== 0 && (
          <Box sx={{ position: 'fixed', zIndex: 99, right: 24, bottom: 24 }}>
            <Fab
              onClick={() => setSelectedOrderId(orders[0].order_id)}
              size="medium"
              aria-label="add"
            >
              <OpenInFullOutlined />
            </Fab>
          </Box>
        )}
        <Box>
          {isLoading ? (
            <Box textAlign="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <SupplierOrderDetailDialog
              current={currentIdx + 1}
              total={totalOrder}
              supplierId={Number(supplierId)}
              onPrevious={() => {
                console.log('orders[currentIdx - 1]', orders[currentIdx - 1]);
                if (currentIdx > 0) setSelectedOrderId(orders[currentIdx - 1].order_id);
              }}
              onNext={() => {
                if (currentIdx < totalOrder - 1) {
                  setSelectedOrderId(orders[currentIdx + 1].order_id);
                }
              }}
              orderId={selectedOrderId}
              onClose={() => setSelectedOrderId(null)}
            />
          )}
          {!isLoading && totalOrder === 0 && <EmptyContent title="Không có đơn hàng nào" />}
        </Box>
        <Box pb={6}>
          <Stack spacing={2}>{orders.map(renderOrder)}</Stack>
        </Box>
      </Container>
    </Page>
  );
};

export default SupplierOrderList;
