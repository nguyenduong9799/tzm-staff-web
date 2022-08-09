import { useCallback, useState } from 'react';
import { STAFF_BEAN_CONFIRM_KEY } from 'utils/constants';
import { getCookie, setCookie } from 'utils/utils';

const useConfirmOrder = (): [boolean, () => void] => {
  const [isConfirmed, setIsConfirmed] = useState(() => {
    try {
      return getCookie(STAFF_BEAN_CONFIRM_KEY).length !== 0;
    } catch (error) {
      return false;
    }
  });

  const confirmChecked = useCallback(() => {
    let confirmTime = new Date();
    setCookie(STAFF_BEAN_CONFIRM_KEY, JSON.stringify(confirmTime), 1 / 24);
    setIsConfirmed(true);
  }, []);

  return [isConfirmed, confirmChecked];
};

export default useConfirmOrder;
