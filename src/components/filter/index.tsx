import { Button, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material';
import { RHFRadioGroup, RHFSelect } from 'components/hook-form';
import RHFDateRangePickerField from 'components/hook-form/RHFDateRangePickerField';
import Iconify from 'components/Iconify';
import Scrollbar from 'components/Scrollbar';
import { useQuery } from 'react-query';
import { Location } from 'types/location';
import { paymentList, statusList } from 'types/order';
import { Store, TimeSlot } from 'types/store';
import request from 'utils/axios';
import { getAreaStorage } from 'utils/utils';

type Props = {
  open?: boolean;
  onClose: () => void;
  onReset: () => void;
};

const OrderFilter = ({ open, onClose, onReset }: Props) => {
  const store: Store = getAreaStorage() ?? {};
  const storeId = store.id;
  // const { data: destinations } = useQuery(['stores', 'destinations'], () =>
  //   request.get<{ data: Location[] }>(`/stores/${storeId}/locations`).then((res) => res.data.data)
  // );

  return (
    <Drawer
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      anchor="right"
      open={open}
      onClose={onClose}
    >
      <Stack sx={{ width: 260, height: '100vh' }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 1, py: 2 }}
        >
          <Typography variant="subtitle1">Bộ lọc</Typography>
          <IconButton onClick={onClose}>
            <Iconify icon={'eva:close-fill'} width={20} height={20} />
          </IconButton>
        </Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Scrollbar sx={{ flexGrow: 1 }}>
          <Stack spacing={2} sx={{ p: 2 }}>
            <Stack spacing={1.5}>
              <Typography variant="h5">Ngày</Typography>
            </Stack>
            <RHFDateRangePickerField name="from-date" />
            <Stack spacing={1.5}>
              <Typography variant="h5">Trạng Thái</Typography>
            </Stack>
            <RHFSelect name="order-status" placeholder="Trạng Thái">
              {statusList.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </RHFSelect>
            <Stack spacing={1.5}>
              <Typography variant="h5">Phuơng thức thanh toán</Typography>
            </Stack>
            <RHFSelect name="payment-type" placeholder="Phương Thức Thanh Toán">
              {paymentList.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </RHFSelect>
            <Stack spacing={1.5}>
              <Typography variant="h5">Khung giờ</Typography>
            </Stack>
            <RHFSelect name="time-slot" placeholder="Khung giờ">
              <option value="" label="Tất cả" />
              {store.time_slots?.map((option: TimeSlot) => (
                <option key={option.from.toString()} value={option.to.toString()}>
                  {option.from.toString()} - {option.to.toString()}
                </option>
              ))}
            </RHFSelect>
            <Stack spacing={1.5}>
              <Typography variant="h5">Địa điểm giao</Typography>
            </Stack>
            {/* {destinations?.map((d: Location) => (
              <Stack key={d.destination_id}>
                <Typography variant="subtitle2">{d.address}</Typography>
                <RHFRadioGroup
                  name="destination-location-id"
                  options={d.locations.map((l) => l.destination_location_id.toString())}
                  getOptionLabel={d.locations.map((l) => l.name)}
                />
              </Stack>
            ))} */}
          </Stack>
        </Scrollbar>
        <Stack spacing={1} p={1} direction="row">
          <Button onClick={onReset} fullWidth variant="outlined">
            Xoá bộ lọc
          </Button>
          {/* <Button fullWidth variant="contained">
            Áp dụng
          </Button> */}
        </Stack>
      </Stack>
    </Drawer>
  );
};

export default OrderFilter;
