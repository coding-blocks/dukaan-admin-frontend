/**
 * Frontend Configuration for Dukaan
 */

const settings = {
    domain: process.env.DOMAIN || "http://localhost:5959",
    client_id: process.env.CLIENT_ID || "2106494837",
    oneauth: {
        domain: process.env.ONEAUTH_URL || "http://account.codingblocks.com"
    },
    dukaan_backend: {
        domain: process.env.API_URL || "http://localhost:2929"
    }
}

const config = {
    domain: settings.domain,
    callback_url: process.env.CALLBACK_URL ||`${settings.domain}/auth`,
    client_id: settings.client_id,
    sentry_dsn: process.env.SENTRY_DSN || "https://randomxyz@sentry.codingblocks.com/35",
    oneauth: {
        domain: settings.oneauth.domain,
        login_url: process.env.ONEAUTH_LOGIN_URL || `${settings.oneauth.domain}/oauth/authorize?response_type=code&client_id=${settings.client_id}&redirect_uri=${settings.domain}/auth`,
        logout_url: process.env.ONEAUTH_LOGOUT_URL || `${settings.dukaan_backend.domain}/logout?redirect=${settings.domain}/logout`
    },
    dukaan_backend: {
        domain: settings.dukaan_backend.domain,
        token_url: process.env.TOKEN_URL || `${settings.dukaan_backend.domain}/auth/token`
    },
};

module.exports = config;
