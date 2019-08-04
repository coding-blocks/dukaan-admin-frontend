/**
 * Frontend Configuration for Dukaan
 */

const config = {
    domain: process.env.DOMAIN || "http://localhost:5959",
    callback_url: process.env.CALLBACK_URL || "http://localhost:5959/auth",
    client_id: process.env.CLIENT_ID || "5594502675",
    sentry_dsn: process.env.SENTRY_DSN || "https://randomxyz@sentry.codingblocks.com/35",
    oneauth: {
        domain: process.env.ONEAUTH_URL || "http://localhost:3838",
        login_url: process.env.ONEAUTH_LOGIN_URL || `http://localhost:3838/oauth/authorize?response_type=code&client_id=5594502675&redirect_uri=http://localhost:5959/auth`,
        logout_url: process.env.ONEAUTH_LOGOUT_URL || `http://localhost:3838/logout?redirect=http://localhost:5959/logout`
    },
    dukaan_backend: {
        domain: process.env.API_URL || "http://localhost:2929",
        token_url: process.env.TOKEN_URL || "http://localhost:2929/auth/token"
    },
};

module.exports = config;