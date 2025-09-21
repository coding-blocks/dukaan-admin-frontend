const path = require('path')

module.exports = {
  env: {
    API_URL: process.env.API_URL,
    TOKEN_URL: process.env.TOKEN_URL,
    DOMAIN: process.env.DOMAIN,
    CALLBACK_URL: process.env.CALLBACK_URL,
    COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
    CLIENT_ID: process.env.CLIENT_ID,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    ONEAUTH_URL: process.env.ONEAUTH_URL,
    ONEAUTH_LOGIN_URL: process.env.ONEAUTH_LOGIN_URL,
    ONEAUTH_LOGOUT_URL: process.env.ONEAUTH_LOGOUT_URL
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles/**/*.scss')],
  },
}