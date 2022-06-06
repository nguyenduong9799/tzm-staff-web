import { Button, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material';
import { RHFRadioGroup } from 'components/hook-form';
import RadioGroupField from 'components/hook-form/RadioGroupField';
import RHFDateRangePickerField from 'components/hook-form/RHFDateRangePickerField';
import Iconify from 'components/Iconify';
import Scrollbar from 'components/Scrollbar';
import React from 'react';
import { useQuery } from 'react-query';
import { Location } from 'types/location';
import { paymentList } from 'types/order';
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
  const { data: destinations } = useQuery(['stores', 'destinations'], () =>
    request.get<{ data: Location[] }>(`/stores/${storeId}/locations`).then((res) => res.data.data)
  );
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
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="h6">Địa điểm giao</Typography>
            </Stack>
            {destinations?.map((d: Location) => (
              <Stack key={d.destination_id}>
                <Typography variant="subtitle2">{d.address}</Typography>
                <RHFRadioGroup
                  name="destination-location-id"
                  options={d.locations.map((l) => l.destination_location_id.toString())}
                  getOptionLabel={d.locations.map((l) => l.name)}
                />
              </Stack>
            ))}
            <Stack spacing={1.5}>
              <Typography variant="h6">Khung giờ</Typography>
            </Stack>
            <RHFRadioGroup
              name="time-slot"
              options={store.time_slots?.map(
                (d: TimeSlot) => `${d.from.toString()};${d.to.toString()}`
              )}
              getOptionLabel={store.time_slots?.map(
                (d: TimeSlot) => `Từ ${d.from.toString()} - ${d.to.toString()}`
              )}
            />
            <Stack spacing={1.5}>
              <Typography variant="h6">Ngày</Typography>
            </Stack>
            <RHFDateRangePickerField name="from-date" />
            <Stack spacing={1.5}>
              <Typography variant="h6">Phuơng thức thanh toán</Typography>
            </Stack>
            <RadioGroupField options={paymentList} name="payment-type" />
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
