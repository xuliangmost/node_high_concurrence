'use strict';

import async from 'async'
/* 
  async.queue  流程控制器
*/
const maxCount = 10;

let urls = []
for (let i = 0; i < 50; i++) {
  urls.push(i)
}
let count = 0;
function axios (url, callback) {
  const delay = parseInt((Math.random() * 10000000) % 2000, 10);
  count++;
  console.log('现在的并发数是', count, '，正在抓取的是', url, '，耗时' + delay + '毫秒');
  setTimeout(function () {
    // 调用成功之后  并发数量 -1
    count--;
    //抓取成功，调用回调函数
    callback(null, url + ' html content');
  }, delay);
};

let q = async.queue(function (url, callBack) {
  axios(url, function () {
    callBack(url);
  });
}, maxCount);

function Queue (req, res) {
  const htmls = [];
  /* internet上用的 赋值的方法  一直报错。。后来发现是用回调的方式监听... */
  // q.drain = function () { 
  //   console.log(123);
  // }

  q.drain(function () {
    console.log(htmls.length, '个请求完成');
    res.send(htmls);
  })
  urls.forEach(url => {
    q.push(url, function (url) {
      htmls.push(url);
    });
  })
}

export default Queue