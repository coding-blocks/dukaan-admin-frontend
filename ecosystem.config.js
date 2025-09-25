module.exports = {
  apps:[{
    name: "dukaan-admin-frontend",
    script: "yarn start -p 5959",
    env_production: {
      NODE_ENV: "production",
      API_URL: "https://vmc-dukaan.codingblocks.com",
      DOMAIN: "https://vmc-dukaan-admin.codingblocks.com",
      // COOKIE_DOMAIN: "codingblocks.com"
    }
  }]
}
