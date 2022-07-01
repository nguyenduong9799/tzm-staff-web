// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import SvgIconStyle from '../../../components/SvgIconStyle';
// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  booking: getIcon('ic_booking'),
  gifts: getIcon('ic_gifts'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      { title: 'app', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
      { title: 'Đơn hàng', path: PATH_DASHBOARD.beaner.orders.root, icon: ICONS.ecommerce },
      { title: 'Cửa hàng', path: PATH_DASHBOARD.driver.suppliers.root, icon: ICONS.cart },
      { title: 'Nạp xu', path: PATH_DASHBOARD.account, icon: ICONS.banking },
      { title: 'Gift', path: PATH_DASHBOARD.beaner.gift.root, icon: ICONS.gifts },
    ],
  },
];

export default navConfig;
