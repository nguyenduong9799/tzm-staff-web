import { Stack } from '@mui/material';
import React from 'react';
import { Gift } from 'types/gift';
import CartItem from './CartItem';

type Props = {
  cartItems: Gift[];
  addToCart: (clickedItem: Gift) => void;
  removeFromCart: (id: number) => void;
};

const Cart: React.FC<Props> = ({ cartItems, addToCart, removeFromCart }) => {
  const calculateTotal = (items: Gift[]) =>
    items.reduce((acc: number, item) => acc + item.amount * item.price, 0);

  return (
    <Stack alignContent={'center'}>
      <Stack spacing={2}>
        {cartItems.map((item) => (
          <CartItem
            key={item.product_id}
            item={item}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default Cart;
