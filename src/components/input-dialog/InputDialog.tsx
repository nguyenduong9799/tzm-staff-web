import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { RHFTextField } from 'components/hook-form';

type Props = {
  open: boolean;
  onClose: () => any;
  onOk: () => Promise<void>;
  title: string;
  name: string;
  content: string;
  [key: string]: any;
};

const InputDialog = ({ open, title, name, content, onClose, onOk, ...others }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    setLoading(true);
    await onOk();
    onClose();
    setLoading(false);
  };
  if (!open) return <></>;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      {...others}
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <RHFTextField multiline size="medium" variant="outlined" name={name} label={content} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Huỷ</Button>
        <LoadingButton loading={loading} onClick={handleOk} autoFocus>
          Xác nhận
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default InputDialog;
