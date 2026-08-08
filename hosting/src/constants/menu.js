import {
  HOME, MY_PRODUCT, ABOUT, CASHBACK
} from './routes';

const MENUS = [
  {
    path: HOME,
    text: 'Home'
  },
  {
    path: MY_PRODUCT,
    text: 'My Products',
    auth: true
  },
  {
    path: CASHBACK,
    text: 'Cashback',
    auth: false
  },
  {
    path: ABOUT,
    text: 'About'
  }
];

export default MENUS;
