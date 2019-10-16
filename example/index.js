/* eslint-disable no-undef */
const Koa = require('koa');
const app = new Koa();
const route = require('koa-route');

const fs = require('fs');

const test = ctx => {
  ctx.response.type = 'html';
  const res = fs.createReadStream('./example/test.html');
//   console.log(res);
  ctx.response.body = res;
};

const index = ctx => {
    ctx.response.type = 'html';
    const res = fs.createReadStream('./example/index.html');
    // console.log(res);
    ctx.response.body = res;
  };

app.use(route.get('/test', test));
app.use(route.get('/index', index));
app.listen(3000);