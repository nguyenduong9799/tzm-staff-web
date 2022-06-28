import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Box, Card, IconButton, Stack, Typography } from '@mui/material';
import React from 'react';
import { Gift } from 'types/gift';
type Props = {
  item: Gift;
  addToCart: (clickedItem: Gift) => void;
  removeFromCart: (id: number) => void;
};

const Item: React.FC<Props> = ({ item, addToCart, removeFromCart }) => (
  <Card>
    <Stack sx={{ p: 2 }} direction={'row'} spacing={2}>
      <Box flex={1} maxHeight={{ xs: '84px', md: '40rem', lg: '200px' }}>
        <img
          style={{ borderRadius: '16px' }}
          width={'84px'}
          height={'84px'}
          src={item.pic_url}
          alt={item.product_name}
        />
      </Box>
      <Box flex={3}>
        <Stack direction={'column'} justifyContent="flex-start">
          <Box flex={1}>
            <Typography variant="h5">{item.product_name}</Typography>
          </Box>
          <Box flex={3}>
            <Stack direction={'row'} justifyContent="space-between">
              <Box flex={3}>
                <Typography>Giá: {item.price} Bean</Typography>
              </Box>
              <Box flex={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ width: '38px' }}>
                    <IconButton size="small" color="primary" onClick={() => addToCart(item)}>
                      <AddShoppingCartIcon sx={{ width: '100%', height: '100%' }} />
                    </IconButton>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Stack>
  </Card>
);

export default Item;
