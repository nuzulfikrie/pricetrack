module.exports = {
  collection: {
    URLS: 'urls',
    RAW_DATA: 'raw',
    SUBSCRIBE: 'subscribe',
    USER: 'user',
    METADATA: 'metadata',
    CRONJOB_LOGS: 'cronjob_logs',
    MESSAGING_TOKEN: 'messaging_token',
    ADMIN: 'admin',
    CASHBACK: 'cashback',
    NOTIFICATION: 'notification'
  },
  eventType: {
    WRITE: 'google.firestore.document.write'
  },
  text: {
    URL_NOT_FOUND: 'URL not found',
    ERR_EMAIL_NOT_FOUND: 'Email not found',
    ERR_URL_NOT_SUPPORTED: 'Sorry, this URL is not supported yet',
    ERR_EMAIL_REQUIRED: 'Please sign in',
    ERR_TOKEN_INVALID: 'Invalid token',
    ERR_MISSING_URL: 'URL is required',
    ERR_CANNOT_FETCH_DATA: 'Unable to fetch data',
    ERR_NOT_IS_ADMIN: 'User is not an admin user',
    ERR_ID_NOT_FOUND: 'ID not found',
    ERR_500: '500'
  },

  URL_PARAMS_WHITELIST: [],

  email: {
    APP_NAME: `Pricetrack`,
    FROM_EMAIL: `pricetrack.apps@gmail.com`
  },

  UTM: {
    utm_source: 'pricetrack',
    utm_campaign: 'cashback',
  }
}