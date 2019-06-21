/**
 * Entry Point for Dukaan Admin Frontend Server.
 */

const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.get('/admin/coupons/edit/:id', (req, res) => {
      const actualPage = '/admin/coupons/edit';
      const queryParams = { id: req.params.id };
      app.render(req, res, actualPage, queryParams);
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(5959, err => {
      if (err) throw err;
      console.log('> Ready on http://localhost:5959');
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });