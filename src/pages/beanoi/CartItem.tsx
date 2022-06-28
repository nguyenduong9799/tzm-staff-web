import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import React from 'react';
import { Gift } from 'types/gift';
type Props = {
  item: Gift;
  addToCart: (clickedItem: Gift) => void;
  removeFromCart: (id: number) => void;
};

const CartItem: React.FC<Props> = ({ item, addToCart, removeFromCart }) => (
  <Stack direction={'row'} spacing={2}>
    <Box flex={3}>
      <Divider sx={{ color: '#D8D8D8' }} />
      <Stack direction={'column'} justifyContent="flex-start" spacing={0.1}>
        <Box flex={1}>
          <Typography variant="h5">{item.product_name}</Typography>
        </Box>
        <Box flex={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
            <Box flex={3}>
              <Typography variant="subtitle2">{item.price * item.amount} bean</Typography>
            </Box>
            <Box flex={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ width: '30px' }}>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => removeFromCart(item.product_id)}
                  >
                    <RemoveCircleOutlineIcon sx={{ width: '100%', height: '100%' }} />
                  </IconButton>
                </Box>
                <Typography variant="h4">{item.amount}</Typography>
                <Box sx={{ width: '30px' }}>
                  <IconButton size="small" color="primary" onClick={() => addToCart(item)}>
                    <AddCircleOutlineIcon sx={{ width: '100%', height: '100%' }} />
                  </IconButton>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  </Stack>
);

export default CartItem;
