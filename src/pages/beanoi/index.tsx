import {
  Alert,
  Badge,
  BottomNavigation,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import Page from 'components/Page';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { Gift } from 'types/gift';
import { Store } from 'types/store';
import request from 'utils/axios';
import { getAreaStorage } from 'utils/utils';
import CartDetailDialog from './CartDetailDialog';
import Item from './Item';
type Props = {
  item?: Gift;
  handleAddToCart?: (clickedItem: Gift) => void;
};

const GiftList = (props: Props) => {
  const store: Store = getAreaStorage() ?? {};
  const storeId = store.id;
  const filterForm = useForm({
    defaultValues: {
      'time-slot': ['00:00:00', '23:30:00'],
    },
  });

  const filters = filterForm.watch();

  const { data, isLoading } = useQuery([storeId, 'gifts', filters], () =>
    request
      .get<{ data: Gift[] }>(`/stores/${storeId}/gifts`, {
        params: filters,
      })
      .then((res) => res.data.data)
  );

  const [cartItems, setCartItems] = useState([] as Gift[]);

  const getTotalItems = (items: Gift[]) => items.reduce((acc, item) => acc + item.amount, 0);

  const handleAddToCart = (clickedItem: Gift) => {
    setOpen(true);
    setCartItems((prev) => {
      const isItemInCart = prev.find((item) => item.product_id === clickedItem.product_id);

      if (isItemInCart) {
        return prev.map((item) =>
          item.product_id === clickedItem.product_id ? { ...item, amount: item.amount + 1 } : item
        );
      }

      return [...prev, { ...clickedItem, amount: 1 }];
    });
  };

  const handleRemoveFromCart = (product_id: number) => {
    setOpenCancel(true);
    setCartItems((prev) =>
      prev.reduce((acc, item) => {
        if (item.product_id === product_id) {
          if (item.amount === 1) return acc;
          return [...acc, { ...item, amount: item.amount - 1 }];
        } else {
          return [...acc, item];
        }
      }, [] as Gift[])
    );
  };
  const calculateTotal = (items: Gift[]) =>
    items.reduce((acc: number, item) => acc + item.amount * item.price, 0);

  const [open, setOpen] = React.useState(false);
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const [openCancel, setOpenCancel] = React.useState(false);
  const handleCloseCancle = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenCancel(false);
  };

  return (
    <Page title="Danh sách quà tặng">
      <Box textAlign="center" mb={4}>
        <Typography variant="h4">Danh sách quà tặng</Typography>
      </Box>
      <Container>
        <Stack direction="column" justifyContent="space-between" alignItems="center" spacing={2}>
          {isLoading && (
            <Box p={4} textAlign="center">
              <CircularProgress />
            </Box>
          )}
          {!isLoading && (
            <Grid container spacing={3}>
              {data?.map((item) => (
                <Grid item key={item.product_id} xs={12} sm={4}>
                  <Item
                    item={item}
                    addToCart={handleAddToCart}
                    removeFromCart={handleRemoveFromCart}
                  />
                </Grid>
              ))}
            </Grid>
          )}
          <Snackbar
            open={open}
            autoHideDuration={700}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Alert severity="success" sx={{ width: '100%', fontSize: '18px' }}>
              Đã thêm vào giỏ hàng!
            </Alert>
          </Snackbar>
          <Snackbar
            open={openCancel}
            autoHideDuration={700}
            onClose={handleCloseCancle}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Alert severity="error" sx={{ width: '100%', fontSize: '18px' }}>
              Đã xóa sản phẩm trong giỏ hàng!
            </Alert>
          </Snackbar>
          <Paper
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              borderTop: '2px solid #00AB55 ',
            }}
          >
            <BottomNavigation sx={{ height: '72px' }}>
              <Stack direction="row" alignItems="center" spacing={6} sx={{ pt: '8px' }}>
                <Box>
                  <Typography variant="h4">Tổng bean: {calculateTotal(cartItems)} Bean</Typography>
                  <Typography variant="body1">Số lượng quà: {getTotalItems(cartItems)}</Typography>
                </Box>
                <Box>
                  <Badge badgeContent={getTotalItems(cartItems)} color="primary">
                    <CartDetailDialog
                      cartItems={cartItems}
                      addToCart={handleAddToCart}
                      removeFromCart={handleRemoveFromCart}
                      handleAddToCart={handleAddToCart}
                      handleRemoveFromCart={handleRemoveFromCart}
                    />
                  </Badge>
                </Box>
              </Stack>
            </BottomNavigation>
          </Paper>
        </Stack>
      </Container>
    </Page>
  );
};
export default GiftList;
