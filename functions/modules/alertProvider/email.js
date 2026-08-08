const nodemailer = require('nodemailer');
const functions = require('firebase-functions/v1')
const { formatPrice, hostingUrl, urlFor } = require('../../utils')

// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().pricetrack.gmail_email
const gmailPassword = functions.config().pricetrack.gmail_password
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
})

const APP_NAME = `Pricetrack`
const FROM_EMAIL = `pricetrack.apps@gmail.com`
const EMAIL_SUBJECT = {
    available: ({APP_NAME, PRODUCT_NAME}) => `[${APP_NAME}] Back in stock: ${PRODUCT_NAME}`,
    price_change: ({APP_NAME, PRODUCT_NAME}) => `[${APP_NAME}] Price changed: ${PRODUCT_NAME}`,
    down_below: ({APP_NAME, PRODUCT_NAME}) => `[${APP_NAME}] Price reached your target: ${PRODUCT_NAME}`,
}
const EMAIL_HTML_HEADLINE = {
    available: `The product you're tracking is back in stock`,
    price_change: `The product you're tracking just changed price`,
    down_below: `The product you're tracking is now below your expected price`,
}

const sendEmail = async (email, params) => {
    const mailOptions = {
        from: `${APP_NAME} <${FROM_EMAIL}>`,
        to: email,
    }

    const templateType = ['available', 'down_below'].indexOf(params.expect_when) > -1 ? params.expect_when : 'price_change'
    console.info(`======================= ${JSON.stringify(params)}, ${templateType}`)

    const htmlHeadLine = EMAIL_HTML_HEADLINE[templateType]
    const htmlProductStatus = templateType === 'available'
                                    ? `<li>Status: <strong>${params.inventory_status ? 'In stock' : 'Out of stock'}</strong></li>`
                                    : ``

    const htmlProductExpectPrice = templateType === 'down_below'
                                    ? `<li>Expected price: ${formatPrice(params.expect_price)}</li>`
                                    : ``

    const productLink = urlFor(`redirect/${params.id}`, { ref: 'email' })

    // The user subscribed to the newsletter.
    mailOptions.subject = EMAIL_SUBJECT[templateType]({PRODUCT_NAME: params.info.name, APP_NAME})
    mailOptions.html = `Hi ${email || ''}
    <br /><br />
    ${htmlHeadLine}: <br />

    <ul>
        <li>
            Product: <a href="${productLink}">${params.info.name}</a>
            <a href="${productLink}">(${params.domain})</a>
        </li>
        <li>
            Price Track: <a href="${hostingUrl}/view/${params.id}"><strong>Price history</strong></a> |
            <a href="${productLink}"><strong>Go to product (${params.domain})</strong></a>
        </li>
        <li>
            Price: ${formatPrice(params.latest_price, false, params.info.currency)}
            <strong style="color: ${params.price_change < 0 ? '#2e7d32' : '#c62828'}">
                (${formatPrice(params.price_change, true, params.info.currency)})
            </strong>
        </li>
        ${htmlProductStatus}
        ${htmlProductExpectPrice}
    </ul>
    <br />
    <i>PricetrackBot</i>`;
    
    try {
        let email = await mailTransport.sendMail(mailOptions)
        console.log('Email sent to:', email)
    } catch (err) {
        console.error(`Cannot send email ${email}`, err.message)
    }
}

module.exports = sendEmail