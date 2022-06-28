import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { RHFTextField } from 'components/hook-form';
import Page from 'components/Page';
import useDebounce from 'hooks/useDebounce';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { Account } from 'types/account';
import request from 'utils/axios';
import * as Yup from 'yup';

type Props = {};
const COIN_VALUE = [10, 20, 50, 100, 200, 500];

const AccountSearching = (props: Props) => {
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const AddCoinSchema = Yup.object().shape({
    amount: Yup.number()
      .required('Bạn phải nhập số xu')
      .typeError('Số xu chưa hợp lệ')
      .min(1, 'Nạp tối thiểu 1 xu.'),
  });
  const searchForm = useForm({
    defaultValues: {
      phone: null,
      page: 1,
      size: 50,
    },
  });

  const addCoinForm = useForm<any>({
    resolver: yupResolver(AddCoinSchema),
    defaultValues: {
      amount: 0,
      note: '',
    },
  });
  const currentAmount = addCoinForm.watch('amount');

  const filters = searchForm.watch();
  const debounceFilters = useDebounce(filters, 500);

  const { data, refetch: fetchAccounts } = useQuery(['phone', debounceFilters], () =>
    request
      .get<{ data: Account[] }>(`/admin/customers`, { params: debounceFilters })
      .then((res) => res.data)
  );
  // console.log(data);

  const renderAccount = (account: Account) => (
    <Card
      elevation={1}
      key={account.id}
      sx={{
        bgcolor: (theme) => theme.palette.background.paper,
      }}
    >
      <CardActionArea onClick={() => setSelectedAccountId(account.id)}>
        <Box sx={{ px: 2, pt: 1 }}>
          <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
            <Typography variant="h6"> {account.name}</Typography>
            <Typography variant="h6">{account.phone}</Typography>
          </Stack>
        </Box>
      </CardActionArea>
      <CardActions>
        <Button onClick={() => setSelectedAccountId(account.id)} size="small" color="primary">
          Nạp xu
        </Button>
      </CardActions>
    </Card>
  );

  const handleClickCoinValue = (value: number) => {
    addCoinForm.setValue('amount', value);
  };

  const handleAddCoin = (value: any) => {
    setIsSubmitting(true);
    console.log(value);
    request
      .put(`/admin/customers/${selectedAccountId}/credit-account`, value)
      .then(() => {
        setSelectedAccountId(null);
        setIsSubmitting(false);
        enqueueSnackbar('Cập nhật thành công', { variant: 'success' });
        fetchAccounts();
        return true;
      })
      .catch((error) => {
        enqueueSnackbar(error?.message ?? 'Có lỗi xảy ra! Vui lòng thử lại.', { variant: 'error' });
        return false;
      });
  };

  return (
    <Page title="Danh sách tài khoản">
      <Container>
        <Box textAlign="center" mb={4}>
          <Typography mb={2} variant="h4">
            Tài khoản người dùng
          </Typography>
        </Box>
        <Box>
          <Dialog
            open={Boolean(selectedAccountId)}
            onClose={() => setSelectedAccountId(null)}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle>
              <Typography variant="h5">Nạp xu</Typography>
            </DialogTitle>
            <DialogContent dividers>
              <FormProvider {...addCoinForm}>
                <Box>
                  <Stack
                    direction="column"
                    spacing={3}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <RHFTextField
                      size="medium"
                      variant="outlined"
                      name="amount"
                      label="Số xu cần nạp ( 1 xu = 1000đ)"
                    />
                    <Box>
                      <Grid spacing={2} container rowSpacing={1}>
                        {COIN_VALUE.map((value) => (
                          <Grid key={value} item xs={4}>
                            <Chip
                              sx={{ width: '100%' }}
                              label={`${value} xu`}
                              variant={currentAmount == value ? 'filled' : 'outlined'}
                              color="primary"
                              onClick={() => handleClickCoinValue(value)}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>

                    <RHFTextField size="medium" variant="outlined" name="note" label="Ghi chú" />
                  </Stack>
                </Box>
              </FormProvider>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedAccountId(null)}>Cancel</Button>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                onClick={() => addCoinForm.handleSubmit(handleAddCoin)()}
              >
                Nạp
              </LoadingButton>
            </DialogActions>
          </Dialog>
          <Box mb={2}>
            <FormProvider {...searchForm}>
              <RHFTextField
                size="medium"
                variant="outlined"
                name="phone"
                label="Tìm theo số điện thoại"
              />
            </FormProvider>
          </Box>
        </Box>
        <Box>
          <Stack spacing={2}>{data?.data.map(renderAccount)}</Stack>
        </Box>
      </Container>
    </Page>
  );
};

export default AccountSearching;
