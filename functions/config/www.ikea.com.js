const { regexProcess } = require('../utils/parser/utils')
const fetch = require('node-fetch')
const { JSDOM } = require('jsdom')

// Public app id used by IKEA's own website for the availability API (not a
// user secret). See https://github.com/weareblahs/ikeatoys for reference.
const IKEA_CLIENT_ID = 'b6c117e5-ae61-4ef5-b4cc-e0b1e37f0631'

const getProductData = async (params) => {
  const url = params.url
  const productId = params.productId

  const pageReq = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  })
  const html = await pageReq.text()
  const dom = new JSDOM(html, { features: { QuerySelector: true } })
  const { document } = dom.window

  const priceSrText = (document.querySelector('.pipcom-price-module__current-price .pipcom-price__sr-text') || {}).textContent || ''
  const price = priceSrText.replace(/[^0-9]/g, '')

  const name = (document.querySelector('meta[property="og:title"]') || {}).content || ''
  const description = (document.querySelector('meta[property="og:description"]') || {}).content || ''
  const image = (document.querySelector('meta[property="og:image"]') || {}).content || ''

  // Stock availability across MY stores (public IKEA availability API)
  let inStock = null
  try {
    const availRes = await fetch(
      `https://api.ingka.ikea.com/cia/availabilities/ru/my?itemNos=${productId}&expand=StoresList`,
      { headers: { 'x-client-id': IKEA_CLIENT_ID, 'Accept': 'application/json' } }
    )
    const availJson = await availRes.json()
    inStock = (availJson.availabilities || []).some(a => a.availableForCashCarry === true)
  } catch (e) {
    console.error('IKEA availability lookup failed', e)
  }

  return {
    product_id: productId,
    name,
    description,
    currency: 'MYR',
    price,
    inStock,
    image,
    qty: 0,
  }
}

module.exports = {
  website: 'IKEA Malaysia',
  domain: 'www.ikea.com',
  color: '#0058a3',
  logo: 'https://www.ikea.com/my/en/images/logo.png',
  time_check: 30,
  active: true,

  // e.g. https://www.ikea.com/my/en/p/billy-bookcase-white-00522047/
  // NOTE: hostname (www.ikea.com) is shared by every IKEA country storefront;
  // this config assumes the /my/ (Malaysia) path and MYR pricing.
  productId: u => regexProcess(u, /-([0-9]{8})\/?$/, 1),
  shopId: () => null,
  required: ['productId'],

  product_api: getProductData,
  format_func: json => {
    const price = parseInt(json.price, 10) || 0
    return {
      price,
      is_deal: false,
      qty: 0,
      product_id: json.product_id,
      inventory_status: json.inStock !== false
    }
  },

  product_info_api: getProductData,
  format_product_info: json => {
    const { name, description, currency, image } = json
    return { name, description, currency, image }
  }
}
