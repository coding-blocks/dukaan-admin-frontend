module.exports = {
  apps:[{
    name: "dukaan-admin-frontend",
    script: "yarn start -p 5959",
    env_production: {
      NODE_ENV: "production"
    }
  }]
}
