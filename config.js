/**
 * Frontend Configuration for Dukaan
 */

let development = {};
let production = {};

development.domain = "http://localhost:5959";

development.callback_url = development.domain + "/auth";
development.client_id = "2106494837";

development.oneauth = {};
development.oneauth.domain = "https://account.codingblocks.com";
development.oneauth.login_url = development.oneauth.domain + `/oauth/authorize?response_type=code&client_id=${development.client_id}&redirect_uri=${development.callback_url}`;
development.oneauth.logout_url = development.oneauth.domain + `/logout?redirect=${development.domain}/logout`

development.backend = {};
development.backend.domain = "http://localhost:2929";
development.backend.token_url = development.backend.domain + "/auth/token";
development.sentry_dsn = "https://38a08e1b6b3b451f92a744f5566414c8@sentry.codingblocks.com/35";

module.exports = development;