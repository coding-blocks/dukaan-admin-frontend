const express = require('express');
const http = express();
const { parse } = require('url');
const next = require('next');
const axios = require('axios');
const dev = process.env.NODE_ENV || 5959 !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const config = require('./config');
const cookieParser = require('cookie-parser');

app.prepare().then(() => {

  http.use(cookieParser());

  http.get('/auth', (req, res) => {
    const code = req.query.code;
    if (!code) {
      res.redirect('/login');
    } else {
      axios.post(config.backend.token_url, {code: code}).then((response) => {
        const jwtToken = response.data.jwtToken;
        res.cookie('dukaan-token', jwtToken)
        res.redirect('/');
      }).catch((error) => {
        // res.redirect('/login');
        res.send("ERROR: " + error);
      });
    }
  });

  http.get('/login', (req, res) => {
    res.redirect(config.oneauth.login_url);
  });

  http.use((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  })

  http.listen(5959, () => {
    console.log(`> Ready on http://localhost:5959`);
  });

});
