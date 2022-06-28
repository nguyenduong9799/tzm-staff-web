import { ArrowBack, FilterList, OpenInFullOutlined } from '@mui/icons-material';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneAndroidOutlinedIcon from '@mui/icons-material/PhoneAndroidOutlined';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Fab,
  Stack,
  Typography,
} from '@mui/material';
import EmptyContent from 'components/EmptyContent';
import OrderFilter from 'components/filter';
import Page from 'components/Page';
import React, { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import SupplierOrderDetailDialog from 'sections/beaner/SupplierOrderDetailDialog';
import { Order, OrderResponse, OrderStatus } from 'types/order';
import { Store } from 'types/store';
import request from 'utils/axios';
import { formatCurrency, getAreaStorage } from 'utils/utils';

type Props = {};

const SupplierOrderList = (props: Props) => {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const store: Store = getAreaStorage() ?? {};
  const storeId = store.id;

  const [openFilter, setOpenFilter] = useState(false);

  const filterForm = useForm({
    defaultValues: {
      'destination-location-id': null,
      'order-status': OrderStatus.NEW,
      'time-slot': null,
      'from-date': null,
      'to-date': null,
      'payment-type': null,
    },
  });

  const transformFilters = (filters: any = {}) => {
    const transformedFilters = { ...filters } as any;
    if (filters['from-date'] != null) {
      transformedFilters['from-date'] = filters['from-date'][0];
      transformedFilters['to-date'] = filters['from-date'][1];
      transformedFilters['from-date'] = transformedFilters['from-date'].toISOString();
    }
    if (transformedFilters['to-date'] != null) {
      transformedFilters['to-date'] = transformedFilters['to-date'].toISOString();
    }
    return transformedFilters;
  };

  const filters = filterForm.watch();

  const { data, isLoading } = useQuery(
    [storeId, 'suppliers', supplierId, 'orders', transformFilters(filters)],
    () =>
      request
        .get<{ data: OrderResponse[] }>(`/stores/${storeId}/suppliers/${supplierId}/orders`, {
          params: transformFilters(filters),
        })
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

  const countTotalFilter = Object.values(filters).filter((v) => v != null).length;

  const renderOrder = (order: Order) => (
    <Card key={order.order_id}>
      <CardActionArea onClick={() => setSelectedOrderId(order.order_id)}>
        <Box sx={{ px: 2, pt: 1 }}>
          <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6">{order.invoice_id}</Typography>
              <Typography variant="h6"> {order.customer.name}</Typography>
              <Typography variant="h6">{order.master_product_quantity} món</Typography>
            </Box>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <PhoneAndroidOutlinedIcon sx={{ color: 'warning.main' }} fontSize="small" />
                <Typography>{order.customer.phone_number}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationOnOutlinedIcon sx={{ color: 'warning.main' }} fontSize="small" />
                <Typography>{order.delivery_address}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <AccessTimeOutlinedIcon sx={{ color: 'warning.main' }} fontSize="small" />
                <Typography>{order.time_slot}</Typography>
              </Stack>
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

  return (
    <Page title="Danh sách đơn hàng nhà cung cấp">
      <Container>
        <Box textAlign="center">
          <Typography variant="h4" mb={2}>
            Danh sách đơn hàng
          </Typography>

          <Stack direction="row" spacing={1}>
            <Card sx={{ p: 1, width: '50%', mx: 'auto', textAlign: 'left' }}>
              <Stack direction="column" justifyContent="space-between">
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Typography variant="body1">Tổng đơn:</Typography>
                  <Typography fontWeight="bold">{totalOrder ?? 0} </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Typography variant="body1">Tổng phần:</Typography>
                  <Typography fontWeight="bold">{totalProduct ?? 0} </Typography>
                </Stack>
              </Stack>
            </Card>
            <Card sx={{ p: 1, width: '50%', mx: 'auto', textAlign: 'center' }}>
              <Typography>Tổng tiền: </Typography>
              <Typography fontWeight="bold">{formatCurrency(totalFinalAmount)}</Typography>
            </Card>
          </Stack>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" justifyContent="end">
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
        <FormProvider {...filterForm}>
          <OrderFilter
            onReset={() =>
              filterForm.reset({
                'destination-location-id': null,
                'order-status': OrderStatus.NEW,
                'time-slot': null,
                'from-date': null,
                'to-date': null,
                'payment-type': null,
              })
            }
            open={openFilter}
            onClose={() => setOpenFilter(false)}
          />
        </FormProvider>
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
              onNext={() => {
                console.log('orders[currentIdx - 1]', orders[currentIdx - 1]);
                if (currentIdx > 0) setSelectedOrderId(orders[currentIdx - 1].order_id);
              }}
              onPrevious={() => {
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
