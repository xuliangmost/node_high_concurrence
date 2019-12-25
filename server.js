'use strict';

import NodeProxy from './src/eventproxy';
import express from 'express';
import AsyncStart from './src/asyncMapLimit';
import Queue from './src/asyncqueue';
const app = express();
app.use(function (req, res, next) {
  // 中间件的位置 可用来检测token等用户信息是否过期
  console.log('request before');
  next()
})
app.get('/eventProxt', NodeProxy);
app.get('/mapLimit', AsyncStart);
app.get('/queue', Queue);
app.listen(3000, function () {
  console.log(`list on http://localhost:3000`);
})