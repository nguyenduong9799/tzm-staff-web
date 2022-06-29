import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { LoadingButton } from '@mui/lab';
import {
  AppBar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  Toolbar,
  Typography
} from '@mui/material';
import AutoCompleteField from 'components/hook-form/AutoCompleteField';
import Page from 'components/Page';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { Account } from 'types/account';
import { Gift } from 'types/gift';
import request from 'utils/axios';
import Cart from './Cart';
type Props = {
  onClose?: () => any;
  cartItems: Gift[];
  addToCart: (clickedItem: Gift) => void;
  removeFromCart: (id: number) => void;
  handleAddToCart: (clickedItem: Gift) => void;
  handleRemoveFromCart: (id: number) => void;
};

const CartDetailDialog = ({ cartItems, onClose, handleRemoveFromCart, handleAddToCart }: Props) => {
  const searchForm = useForm({
    defaultValues: {
      phone: null,
      page: 1,
      size: 10,
      searchPhone: null,
    },
  });

  const filters = searchForm.watch();
  const debounceFilters = filters;
  const { isLoading, data } = useQuery(['phone', debounceFilters], () =>
    request
      .get<{ data: Account[] }>(`/admin/customers`, {
        params: { ...debounceFilters },
      })
      .then((res) => res.data)
  );

  const [open, setOpen] = React.useState(false);

  const [openDialog, setOpenDialog] = React.useState(false);
  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const { enqueueSnackbar } = useSnackbar();

  const handleCreateOrder = () => {
    const { phone } = searchForm.getValues();
    if (!phone) {
      enqueueSnackbar('Bạn chưa nhập số điện thoại', { variant: 'error' });
      return;
    }
    if (!cartItems.length) {
      enqueueSnackbar('Bạn chưa chọn sản phẩm', { variant: 'error' });
      return;
    }
    const defaultValues: any = {
      destination_location_id: 23,
      payment: 1,
      vouchers: [],
      products_list: [
        {
          master_product: '',
          quantity: 1,

          product_childs: [
            {
              product_in_menu_id: '',
              quantity: '',
            },
          ],
        },
      ],
      customer_info: {
        name: '',
        phone: '',
        email: 'baophamtranle@gmail.com',
      },
    };

    defaultValues.customer_info.phone = phone;
    defaultValues.products_list = cartItems?.map((item, index) => ({
      master_product: item.product_in_menu_id,
      product_id: item.product_id,
      quantity: item.amount,
    }));

    request
      .post(`/orders`, defaultValues)
      .then(() => {
        enqueueSnackbar('Cập nhật thành công', { variant: 'success' });
        return true;
      })
      .catch((error) => {
        enqueueSnackbar(error?.message ?? 'Có lỗi xảy ra! Vui lòng thử lại.', { variant: 'error' });
        return false;
      });
  };
  const calculateTotal = (items: Gift[]) =>
    items.reduce((acc: number, item) => acc + item.amount * item.price, 0);
  const getTotalItems = (items: Gift[]) => items.reduce((acc, item) => acc + item.amount, 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userPhoneOpts: string[] = data?.data.map((account) => account.phone) || [];
  const userFormatPhoneOpts = userPhoneOpts.map((item) => item.replace(/^\+84/, '0'));

  return (
    <Page title="">
      <Container>
        <Box sx={{ width: '55px' }}>
          <IconButton onClick={handleClickOpen} size="large" color="primary">
            <ShoppingCartOutlinedIcon sx={{ width: '100%', height: '100%' }} />
          </IconButton>
        </Box>
        <Dialog
          maxWidth="lg"
          fullScreen
          open={open}
          onClose={handleClose}
          scroll="body"
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <AppBar position="fixed">
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <CancelOutlinedIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Đơn hàng của bạn
              </Typography>
            </Toolbar>
          </AppBar>
          <Box>
            <DialogContent sx={{ my: 4, pb: 4 }}>
              <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
                <Stack spacing={2} direction="column" sx={{ pb: 7, pt: 3 }}>
                  <Typography variant="h5">Tài khoản người dùng</Typography>
                  <Box>
                    <FormProvider {...searchForm}>
                      <AutoCompleteField
                        options={userFormatPhoneOpts}
                        name="phone"
                        label="Số điện thoại"
                        loading={isLoading}
                        TextFieldProps={{
                          onChange: (e: any) => searchForm.setValue('phone', e.target.value),
                        }}
                      />
                    </FormProvider>
                  </Box>
                  <Divider sx={{ borderTop: '5px solid #D8D8D8 ' }} />
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Các món trong giỏ</Typography>
                    <Typography variant="h6" sx={{ color: '#FFBC5B' }}>
                      {getTotalItems(cartItems)} món
                    </Typography>
                  </Stack>

                  <Cart
                    cartItems={cartItems}
                    addToCart={handleAddToCart}
                    removeFromCart={handleRemoveFromCart}
                  />
                </Stack>
              </DialogContentText>
            </DialogContent>
          </Box>
          <Paper
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              borderTop: '2px solid #00AB55 ',
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
              sx={{ pl: 2, pr: 2, pb: 1.5, pt: 1.3 }}
            >
              <Stack direction="column" justifyContent="center" alignItems="center">
                <Typography>Tổng bean</Typography>
                <Typography variant="h3">{calculateTotal(cartItems)} Bean</Typography>
              </Stack>
              <Button
                sx={{ height: '50px', width: '200px', borderRadius: '8px' }}
                variant="contained"
              >
                <Typography onClick={handleClickOpenDialog} variant="h4">
                  Thanh toán
                </Typography>
              </Button>
              <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="responsive-dialog-title"
              >
                <DialogTitle>
                  <Typography variant="h5">Thanh toán</Typography>
                </DialogTitle>
                <DialogActions>
                  <Button
                    sx={{ height: '50px', width: '200px', borderRadius: '8px' }}
                    type="submit"
                    variant="contained"
                    color="error"
                    onClick={handleCloseDialog}
                  >
                    Hủy
                  </Button>
                  <LoadingButton
                    sx={{ height: '50px', width: '200px', borderRadius: '8px' }}
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    onClick={() => handleCreateOrder()}
                  >
                    <Typography variant="h6">Chốt đơn 👌</Typography>
                  </LoadingButton>
                </DialogActions>
              </Dialog>
            </Stack>
          </Paper>
        </Dialog>
      </Container>
    </Page>
  );
};

export default CartDetailDialog;
