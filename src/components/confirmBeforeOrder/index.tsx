import { LoadingButton } from '@mui/lab';
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

type Props = {
  open: boolean;
  onConfirm: (isNotify: boolean) => Promise<any>;
  onClose: () => void;
};

const CHECK_ITEMS = ['Số đơn', 'Muỗng canh, nước mắm', 'Tiền thối', 'Nụ cười thật tươi nè <3'];

const ConfirmOrderModal = ({ open, onConfirm, onClose }: Props) => {
  const [checked, setChecked] = useState<string[]>([]);
  const [isConfirm, setIsConfirm] = useState(false);
  const isConfirmedAll = checked.length === CHECK_ITEMS.length;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Typography variant="h5">BeanOi xác nhận lại nhá</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <FormGroup>
          {CHECK_ITEMS.map((item) => (
            <FormControlLabel
              key={item}
              control={
                <Checkbox
                  onChange={() => setChecked((prev) => [...prev, item])}
                  checked={checked.find((v) => v === item) != null}
                />
              }
              label={item}
            />
          ))}
        </FormGroup>
        <Stack direction="row" spacing={1} sx={{ my: 2 }}>
          {!isConfirmedAll ? (
            <Typography variant="h6" sx={{ color: 'warning.main' }}>
              Vui lòng kiểm tra tất cả nhé Bean!
            </Typography>
          ) : (
            <>
              <Button onClick={() => onConfirm(false)} fullWidth variant="outlined">
                Xác nhận không gửi thông báo
              </Button>
              <LoadingButton
                loading={isConfirm}
                onClick={async () => {
                  setIsConfirm(true);
                  await onConfirm(true);
                  await setIsConfirm(false);
                }}
                fullWidth
                variant="contained"
              >
                Xác nhận và gửi thông báo
              </LoadingButton>
            </>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmOrderModal;
