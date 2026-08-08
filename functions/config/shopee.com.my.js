const shopeeVN = require('./shopee.vn');

module.exports = {
  ...shopeeVN,
  logo: 'https://i.imgur.com/yNu6MC5.png',
  website: 'Shopee MY',
  domain: 'shopee.com.my',
  color: '#ff531d',

  product_api: 'https://shopee.com.my/api/v2/item/get?itemid={product_id}&shopid={shop_id}',
  product_info_api: 'https://shopee.com.my/api/v2/item/get?itemid={product_id}&shopid={shop_id}',
}
