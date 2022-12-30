const path = require('path')

module.exports = {
  env: {
    API_URL:'https://dukaan.codingblocks.com',
    TOKEN_URL:'https://dukaan.codingblocks.com/auth/token',
    DOMAIN:'https://dukaan-admin.codingblocks.com',
    CALLBACK_URL:'https://dukaan-admin.codingblocks.com/auth',
    COOKIE_DOMAIN:'.codingblocks.com',
    CLIENT_ID:'1166947312',
    SENTRY_DSN:'https://d14fd2af8b56412cac91b44fb7649bf9@sentry.codingblocks.com/39',
    SENTRY_AUTH_TOKEN:'e385e2c9311d4b198281c82f80503d4a64bb3afa42ac460784f01446eb3db1f6',
    ONEAUTH_URL:'https://account.codingblocks.com',
    ONEAUTH_LOGIN_URL:'https://account.codingblocks.com/oauth/authorize?response_type=code&client_id=1166947312&redirect_uri=https://dukaan-admin.codingblocks.com/auth',
    ONEAUTH_LOGOUT_URL:'https://account.codingblocks.com/logout?redirect=https://dukaan-admin.codingblocks.com/'
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles/**/*.scss')],
  },
}