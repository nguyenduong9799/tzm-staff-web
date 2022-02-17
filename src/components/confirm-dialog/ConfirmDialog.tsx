import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React, { useState } from 'react';
import { LoadingButton } from '@mui/lab';

type Props = {
  open: boolean;
  onClose: () => any;
  onOk: () => Promise<boolean>;
  title: string;
  [key: string]: any;
};

const ConfirmDialog = ({ open, title, onClose, onOk, ...others }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    setLoading(true);
    const result = await onOk();
    if (result) {
      onClose();
    }
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
      <DialogActions>
        <Button onClick={onClose}>Huỷ</Button>
        <LoadingButton loading={loading} onClick={handleOk} autoFocus>
          Xác nhận
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
